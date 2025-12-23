const { Module } = require("../lib/plugins");
const { getBuffer } = require("../lib/handier");
const { fetchGif, gifToVideo } = require("../lib/fetchGif");
const axios = require("axios");
const settings = require("../lib/database/settingdb");
const config = require("../config");

// default avatar fallback
const DEFAULT_PFP = "https://i.ibb.co/3Fhzb3j/avatar.png";

// Helper: get profile picture (returns URL string)
async function getTargetPfp(conn, message) {
  try {
    const target =
      message.mentionedJid?.[0] || message.quoted?.sender || message.sender;
    try {
      return await conn.profilePictureUrl(target, "image");
    } catch (e) {
      return DEFAULT_PFP;
    }
  } catch (e) {
    return DEFAULT_PFP;
  }
}

// Helper: call overlay API and send image
async function sendOverlay(conn, message, apiPath, caption) {
  try {
    const pfp = await getTargetPfp(conn, message);
    const api = `${apiPath}?avatar=${encodeURIComponent(pfp)}`;
    const buffer = await getBuffer(api);
    await conn.sendMessage(
      message.from,
      { image: buffer, caption },
      { quoted: message.raw }
    );
  } catch (err) {
    console.error("Overlay error:", err);
    try {
      await message.send("❌ Error generating overlay.");
    } catch {}
  }
}

// Map of overlay commands -> api endpoint and caption
const overlays = {
  wanted: {
    path: "https://some-random-api.com/canvas/overlay/wanted",
    caption: "🔫 WANTED!",
  },
  trash: {
    path: "https://some-random-api.com/canvas/overlay/trash",
    caption: "🗑️ Trash!",
  },
  facepalm: {
    path: "https://some-random-api.com/canvas/overlay/facepalm",
    caption: "🤦 FACEPALM!",
  },
  jail: {
    path: "https://some-random-api.com/canvas/overlay/jail",
    caption: "🚔 Jail!",
  },
  wasted: {
    path: "https://some-random-api.com/canvas/overlay/wasted",
    caption: "💀 WASTED!",
  },
  comrade: {
    path: "https://some-random-api.com/canvas/overlay/comrade",
    caption: "✊ COMRADE!",
  },
  beautiful: {
    path: "https://some-random-api.com/canvas/overlay/beautiful",
    caption: "💖 BEAUTIFUL!",
  },
  horny: {
    path: "https://some-random-api.com/canvas/overlay/horny",
    caption: "😏 HORNY!",
  },
  cute: {
    path: "https://some-random-api.com/canvas/overlay/cute",
    caption: "😊 CUTE!",
  },
  delete: {
    path: "https://some-random-api.com/canvas/overlay/delete",
    caption: "❌ DELETE!",
  },
  passed: {
    path: "https://some-random-api.com/canvas/overlay/passed",
    caption: "✅ PASSED!",
  },
  approved: {
    path: "https://some-random-api.com/canvas/overlay/approved",
    caption: "👍 APPROVED!",
  },
  rejected: {
    path: "https://some-random-api.com/canvas/overlay/rejected",
    caption: "👎 REJECTED!",
  },
  triggered: {
    path: "https://some-random-api.com/canvas/overlay/triggered",
    caption: "⚡ TRIGGERED!",
  },
  sad: {
    path: "https://some-random-api.com/canvas/overlay/sad",
    caption: "😢 SAD!",
  },
  angry: {
    path: "https://some-random-api.com/canvas/overlay/angry",
    caption: "😡 ANGRY!",
  },
  kiss: {
    path: "https://some-random-api.com/canvas/overlay/kiss",
    caption: "💋 KISS!",
  },
  slap: {
    path: "https://some-random-api.com/canvas/overlay/slap",
    caption: "👋 SLAP!",
  },
  hit: {
    path: "https://some-random-api.com/canvas/overlay/hit",
    caption: "🥊 HIT!",
  },
  dance: {
    path: "https://some-random-api.com/canvas/overlay/dance",
    caption: "💃 DANCE!",
  },
  cry: {
    path: "https://some-random-api.com/canvas/overlay/cry",
    caption: "😭 CRY!",
  },
  smile: {
    path: "https://some-random-api.com/canvas/overlay/smile",
    caption: "😁 SMILE!",
  },
  laugh: {
    path: "https://some-random-api.com/canvas/overlay/laugh",
    caption: "😂 LAUGH!",
  },
  thinking: {
    path: "https://some-random-api.com/canvas/overlay/thinking",
    caption: "🤔 THINKING!",
  },
  robot: {
    path: "https://some-random-api.com/canvas/overlay/robot",
    caption: "🤖 ROBOT!",
  },
  stonks: {
    path: "https://some-random-api.com/canvas/overlay/stonks",
    caption: "📈 STONKS!",
  },
  distracted: {
    path: "https://some-random-api.com/canvas/overlay/distracted",
    caption: "😵 DISTRACTED!",
  },
  gay2: {
    path: "https://some-random-api.com/canvas/overlay/gay2",
    caption: "🏳️‍🌈 GAY!",
  },
  kiss2: {
    path: "https://some-random-api.com/canvas/overlay/kiss2",
    caption: "💋 KISS!",
  },
  gay3: {
    path: "https://some-random-api.com/canvas/overlay/gay3",
    caption: "🏳️‍🌈 GAY!",
  },
};

