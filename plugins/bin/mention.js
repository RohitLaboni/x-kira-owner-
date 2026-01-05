// lib/mention.js
const { jidNormalizedUser } = require("@whiskeysockets/baileys");
const { MediaUrls } = require("./handler");

/**

Extract last JSON block safely from text.

Returns { json, textWithoutJson }
*/
function extractLastJsonBlock(s = "") {
    const lastOpen = s.lastIndexOf("{");
    if (lastOpen === -1) return { json: null, textWithoutJson: s };
    const maybe = s.slice(lastOpen);
    try {
        const parsed = JSON.parse(maybe);
        const textWithoutJson = s.slice(0, lastOpen).trim();
        return { json: parsed, textWithoutJson };
    } catch (e) {
        return { json: null, textWithoutJson: s };
    }
}


/**

Turn plain numbers like @393938 into full JIDs

and replace &sender with the sender number mention.
*/
function buildMentionList(text, m) {
    const mentions = new Set();
    if (text.includes("&sender")) {
        const number = m.sender.split("@")[0];
        text = text.replace(/&sender/g, "@" + number);
        mentions.add(m.sender);
    }
    // @12345 style mentions
    const atMatches = [...text.matchAll(/@(\d{5,})/g)];
    for (const mm of atMatches) {
        const num = mm[1];
        mentions.add(`${num}@s.whatsapp.net`);
    }
    return { text, mentionedJids: Array.from(mentions) };
}


