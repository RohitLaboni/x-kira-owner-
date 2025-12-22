const { exec } = require("child_process");
const os = require("os");
const axios = require("axios");
const { cmd, config, commands, sleep } = require("../lib");
const moment = require("moment-timezone");

const { BOT_PIC, MODE, VERSION, PREFIX, TIME_ZONE } = config;

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

// Format Memory
function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
const ram = `${formatBytes(os.freemem())}/${formatBytes(os.totalmem())}`;

// 🧠 SYSTEM STATUS
cmd(
  {
    pattern: "system",
    alias: ["status"],
    react: "⚙️",
    desc: "Check Bot's System Status",
    category: "system",
    filename: __filename,
  },
  async (conn, mek, m, { from, isOwner, reply, pushname }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");

    const uptime = () => {
      const sec = process.uptime();
      const d = Math.floor(sec / (3600 * 24));
      const h = Math.floor((sec % (3600 * 24)) / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      return `${d}d ${h}h ${m}m ${s}s`;
    };

    const date = moment().tz(TIME_ZONE).format("DD/MM/YYYY");
    const time = moment().tz(TIME_ZONE).format("hh:mm:ss A");

    const text = `
\`「 BOT SYSTEM STATUS 」\`
╭─────────────────⊷
│⚙️ *Mode:* ${MODE}
│💠 *Prefix:* [ ${PREFIX} ]
│👤 *User:* ${pushname}
│📦 *Version:* ${VERSION}
│🧩 *Plugins:* ${commands.filter((c) => c.pattern).length}
│⏰ *Uptime:* ${uptime()}
│🕐 *Time:* ${time}
│📆 *Date:* ${date}
│🖥 *Platform:* ${os.platform()}
│🌐 *Time Zone:* ${TIME_ZONE}
│💻 *RAM Usage:* ${ram}
╰────────────────┈⊷
> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*`;

    await conn.sendMessage(
      from,
      {
        image: { url: BOT_PIC },
        caption: text,
        contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363318387454868@newsletter",
            newsletterName: "ѕтα፝֟꧊ꝛ̴͜ƙ-м∂ ѕυ꧊᭡꧊᭡σʀт",
            serverMessageId: 143,
          },
        },
      },
      { quoted: mek }
    );
  }
);

