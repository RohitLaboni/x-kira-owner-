const { exec } = require("child_process");
const axios = require("axios");
const { Module } = require("../lib/plugins");

/* ---------------- SHUTDOWN ---------------- */
Module({
  command: "shutdown",
  package: "system",
  description: "Shutdown the bot safely via PM2",
})(async (message, match) => {
  const conn = message.conn;
  const mek = message.mek || message.raw || message;
  const from = message.from;
  const isOwner = message.isFromMe || false;
  const reply = (text) => message.send(text);
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
    console.error("Shutdown Error:", error);
    return reply("❌ Failed to shutdown the bot.");
  }
});

/* ---------------- CHECKSTATUS (PM2) ---------------- */
Module({
  command: "checkstatus",
  package: "system",
  description: "Check PM2 Process Status",
})(async (message, match) => {
  const reply = (text) => message.send(text);
  const isOwner = message.isOwner || false;
  if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
  exec("pm2 status", (err, stdout, stderr) => {
    if (err || stderr) return reply("❌ Error:\n" + (stderr || err.message));
    reply("🧠 *Current Bot PM2 Status:*\n\n" + stdout);
  });
});

/* ---------------- AUTO SELF-HEAL ---------------- */
/*process.on('uncaughtException', async (err) => {
  console.error('🚨 BOT CRASH DETECTED:', err);
  const msg = `⚠️ *AUTO SELF-HEAL TRIGGERED!*\n\nError: ${err.message}\n\nBot will restart automatically 🧠`;
  try { await global.conn?.sendMessage(config.OWNER_NUMBER + '@s.whatsapp.net', { text: msg }); } catch (e) {}
  exec('pm2 restart all || node index.js');
});
*/
/* ---------------- FANCY (FONT STYLES) ---------------- */
Module({
  command: "fancy",
  package: "tools",
  description: "Convert text into various fancy fonts.",
})(async (message, match) => {
  const conn = message.conn;
  const mek = message.mek || message.raw || message;
  const from = message.from;
  const q = (match || "").trim();
  const reply = (t) => message.send(t);
  try {
    if (!q) return reply("🎐 *Please provide text example:*\n> `.fancy hello`");
    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(
      q
    )}`;
    const res = await axios.get(apiUrl, { timeout: 15000 });
    if (!res.data.status || !Array.isArray(res.data.result))
      return reply("❌ Failed to fetch fonts. Try again later.");
    const fonts = res.data.result.slice(0, 44);
    let menu = `╭─❰ *FANCY TEXT STYLES* ❱─⬣\n`;
    fonts.forEach((f, i) => {
      menu += `│ ${i + 1}. ${f.result}\n`;
    });
    menu += `╰──────────────────⬣\n🧩 *Reply with number (1-${fonts.length}) to select style for:*\n> *${q}*\n> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*`;
    const sent = await conn.sendMessage(from, { text: menu }, { quoted: mek });
    const messageId = sent.key.id;
    const handler = async (upsert) => {
      const newMsg = upsert.messages?.[0];
      if (!newMsg || !newMsg.message) return;
      const text =
        newMsg.message.conversation || newMsg.message.extendedTextMessage?.text;
      const context = newMsg.message.extendedTextMessage?.contextInfo;
      const replyTo = context?.stanzaId === messageId;
      const sameChat = newMsg.key.remoteJid === from;
      if (replyTo && sameChat) {
        const num = parseInt((text || "").trim());
        if (isNaN(num) || num < 1 || num > fonts.length)
          return conn.sendMessage(
            from,
            { text: `❎ Invalid selection. Choose between 1-${fonts.length}.` },
            { quoted: newMsg }
          );
        const result = fonts[num - 1].result;
        await conn.sendMessage(from, { text: result }, { quoted: newMsg });
        conn.ev.off("messages.upsert", handler);
      }
    };
    conn.ev.on("messages.upsert", handler);
  } catch (err) {
    console.error("Fancy Error:", err);
    return reply("❌ Something went wrong. Please try again.");
  }
});

/* ---------------- CHANNEL INFO / NEWSLETTER (.cid) ---------------- */
Module({
  command: "newsletter",
  package: "tools",
  description: "Get WhatsApp Channel info from link",
})(async (message, match) => {
  const conn = message.conn;
  const mek = message.mek || message.raw || message;
  const from = message.from;
  const q = (match || "").trim();
  const reply = (t) => message.send(t);
  try {
    if (!q)
      return reply(
        "❎ Please provide a WhatsApp Channel link.\n\nExample: *.cid https://whatsapp.com/channel/123456789*"
      );
    const matchLink = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!matchLink)
      return reply(
        "⚠️ Invalid channel link format.\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx"
      );
    const inviteId = matchLink[1];
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
    const infoText = `\`「 CHANNEL INFO 」\`\n╭─────────────────⊷\n│🆔 *ID:* ${
      metadata.id
    }\n│📛 *Name:* ${metadata.name}\n│👥 *Followers:* ${
      metadata.subscribers?.toLocaleString() || "N/A"
    }\n│📅 *Created On:* ${
      metadata.creation_time
        ? new Date(metadata.creation_time * 1000).toLocaleString("en-IN")
        : "Unknown"
    }\n╰────────────────┈⊷\n> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*`;
    if (metadata.preview) {
      await conn.sendMessage(
        from,
        {
          image: { url: `https://pps.whatsapp.net${metadata.preview}` },
          caption: infoText,
        },
        { quoted: mek }
      );
    } else {
      await reply(infoText);
    }
    (await message.react) && message.react("✅");
  } catch (error) {
    console.error("CID Error:", error);
    return reply(
      "⚠️ An unexpected error occurred while fetching channel info."
    );
  }
});

