const { cmd } = require('../lib');
const { getBuffer } = require('../lib/functions');

// ===== 30+ FUN IMAGE COMMANDS =====

// 1. WANTED
cmd({
    pattern: "wanted",
    desc: "Wanted poster overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/wanted?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🔫 WANTED!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 2. TRASH
cmd({
    pattern: "trash",
    desc: "Trash overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/trash?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🗑️ Trash!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 3. FACEPALM
cmd({
    pattern: "facepalm",
    desc: "Facepalm overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/facepalm?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🤦 FACEPALM!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 4. JAIL
cmd({
    pattern: "jail",
    desc: "Jail overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/jail?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🚔 Jail!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 5. WASTED
cmd({
    pattern: "wasted",
    desc: "Wasted overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/wasted?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "💀 WASTED!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 6. COMRADE
cmd({
    pattern: "comrade",
    desc: "Comrade overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/comrade?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "✊ COMRADE!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 7. BEAUTIFUL
cmd({
    pattern: "beautiful",
    desc: "Beautiful overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/beautiful?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "💖 BEAUTIFUL!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 8. HORNY
cmd({
    pattern: "horny",
    desc: "Horny overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/horny?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "😏 HORNY!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 9. CUTE
cmd({
    pattern: "cute",
    desc: "Cute overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/cute?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "😊 CUTE!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 10. DELETE
cmd({
    pattern: "delete",
    desc: "Delete overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/delete?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "❌ DELETE!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 11. PASSED
cmd({
    pattern: "passed",
    desc: "Passed overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/passed?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "✅ PASSED!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 12. APPROVED
cmd({
    pattern: "approved",
    desc: "Approved overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/approved?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "👍 APPROVED!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 13. REJECTED
cmd({
    pattern: "rejected",
    desc: "Rejected overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/rejected?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "👎 REJECTED!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 14. TRIGGERED
cmd({
    pattern: "triggered",
    desc: "Triggered overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/triggered?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "⚡ TRIGGERED!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 15. SAD
cmd({
    pattern: "sad",
    desc: "Sad overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/sad?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "😢 SAD!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 16. ANGRY
cmd({
    pattern: "angry",
    desc: "Angry overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/angry?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "😡 ANGRY!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 17. KISS
cmd({
    pattern: "kiss",
    desc: "Kiss overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/kiss?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "💋 KISS!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 18. SLAP
cmd({
    pattern: "slap",
    desc: "Slap overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/slap?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "👋 SLAP!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 19. HIT
cmd({
    pattern: "hit",
    desc: "Hit overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/hit?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🥊 HIT!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 20. DANCE
cmd({
    pattern: "dance",
    desc: "Dance overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/dance?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "💃 DANCE!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 21. CRY
cmd({
    pattern: "cry",
    desc: "Cry overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/cry?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "😭 CRY!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 22. SMILE
cmd({
    pattern: "smile",
    desc: "Smile overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/smile?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "😁 SMILE!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 23. LAUGH
cmd({
    pattern: "laugh",
    desc: "Laugh overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/laugh?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "😂 LAUGH!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 24. THINKING
cmd({
    pattern: "thinking",
    desc: "Thinking overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/thinking?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🤔 THINKING!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 25. ROBOT
cmd({
    pattern: "robot",
    desc: "Robot overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/robot?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🤖 ROBOT!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 26. STONKS
cmd({
    pattern: "stonks",
    desc: "Stonks overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/stonks?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "📈 STONKS!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 27. DISTRACTED
cmd({
    pattern: "distracted",
    desc: "Distracted overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/distracted?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "😵 DISTRACTED!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 28. GAY2
cmd({
    pattern: "gay2",
    desc: "Gay overlay",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/gay2?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🏳️‍🌈 GAY!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 29. KISS2
cmd({
    pattern: "kiss2",
    desc: "Kiss overlay 2",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/kiss2?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "💋 KISS!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});

// 30. GAY3
cmd({
    pattern: "gay3",
    desc: "Gay overlay 3",
    category: "fun",
    filename: __filename
}, async (conn, m, { quoted }) => {
    try {
        let target = m.mentionedJid?.[0] || quoted?.sender || m.sender;
        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); }
        catch { pfp = "https://i.ibb.co/3Fhzb3j/avatar.png"; }
        const api = `https://some-random-api.com/canvas/overlay/gay3?avatar=${encodeURIComponent(pfp)}`;
        const buffer = await getBuffer(api);
        await conn.sendMessage(m.chat, { image: buffer, caption: "🏳️‍🌈 GAY!" }, { quoted: m });
    } catch { m.reply("❌ Error!"); }
});


my code bot plugin


const { fetchGif, gifToVideo } = require("../lib/fetchGif");
const { Module } = require("../lib/plugins");
const axios = require("axios");
const settings = require("../lib/database/settingdb");
const config = require("../config");
const { plugin } = require('mongoose');
// Define reactions with their API endpoints
const reactions = {
  cry: {
    api: "https://api.waifu.pics/sfw/cry",
    emoji: "😢",
    action: "is crying",
  },
  cuddle: {
    api: "https://api.waifu.pics/sfw/cuddle",
    emoji: "🤗",
    action: "cuddled",
  },
  bully: {
    api: "https://api.waifu.pics/sfw/bully",
    emoji: "😈",
    action: "is bullying",
  },
  hug: {
    api: "https://api.waifu.pics/sfw/hug",
    emoji: "🤗",
    action: "hugged",
  },
  awoo: {
    api: "https://api.waifu.pics/sfw/awoo",
    emoji: "🐺",
    action: "awoos at",
  },
  lick: {
    api: "https://api.waifu.pics/sfw/lick",
    emoji: "👅",
    action: "licked",
  },
  pat: {
    api: "https://api.waifu.pics/sfw/pat",
    emoji: "🫂",
    action: "patted",
  },
  smug: {
    api: "https://api.waifu.pics/sfw/smug",
    emoji: "😏",
    action: "is smug at",
  },
  bonk: {
    api: "https://api.waifu.pics/sfw/bonk",
    emoji: "🔨",
    action: "bonked",
  },
  yeet: {
    api: "https://api.waifu.pics/sfw/yeet",
    emoji: "🔪",
    action: "yeeted",
  },
  blush: {
    api: "https://api.waifu.pics/sfw/blush",
    emoji: "😊",
    action: "is blushing at",
  },
  handhold: {
    api: "https://api.waifu.pics/sfw/handhold",
    emoji: "🤝",
    action: "is holding hands with",
  },
  highfive: {
    api: "https://api.waifu.pics/sfw/highfive",
    emoji: "✋",
    action: "gave a high-five to",
  },
  nom: {
    api: "https://api.waifu.pics/sfw/nom",
    emoji: "🍽️",
    action: "is nomming",
  },
  wave: {
    api: "https://api.waifu.pics/sfw/wave",
    emoji: "👋",
    action: "waved at",
  },
  smile: {
    api: "https://api.waifu.pics/sfw/smile",
    emoji: "😁",
    action: "smiled at",
  },
  wink: {
    api: "https://api.waifu.pics/sfw/wink",
    emoji: "😉",
    action: "winked at",
  },
  happy: {
    api: "https://api.waifu.pics/sfw/happy",
    emoji: "😊",
    action: "is happy with",
  },
  glomp: {
    api: "https://api.waifu.pics/sfw/glomp",
    emoji: "🤗",
    action: "glomped",
  },
  bite: {
    api: "https://api.waifu.pics/sfw/bite",
    emoji: "🦷",
    action: "bit",
  },
  poke: {
    api: "https://api.waifu.pics/sfw/poke",
    emoji: "👉",
    action: "poked",
  },
  cringe: {
    api: "https://api.waifu.pics/sfw/cringe",
    emoji: "😬",
    action: "thinks",
  },
  dance: {
    api: "https://api.waifu.pics/sfw/dance",
    emoji: "💃",
    action: "danced with",
  },
  kill: {
    api: "https://api.waifu.pics/sfw/kill",
    emoji: "🔪",
    action: "killed",
  },
  slap: {
    api: "https://api.waifu.pics/sfw/slap",
    emoji: "✊",
    action: "slapped",
  },
  kiss: {
    api: "https://api.waifu.pics/sfw/kiss",
    emoji: "💋",
    action: "kissed",
  },
};

// Shared function to send reaction GIF
async function sendReactionGif(message, reactionType) {
  try {
    await message.react(reactionType.emoji);

    // Get sender and mentioned user (with proper JID format)
    const senderJid = message.sender;
    const mentionedUser = message.mentions?.[0] || message.quoted?.sender;

    // Build message with @ mentions
    const sender = `@${senderJid.split("@")[0]}`;
    const botname =
      settings.getGlobal("BOT_NAME") ??
      config.BOT_NAME ??
      "x-kira";
    let caption;
    let mentionsList = [senderJid];

    if (mentionedUser) {
      const target = `@${mentionedUser.split("@")[0]}`;
      caption = `${sender} ${reactionType.action} ${target}`;
      mentionsList.push(mentionedUser);
    } else if (message.isGroup) {
      caption = `${sender} ${reactionType.action} everyone!`;
    } else {
      caption = `> *© ᴘσωєʀє∂ ву ${botname}*`;
    }

    // Fetch and send GIF
    const res = await axios.get(reactionType.api);
    const gifUrl = res.data.url;

    const gifBuffer = await fetchGif(gifUrl);
    const videoBuffer = await gifToVideo(gifBuffer);

    // Send with proper mentions array
    await message.conn.sendMessage(
      message.from,
      {
        video: videoBuffer,
        caption: caption,
        gifPlayback: true,
        mentions: mentionsList.filter(Boolean),
      },
      { quoted: message.raw }
    );
  } catch (error) {
    console.error("❌ Reaction error:", error);
    await message.send("❌ Failed to send reaction GIF");
  }
}

// Method 1: Auto reaction (typing just "kiss", "hug", etc.)
Module({ on: "text" })(async (message) => {
  try {
    const text = (message.body || "").toLowerCase().trim();

    // Check if message is a reaction keyword
    const reactionType = reactions[text];
    if (!reactionType) return;

    await sendReactionGif(message, reactionType);
  } catch (error) {
    console.error("❌ Auto reaction error:", error);
  }
});

// Method 2: Command-based reactions (.kiss, .hug, etc.)
// Register each reaction as a command
Object.keys(reactions).forEach((reactionName) => {
  Module({
    command: reactionName,
    package: "reactions",
    description: `Send ${reactionName} reaction GIF`,
  })(async (message, match) => {
    const reactionType = reactions[reactionName];
    await sendReactionGif(message, reactionType);
  });
});