// 🧩 ALL VARS
cmd(
  {
    pattern: "allvar",
    alias: ["setting", "env", "vars"],
    react: "🧩",
    desc: "Get Bot's Settings List.",
    category: "system",
    filename: __filename,
  },
  async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");

    const caption = `\`「 BOT VARIABLES 」\`
╭─────────────────⊷
│ ☄︎ *Mode:* ${config.MODE}
│ ☄︎ *Auto Read Status:* ${config.AUTO_STATUS_VIEWS}
│ ☄︎ *Auto Like Status:* ${config.AUTO_STATUS_REACTS}
│ ☄︎ *Auto Like Emojis:* ${config.AUTO_STATUS_EMOJIS}
│ ☄︎ *Auto Reply Status:* ${config.AUTO_STATUS_REPLY}
│ ☄︎ *Status Reply Msg:* ${config.STATUS_REPLY_MSG}
│ ☄︎ *Anti-Link:* ${config.ANTILINK}
│ ☄︎ *Anti-Delete:* ${config.ANTI_DELETE}
│ ☄︎ *Anti-Call:* ${config.ANTI_CALL}
│ ☄︎ *Anti-Call Msg:* ${config.ANTICALL_MSG}
│ ☄︎ *Mention Reply:* ${config.MENTION_REPLY || "false"}
│ ☄︎ *Anti-Bad Words:* ${config.ANTIBAD}
│ ☄︎ *Bad Words:* ${config.BAD_WORDS}
│ ☄︎ *Auto React:* ${config.AUTO_REACT}
│ ☄︎ *Owner React:* ${config.OWNER_REACT}
│ ☄︎ *Owner Name:* ${config.OWNER_NAME}
│ ☄︎ *Owner Number:* ${config.OWNER_NUMBER}
│ ☄︎ *Bot Name:* ${config.BOT_NAME}
│ ☄︎ *Bot Picture:* ${config.BOT_PIC}
│ ☄︎ *Sticker Pack Name:* ${config.PACK_NAME}
│ ☄︎ *Sticker Pack Author:* ${config.PACK_AUTHOR}
│ ☄︎ *Auto Audio:* ${config.AUTO_AUDIO}
│ ☄︎ *Auto Bio:* ${config.AUTO_BIO}
│ ☄︎ *Auto Bio Quote:* ${config.AUTO_BIO_QUOTE}
│ ☄︎ *Welcome:* ${config.WELCOME}
│ ☄︎ *Prefix:* [${config.PREFIX}]
│ ☄︎ *Time Zone:* ${config.TIME_ZONE}
│ ☄︎ *Session ID:* ${config.SESSION_ID ? "✅ Set" : "❌ Not Set"}
│ ☄︎ *Sudo Numbers:* ${config.SUDO_NUMBERS || "None"}
│ ☄︎ *Auto Read Messages:* ${config.AUTO_READ_MESSAGES}
│ ☄︎ *Auto Block:* ${config.AUTO_BLOCK}
│ ☄︎ *Presence:* ${config.PRESENCE}
│ ☄︎ *Heroku App Name:* ${config.HEROKU_APP_NAME || "❌ Not Set"}
│ ☄︎ *Heroku API Key:* ${config.HEROKU_API_KEY ? "✅ Set" : "❌ Not Set"}
│ ☄︎ *Version:* ${config.VERSION || "7.0.0"}
╰────────────────┈⊷
> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*`;

    await conn.sendMessage(
      from,
      {
        image: { url: config.BOT_PIC || "https://files.catbox.moe/2ka956.jpg" },
        caption,
        contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363318387454868@newsletter",
            newsletterName: "ѕтα፝֟꧊ꝛ̴͜ƙ-м∂ ѕυ꧊᭡꧊᭡σʀт",
            serverMessageId: 143,
          },
        },
      },
      { quoted: mek }
    );
  }
);

// 🔁 REBOOT

// --------------------- RESTART BOT ---------------------
cmd(
  {
    pattern: "update",
    alias: ["restart", "up"],
    desc: "Restart the bot system safely",
    category: "owner",
    react: "♻️",
    filename: __filename,
  },
  async (conn, mek, m, { from, isOwner, reply }) => {
    try {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");

      const platform = process.env.HEROKU_APP_NAME
        ? "☁️ Heroku"
        : os.hostname();
      const initMsg = await conn.sendMessage(
        from,
        {
          text: `*🎀 ιɴιтιαтιɴg ѕуѕтєм υρ∂αтє...*`,
        },
        { quoted: mek }
      );

      const steps = [
        "*🔍 ¢нє¢кιɴg ѕуѕтєм ѕтαтυѕ...*",
        "*🛠️ ρʀєραʀιɴg υρ∂αтє ¢σмρσɴєɴтѕ...*",
        "*📦 fιɴαℓιzιɴg ρα¢кαgєѕ...*",
        "*⚡ σρтιмιzιɴg ρєʀfσʀмαɴ¢є...*",
        "*🔥 ʀєα∂у fσʀ ʀєѕтαʀт...*",
        "*🛠 αρρℓуιɴg ℓαтєѕт ᴜρ∂αтєѕ*",
      ];

      for (const step of steps) {
        await sleep(1200);
        await conn.relayMessage(
          from,
          {
            protocolMessage: {
              key: initMsg.key,
              type: 14,
              editedMessage: { conversation: step },
            },
          },
          {}
        );
      }

      await sleep(1000);
      await conn.sendMessage(
        from,
        { text: "*✅ вσт ᴜρ∂αтє sᴜᴄᴄєѕѕfυℓℓу!*" },
        { quoted: mek }
      );

      // Restart using PM2
      exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) console.error("Restart error:", error.message);
        if (stderr) console.error("Restart stderr:", stderr);
        console.log("Restart output:", stdout);
      });
    } catch (err) {
      console.error("Restart Command Error:", err);
      reply(`❌ *Restart failed!*\n\n> ${err.message}`);
    }
  }
);