/* ---------------- PAIR (generate pairing code) ---------------- */
/*Module({ command: 'pair', package: 'owner', description: 'Generate a WhatsApp Pairing Code' })(async (message, match) => {
  const conn = message.conn; const mek = message.mek || message.raw || message; const from = message.from; const isOwner = message.isOwner || false; const q = (match||'').trim(); const reply = t => message.send(t);
  if (!isOwner) return reply('*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*');
  if (!q) return reply('⚠️ Please provide a phone number to generate the pairing code.');
  try {
    const apiUrl = `https://ali-pair-xode.onrender.com/code?number=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl, { timeout: 15000 });
    if (!response.data?.code) return reply('❌ Failed to retrieve pairing code. Please try again.');
    const pairCode = response.data.code;
    const messageText = `\`「 PAIR GENERATED 」\`\n╭─────────────────⊷\n│👤 *User:* ${message.pushname || 'User'}\n│📞 *Phone:* ${q}\n│🔑 *Code:* ${pairCode}\n│⏰ *Expires In:* 1 Minute\n│⚙️ *Status:* Active\n╰────────────────┈⊷\n> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*`;
    const msg = { image: { url: config.BOT_PIC }, caption: messageText, contextInfo: { mentionedJid: [message.sender], forwardingScore: 10, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363318387454868@newsletter', newsletterName: 'ѕтα፝֟꧊ꝛ̴͜ƙ-м∂ ѕυ꧊᭡꧊᭡σʀт', serverMessageId: 143 } } };
    await conn.sendMessage(from, msg, { quoted: mek });
    await conn.sendMessage(from, { text: pairCode }, { quoted: mek });
    await message.react && message.react('✅');
  } catch (error) {
    console.error('PAIR Error:', error);
    return reply(`❌ *Error fetching pairing code:*\n${error.message}`);
  }
});*/

/* ---------------- WHOIS ---------------- */
Module({
  command: "whois",
  package: "tools",
  description: "Fetch user profile info (name, about, and profile picture).",
})(async (message, match) => {
  const conn = message.conn;
  const mek = message.mek || message.raw || message;
  const args = (match || "").trim().split(/\s+/);
  const reply = (t) => message.send(t);
  try {
    let user;
    const m = message.raw || mek;
    if (m.quoted) user = m.quoted.sender;
    else if (message.mentionedJid && message.mentionedJid.length > 0)
      user = message.mentionedJid[0];
    else if (args[0]) user = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    else user = m.sender;
    let ppUrl;
    try {
      ppUrl = await conn.profilePictureUrl(user, "image");
    } catch {
      ppUrl = "https://telegra.ph/file/4cc2712a538d4ef3ba456.jpg";
    }
    let status = "Private / Hidden";
    try {
      const fetched = await conn.fetchStatus(user);
      if (fetched && fetched.status) status = fetched.status;
    } catch {}
    let name;
    try {
      name = await conn.getName(user);
    } catch {
      name = user.split("@")[0];
    }
    const link = `https://wa.me/${user.split("@")[0]}`;
    const now = new Date();
    const date = now.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const caption = `\`「 🔍 USER INFO 」\`\n╭────────────────⊷\n│👤 *Name:* ${name}\n│💬 *About:* ${status}\n│📅 *Checked On:* ${date}\n│🌐 *WhatsApp:* ${link}\n╰───────────────┈⊷\n> *© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩*`;
    await conn.sendMessage(
      message.from,
      { image: { url: ppUrl }, caption, mentions: [user] },
      { quoted: mek }
    );
    (await message.react) && message.react("✅");
  } catch (err) {
    console.error("WHOIS Error:", err);
    return reply("⚠️ Failed to fetch user info,");
  }
});