/**

mention(m, text)

(This version always forces isForwarded=false and forwardingScore=0)
*/
async function mention(m, text = "") {
    try {
        if (!m || !m.client) throw new Error("Missing 'm' (message wrapper) or 'm.client'");

        const types = ["type/image", "type/video", "type/audio", "type/sticker", "type/gif"];

        // extract JSON block
        const { json: parsedJson, textWithoutJson } = extractLastJsonBlock(text || "");
        let msg = (textWithoutJson || text || "").trim();

        // initial message object
        let message = {
            contextInfo: {
                mentionedJid: [m.sender],
                // enforced: forwarded flags are always false by design
                isForwarded: false,
                forwardingScore: 0,
            },
        };

        if (parsedJson) {
            const jsonClone = { ...parsedJson };

            // map legacy linkPreview -> externalAdReply
            if (jsonClone.linkPreview) {
                jsonClone.contextInfo = jsonClone.contextInfo || {};
                jsonClone.contextInfo.externalAdReply = jsonClone.linkPreview;
                delete jsonClone.linkPreview;
            }

            // normalize externalAdReply thumbnail / mediaUrl
            if (jsonClone.contextInfo && jsonClone.contextInfo.externalAdReply) {
                const ear = { ...jsonClone.contextInfo.externalAdReply };
                if (ear.thumbnail && !ear.thumbnailUrl) ear.thumbnailUrl = ear.thumbnail;
                if (ear.mediaUrl && !ear.thumbnailUrl) ear.thumbnailUrl = ear.mediaUrl;
                jsonClone.contextInfo.externalAdReply = ear;
            }

            // Merge safe top-level fields (caption, waveform, ptt, mimetype, etc.)
            message = { ...message, ...jsonClone };

            // Merge safe contextInfo keys selectively (but DO NOT accept forwarded flags)
            if (jsonClone.contextInfo) {
                message.contextInfo = message.contextInfo || {};
                const safeKeys = ["externalAdReply", "mentionedJid"];
                for (const key of safeKeys) {
                    if (jsonClone.contextInfo[key] !== undefined) {
                        message.contextInfo[key] = jsonClone.contextInfo[key];
                    }
                }

                // If user provided mentionedJid array, merge with default  
                if (Array.isArray(jsonClone.contextInfo.mentionedJid)) {
                    message.contextInfo.mentionedJid = Array.from(
                        new Set([...(message.contextInfo.mentionedJid || []), ...jsonClone.contextInfo.mentionedJid])
                    );
                }

            }

            // sanitize
            if (message.contextInfo) {
                delete message.contextInfo.forwardedNewsletterMessageInfo;
                // Enforce cleared forwarded flags ALWAYS
                message.contextInfo.isForwarded = false;
                message.contextInfo.forwardingScore = 0;
            }
        }

        // Determine message type token
        let type = "text";
        for (const t of types) {
            if (msg.includes(t)) {
                type = t.replace("type/", "");
                break;
            }
        }

        // Replace mentions & build final mentionedJids
        const { text: withMentionsReplaced, mentionedJids } = buildMentionList(msg, m);
        msg = withMentionsReplaced;

        // Merge mentionedJids (from detection or JSON)
        if (message.contextInfo?.mentionedJid && Array.isArray(message.contextInfo.mentionedJid)) {
            message.contextInfo.mentionedJid = Array.from(new Set([...message.contextInfo.mentionedJid, ...mentionedJids]));
        } else if (mentionedJids.length) {
            message.contextInfo = message.contextInfo || {};
            message.contextInfo.mentionedJid = mentionedJids;
        }

        // Get media URLs
        let URLS = MediaUrls(msg || "");

        // Media flow
        if (type !== "text" && URLS && URLS.length > 0) {
            for (const url of URLS) msg = msg.replace(url, "");
            msg = msg.replace("type/", "").replace(type, "").replace(/,/g, "").trim();

            const URL = URLS[Math.floor(Math.random() * URLS.length)];
            if (msg) message.caption = msg;

            switch (type) {
                case "image":
                    message.image = { url: URL };
                    if (!message.mimetype) message.mimetype = "image/jpeg";
                    break;
                case "video":
                    message.video = { url: URL };
                    if (!message.mimetype) message.mimetype = "video/mp4";
                    break;
                case "audio":
                    message.audio = { url: URL };
                    if (!message.mimetype) message.mimetype = "audio/mpeg";
                    if (typeof message.ptt === "undefined") message.ptt = true; // default voice-note style
                    break;
                case "sticker":
                    message.sticker = { url: URL };
                    message.mimetype = message.mimetype || "image/webp";
                    delete message.caption;
                    // keep contextInfo only if explicitly provided (but forwarded flags are still cleared)
                    if (!parsedJson?.contextInfo) delete message.contextInfo;
                    break;
                case "gif":
                    message.video = { url: URL };
                    message.gifPlayback = true;
                    if (!message.mimetype) message.mimetype = "video/mp4";
                    break;
                default:
                    throw new Error("Unknown media type: " + type);
            }

            // ensure forward property removed
            delete message.forward;
            // enforce forwarded flags remain cleared
            if (message.contextInfo) {
                message.contextInfo.isForwarded = false;
                message.contextInfo.forwardingScore = 0;
            }
            return await m.client.sendMessage(m.jid, message);
        }

        // Text flow
        if (!message.text) message.text = msg || message.caption || "Hello!";
        if (message.text.includes("@") && (!message.contextInfo || !message.contextInfo.mentionedJid)) {
            const { mentionedJids: auto } = buildMentionList(message.text, m);
            if (auto.length) {
                message.contextInfo = message.contextInfo || {};
                message.contextInfo.mentionedJid = Array.from(new Set([...(message.contextInfo.mentionedJid || []), ...auto]));
            }
        }

        delete message.forward;
        // enforce forwarded flags remain cleared
        if (message.contextInfo) {
            message.contextInfo.isForwarded = false;
            message.contextInfo.forwardingScore = 0;
        }
        return await m.client.sendMessage(m.jid, message);
    } catch (error) {
        console.error("Mention function error:", error);
        // Fallback to simple text message
        try {
            await m.client.sendMessage(m.jid, {
                text: (text || "").substring(0, 300),
                contextInfo: {
                    mentionedJid: [m.sender],
                    isForwarded: false,
                },
            });
        } catch (fallbackError) {
            console.error("Fallback message failed:", fallbackError);
        }
    }
}


module.exports = mention;