// --------------------- SHUTDOWN BOT ---------------------
cmd(
  {
    pattern: "shutdown",
    desc: "Shutdown the bot safely via PM2",
    category: "system",
    filename: __filename,
  },
  async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");

    try {
      await reply("⏹️ Shutting down the bot...");
      setTimeout(() => {
        exec("pm2 stop all", (err, stdout, stderr) => {
          if (err) console.error("Shutdown error:", err);
          console.log(stdout);
        });
      }, 1500);
    } catch (error) {
      console.error("Shutdown command error:", error);
      reply("❌ Failed to shutdown the bot.");
    }
  }
);

// 📊 CHECK STATUS
cmd(
  {
    pattern: "checkstatus",
    desc: "Check PM2 Process Status",
    category: "system",
    filename: __filename,
  },
  async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    exec("pm2 status", (err, stdout, stderr) => {
      if (err || stderr) return reply("❌ Error:\n" + (stderr || err.message));
      reply("🧠 *Current Bot PM2 Status:*\n\n" + stdout);
    });
  }
);

// 💥 AUTO SELF HEAL
process.on("uncaughtException", async (err) => {
  console.error("🚨 BOT CRASH DETECTED:", err);
  const msg = `⚠️ *AUTO SELF-HEAL TRIGGERED!*\n\nError: ${err.message}\n\nBot will restart automatically 🧠`;
  try {
    await global.conn.sendMessage(config.OWNER_NUMBER + "@s.whatsapp.net", {
      text: msg,
    });
  } catch {}
  exec("pm2 restart all || node index.js");
});

cmd(
  {
    pattern: "fancy",
    alias: ["font", "style"],
    react: "✍️",
    desc: "Convert text into various fancy fonts.",
    category: "tools",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q)
        return reply("🎐 *Please provide text example:*\n> `.fancy hello`");

      const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(
        q
      )}`;
      const res = await axios.get(apiUrl);

      if (!res.data.status || !Array.isArray(res.data.result)) {
        return reply("❌ Failed to fetch fonts. Try again later.");
      }

      const fonts = res.data.result.slice(0, 44);
      let menu = `╭─❰ *FANCY TEXT STYLES* ❱─⬣\n`;

      fonts.forEach((f, i) => {
        menu += `│ ${i + 1}. ${f.result}\n`;
      });

      menu += `╰──────────────────⬣