/* ---------------- SPAM (owner only) ---------------- */
Module({
  command: "spam",
  package: "owner",
  description: "Send fast spam messages (supports text or replied sticker)",
})(async (message, match) => {
  const conn = message.conn;
  const mek = message.mek || message.raw || message;
  const from = message.from;
  const isOwner = message.isFromMe || false;
  const q = (match || "").trim();
  const reply = (t) => message.send(t);
  if (!isOwner) return reply("*📛 Only owner can use this command!*");
  try {
    const quoted = mek.quoted;
    const isSticker =
      quoted && Object.keys(quoted.message || {})[0] === "stickerMessage";
    let count = 1;
    let text = "";
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
      return reply("⚠️ Usage: `.spam 20,hello` or reply to sticker `.spam 10`");
    if (isSticker) {
      const buffer = await conn.downloadMediaMessage(quoted);
      if (!buffer) return reply("⚠️ Failed to download sticker!");
      for (let i = 0; i < count; i++) {
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
        await new Promise((res) => setTimeout(res, 200));
      }
      return await conn.sendMessage(from, {
        react: { text: "✅", key: mek.key },
      });
    }
    if (!text) return reply("⚠️ Usage: `.spam 50,hello`");
    for (let i = 0; i < count; i++) {
      await conn.sendMessage(from, { text }, { quoted: mek });
      await new Promise((res) => setTimeout(res, 100));
    }
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
  } catch (e) {
    console.error("Spam Error:", e);
    return reply(`❌ Error: ${e.message}`);
  }
});

/* ---------------- GROUPINFO ---------------- */
Module({
  command: "groupinfo",
  package: "tools",
  description: "Get WhatsApp Group info (from link or current group)",
})(async (message, match) => {
  const conn = message.conn;
  const mek = message.mek || message.raw || message;
  const from = message.from;
  const q = (match || "").trim();
  const isGroup = message.isGroup || false;
  const groupMetadata = message.groupMetadata || null;
  const reply = (t) => message.send(t);
  try {
    let groupInfo;
    if (q && q.includes("chat.whatsapp.com")) {
      const matchLink = q.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
      if (!matchLink)
        return reply(
          "⚠️ Invalid group link format.\nMake sure it looks like:\nhttps://chat.whatsapp.com/xxxxxxxx"
        );
      const inviteCode = matchLink[1];
      try {
        groupInfo = await conn.groupGetInviteInfo(inviteCode);
      } catch {
        return reply(
          "❌ Failed to fetch group info. The link may be invalid or private."
        );
      }
    } else if (isGroup) {
      groupInfo = groupMetadata;
    } else {
      return reply(
        "❎ Please provide a group link or use this command *inside a group*."
      );
    }
    if (!groupInfo) return reply("⚠️ Group info not found.");
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
    const caption = `\`「 GROUP INFO 」\`\n╭────────────────⊷\n│🆔 *ID:* ${groupID}\n│📛 *Name:* ${groupName}\n│👑 *Owner:* ${groupOwner}\n│👥 *Members:* ${memberCount}\n│📅 *Created On:* ${creationDate}\n╰────────────────┈⊷\n📝 *Description:* ${description}\n> *© ᴘσωєʀєᴅ ʙʏ ѕтα፝֟꧊ꝛ̴͜ƙ ᴍᴅ 🚩*`;
    let pfp = null;
    try {
      pfp = await conn.profilePictureUrl(groupID, "image");
    } catch {
      pfp = null;
    }
    if (pfp)
      await conn.sendMessage(
        from,
        {
          image: { url: pfp },
          caption,
          mentions: groupOwner !== "N/A" ? [groupInfo.owner] : [],
        },
        { quoted: mek }
      );
    else
      await conn.sendMessage(
        from,
        {
          text: caption,
          mentions: groupOwner !== "N/A" ? [groupInfo.owner] : [],
        },
        { quoted: mek }
      );
    (await message.react) && message.react("✅");
  } catch (err) {
    console.error("GroupInfo Error:", err);
    return reply("⚠️ Error: " + err.message);
  }
});

// End of converted system/tools modules