// Register overlay commands as Module plugins
Object.entries(overlays).forEach(([cmdName, info]) => {
  Module({
    command: cmdName,
    package: "fun-image",
    description: `${info.caption} overlay`,
    filename: __filename,
  })(async (message, match) => {
    try {
      await sendOverlay(message.conn, message, info.path, info.caption);
    } catch (e) {
      console.error(`${cmdName} handler error:`, e);
    }
  });
});

// ----------------- Reactions system -----------------
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
  hug: { api: "https://api.waifu.pics/sfw/hug", emoji: "🤗", action: "hugged" },
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
  pat: { api: "https://api.waifu.pics/sfw/pat", emoji: "🫂", action: "patted" },
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
  bite: { api: "https://api.waifu.pics/sfw/bite", emoji: "🦷", action: "bit" },
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
    // react locally if possible
    try {
      (await message.react) && message.react(reactionType.emoji);
    } catch {}

    const senderJid = message.sender;
    const mentionedUser = message.mentions?.[0] || message.quoted?.sender;
    const senderTag = `@${senderJid.split("@")[0]}`;
    const botname =
      (settings.getGlobal && settings.getGlobal("BOT_NAME")) ||
      config.BOT_NAME ||
      "x-kira";

    let caption;
    const mentionsList = [senderJid];
    if (mentionedUser) {
      caption = `${senderTag} ${reactionType.action} @${
        mentionedUser.split("@")[0]
      }`;
      mentionsList.push(mentionedUser);
    } else if (message.isGroup) {
      caption = `${senderTag} ${reactionType.action} everyone!`;
    } else {
      caption = `> *© ᴘσωєʀє∂ ву ${botname}*`;
    }

    const res = await axios.get(reactionType.api);
    const gifUrl = res.data?.url;
    if (!gifUrl) throw new Error("No gif url returned from API");

    const gifBuffer = await fetchGif(gifUrl);
    const videoBuffer = await gifToVideo(gifBuffer);

    await message.conn.sendMessage(
      message.from,
      {
        video: videoBuffer,
        caption,
        gifPlayback: true,
        mentions: mentionsList.filter(Boolean),
      },
      { quoted: message.raw }
    );
  } catch (error) {
    console.error("Reaction error:", error);
    try {
      await message.send("❌ Failed to send reaction GIF");
    } catch {}
  }
}

// Auto-reaction: if user just types a reaction word
Module({ on: "text" })(async (message) => {
  try {
    const text = (message.body || "").toLowerCase().trim();
    const reactionType = reactions[text];
    if (!reactionType) return;
    await sendReactionGif(message, reactionType);
  } catch (err) {
    console.error("Auto reaction error:", err);
  }
});

// Command-based reactions
Object.keys(reactions).forEach((reactionName) => {
  Module({
    command: reactionName,
    package: "reactions",
    description: `Send ${reactionName} reaction GIF`,
    filename: __filename,
  })(async (message, match) => {
    const reactionType = reactions[reactionName];
    await sendReactionGif(message, reactionType);
  });
});

// End of plugin file