🧩 *Reply with number (1-${fonts.length}) to select style for:*
> *${q}*
> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*`;

      const sent = await conn.sendMessage(from, { text: menu }, { quoted: m });
      const messageId = sent.key.id;

      const handler = async (msg) => {
        const newMsg = msg.messages?.[0];
        if (!newMsg || !newMsg.message) return;

        const text =
          newMsg.message.conversation ||
          newMsg.message.extendedTextMessage?.text;
        const context = newMsg.message.extendedTextMessage?.contextInfo;
        const replyTo = context?.stanzaId === messageId;
        const sameChat = newMsg.key.remoteJid === from;

        if (replyTo && sameChat) {
          const num = parseInt(text.trim());
          if (isNaN(num) || num < 1 || num > fonts.length)
            return conn.sendMessage(
              from,
              {
                text: `❎ Invalid selection. Choose between 1-${fonts.length}.`,
              },
              { quoted: newMsg }
            );

          const result = fonts[num - 1].result;
          await conn.sendMessage(from, { text: result }, { quoted: newMsg });

          // 🔒 Stop listening after response (to avoid duplicate triggers)
          conn.ev.off("messages.upsert", handler);
        }
      };

      conn.ev.on("messages.upsert", handler);
    } catch (err) {
      console.error("⚠️ Fancy Command Error:", err);
      reply("❌ Something went wrong. Please try again.");
    }
  }
);

// ─── 🌐 CHANNEL INFO COMMAND (.cid / .channelid) ───
cmd(
  {
    pattern: "newsletter",
    alias: ["cjid", "id", "channelid"],
    react: "⏳",
    desc: "Get WhatsApp Channel info from link",
    category: "tools",
    filename: __filename,
  },
  async (conn, mek, m, { from, args, q, reply }) => {
    try {
      if (!q)
        return reply(
          "❎ Please provide a WhatsApp Channel link.\n\nExample: *.cid https://whatsapp.com/channel/123456789*"
        );

      const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
      if (!match)
        return reply(
          "⚠️ Invalid channel link format.\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx"
        );

      const inviteId = match[1];
      let metadata;

      try {
        metadata = await conn.newsletterMetadata("invite", inviteId);
      } catch {
        return reply(
          "❌ Failed to fetch channel metadata. Make sure the link is correct."
        );
      }

      if (!metadata || !metadata.id)
        return reply("❌ Channel not found or inaccessible.");

      const infoText = `\`「 CHANNEL INFO 」\`
╭─────────────────⊷
│🆔 *ID:* ${metadata.id}
│📛 *Name:* ${metadata.name}
│👥 *Followers:* ${metadata.subscribers?.toLocaleString() || "N/A"}
│📅 *Created On:* ${
        metadata.creation_time
          ? new Date(metadata.creation_time * 1000).toLocaleString("en-IN")
          : "Unknown"
      }
╰────────────────┈⊷
> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*
`;
      if (metadata.preview) {
        await conn.sendMessage(
          from,
          {
            image: { url: `https://pps.whatsapp.net${metadata.preview}` },
            caption: infoText,
          },
          { quoted: m }
        );
      } else {
        await reply(infoText);
      }

      await m.react("✅");
    } catch (error) {
      console.error("❌ Error in .cid command:", error);
      reply("⚠️ An unexpected error occurred while fetching channel info.");
    }
  }
);

// ─── 🆔 JID COMMAND (CREATOR ONLY) ───
cmd(
  {
    pattern: "jid",
    alias: ["chatid", "gjid"],
    desc: "Get full JID of current chat/user (Owner Only)",
    react: "🆔",
    category: "tools",
    filename: __filename,
  },
  async (conn, mek, m, { from, isOwner, reply }) => {
    try {
      if (!isOwner) return reply("📛 *This is an owner-only command!*");

      const isGroup = from.endsWith("@g.us");
      let targetJid;

      // ✅ If message is a reply → get replied user's JID
      if (m.quoted) {
        targetJid = m.quoted.sender;
        await reply(`${targetJid}`);
      }
      // ✅ If message is from a group → show group JID
      else if (isGroup) {
        await reply(`${from}`);
      }
      // ✅ Else → show sender's own JID
      else {
        const sender = mek.key.participant || mek.key.remoteJid;
        const userJID = sender.endsWith("@s.whatsapp.net")
          ? sender
          : `${sender}@s.whatsapp.net`;
        await reply(`${userJID}`);
      }

      await m.react("✅");
    } catch (e) {
      console.error("JID Command Error:", e);
      await reply(`⚠️ *Error fetching JID:*\n${e.message}`);
      await m.react("❌");
    }
  }
);

cmd(
  {
    pattern: "pair",
    alias: ["getsess", "paircode", "linkphone", "getpaircode"],
    desc: "Generate a WhatsApp Pairing Code",
    category: "owner",
    react: "📱",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    if (!q)
      return reply(
        "⚠️ Please provide a phone number to generate the pairing code."
      );

    try {
      // 🌐 Fetch Pairing Code
      const apiUrl = `https://ali-pair-xode.onrender.com/code?number=${encodeURIComponent(
        q
      )}`;
      const response = await axios.get(apiUrl);

      if (!response.data?.code) {
        return reply("❌ Failed to retrieve pairing code. Please try again.");
      }

      const pairCode = response.data.code;

      const messageText = `
\`「 PAIR GENERATED 」\`
╭─────────────────⊷
│👤 *User:* ${m.pushName}
│📞 *Phone:* ${q}
│🔑 *Code:* ${pairCode}
│⏰ *Expires In:* 1 Minute
│⚙️ *Status:* Active
╰────────────────┈⊷
> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*
`;
      const msg = {
        image: { url: config.BOT_PIC },
        caption: messageText,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 10,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363318387454868@newsletter",
            newsletterName: "ѕтα፝֟꧊ꝛ̴͜ƙ-м∂ ѕυ꧊᭡꧊᭡σʀт",
            serverMessageId: 143,
          },
        },
      };

      await conn.sendMessage(from, msg, { quoted: mek });
      await conn.sendMessage(from, { text: pairCode }, { quoted: mek });
      await m.react("✅");
    } catch (error) {
      console.error("PAIR COMMAND ERROR:", error);
      reply(`❌ *Error fetching pairing code:*\n${error.message}`);
    }
  }
);

cmd(
  {
    pattern: "whois",
    react: "🔍",
    desc: "Fetch user profile info (name, about, and profile picture).",
    category: "tools",
    filename: __filename,
  },
  async (conn, mek, m, { args, reply }) => {
    try {
      // 🎯 Target User Detection
      let user;
      if (m.quoted) user = m.quoted.sender;
      else if (m.mentionedJid && m.mentionedJid.length > 0)
        user = m.mentionedJid[0];
      else if (args[0])
        user = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      else user = m.sender;

      // 🖼️ Get Profile Picture (with fallback)
      let ppUrl;
      try {
        ppUrl = await conn.profilePictureUrl(user, "image");
      } catch {
        ppUrl = "https://telegra.ph/file/4cc2712a538d4ef3ba456.jpg";
      }

      // 💬 Get About / Status (safe catch)
      let status = "Private / Hidden";
      try {
        const fetched = await conn.fetchStatus(user);
        if (fetched && fetched.status) status = fetched.status;
      } catch {}

      // 🪪 Get Display Name (with fallback)
      let name;
      try {
        name = await conn.getName(user);
      } catch {
        name = user.split("@")[0];
      }

      // 🌐 WhatsApp link
      const link = `https://wa.me/${user.split("@")[0]}`;

      // 🕒 Date formatting
      const now = new Date();
      const date = now.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // 💎 Styled Caption (ALI-MD format)
      const caption = `\`「 🔍 USER INFO 」\`
╭────────────────⊷
│👤 *Name:* ${name}
│💬 *About:* ${status}
│📅 *Checked On:* ${date}
│🌐 *WhatsApp:* ${link}
╰───────────────┈⊷
> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*
`;

      // ✅ Send message
      await conn.sendMessage(
        m.chat,
        {
          image: { url: ppUrl },
          caption,
          mentions: [user],
        },
        { quoted: mek }
      );

      await m.react("✅");
    } catch (err) {
      console.error("❌ WHOIS Error:", err);
      await reply("⚠️ Failed to fetch user info,");
    }
  }
);

cmd(
  {
    pattern: "spam",
    alias: ["fastspam", "spm"],
    desc: "Send fast spam messages (supports text or replied sticker)",
    category: "owner",
    react: "⚡",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, isOwner, reply }) => {
    try {
      if (!isOwner) return reply("*📛 Only owner can use this command!*");

      const quoted = m.quoted;
      const isSticker =
        quoted && Object.keys(quoted.message || {})[0] === "stickerMessage";

      let count = 1;
      let text = "";

      // ✅ Parse text command
      if (q && q.includes(",")) {
        const [countStr, ...textArr] = q.split(",");
        count = parseInt(countStr.trim());
        text = textArr.join(",").trim();
      } else if (q && !isSticker) {
        count = 1;
        text = q.trim();
      } else if (isSticker && q) {
        count = parseInt(q.trim());
      }

      if (isNaN(count) || count < 1)
        return reply(
          "⚠️ Usage: `.spam 20,hello` or reply to sticker `.spam 10`"
        );

      // 🧩 Sticker Spam
      if (isSticker) {
        const buffer = await conn.downloadMediaMessage(quoted); // ✅ Fixed for Baileys
        if (!buffer) return reply("⚠️ Failed to download sticker!");

        // reply(`🌀 Sending sticker ${count} times...`);

        for (let i = 0; i < count; i++) {
          await conn.sendMessage(from, { sticker: buffer }, { quoted: mek }); // ✅ Add quoted
          await new Promise((res) => setTimeout(res, 200));
        }

        return await conn.sendMessage(from, {
          react: { text: "✅", key: m.key },
        });
      }

      // 🧩 Text Spam
      if (!text) return reply("⚠️ Usage: `.spam 50,hello`");

      // reply(`🚀 Sending ${count} messages...\n📨 Content: ${text}`);

      for (let i = 0; i < count; i++) {
        await conn.sendMessage(from, { text }, { quoted: mek }); // ✅ Add quoted
        await new Promise((res) => setTimeout(res, 100));
      }

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error("Spam Error:", e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);

cmd(
  {
    pattern: "groupinfo",
    alias: ["gid", "ginfo", "groupid"],
    react: "👥",
    desc: "Get WhatsApp Group info (from link or current group)",
    category: "tools",
    filename: __filename,
  },
  async (conn, mek, m, { from, args, q, isGroup, groupMetadata, reply }) => {
    try {
      let groupInfo;

      // 🧩 IF LINK PROVIDED
      if (q && q.includes("chat.whatsapp.com")) {
        const match = q.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
        if (!match)
          return reply(
            "⚠️ Invalid group link format.\nMake sure it looks like:\nhttps://chat.whatsapp.com/xxxxxxxx"
          );

        const inviteCode = match[1];
        try {
          groupInfo = await conn.groupGetInviteInfo(inviteCode);
        } catch {
          return reply(
            "❌ Failed to fetch group info. The link may be invalid or private."
          );
        }
      }

      // 🧩 ELSE (CURRENT GROUP)
      else if (isGroup) {
        groupInfo = groupMetadata;
      } else {
        return reply(
          "❎ Please provide a group link or use this command *inside a group*."
        );
      }

      if (!groupInfo) return reply("⚠️ Group info not found.");

      // 🧾 Prepare Info
      const groupID = groupInfo.id || from;
      const groupName = groupInfo.subject || groupInfo.name || "Unknown";
      const groupOwner = groupInfo.owner
        ? "@" + groupInfo.owner.split("@")[0]
        : "N/A";
      const memberCount =
        groupInfo.size || groupInfo.participants?.length || "N/A";
      const creationDate = groupInfo.creation
        ? new Date(groupInfo.creation * 1000).toLocaleString("en-IN")
        : "Unknown";
      const description =
        groupInfo.desc || groupInfo.description || "No description";

      const caption = `\`「 GROUP INFO 」\`
╭────────────────⊷
│🆔 *ID:* ${groupID}
│📛 *Name:* ${groupName}
│👑 *Owner:* ${groupOwner}
│👥 *Members:* ${memberCount}
│📅 *Created On:* ${creationDate}
╰────────────────┈⊷
📝 *Description:* ${description}

> *© ᴘσωєʀєᴅ ʙʏ ѕтα፝֟꧊ꝛ̴͜ƙ ᴍᴅ 🚩*
`;

      // 🖼️ Try to fetch group picture
      let pfp;
      try {
        pfp = await conn.profilePictureUrl(groupID, "image");
      } catch {
        pfp = null;
      }

      if (pfp) {
        await conn.sendMessage(
          from,
          {
            image: { url: pfp },
            caption,
            mentions: groupOwner !== "N/A" ? [groupInfo.owner] : [],
          },
          { quoted: m }
        );
      } else {
        await conn.sendMessage(
          from,
          {
            text: caption,
            mentions: groupOwner !== "N/A" ? [groupInfo.owner] : [],
          },
          { quoted: m }
        );
      }

      await m.react("✅");
    } catch (err) {
      console.error("❌ GroupInfo Error:", err);
      reply("⚠️ Error: " + err.message);
    }
  }
);
