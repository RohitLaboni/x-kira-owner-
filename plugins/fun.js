const { Module } = require("../lib/plugins");

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/* ---------------- SIMPLE FUN COMMANDS ---------------- */
Module({ command: "mood", package: "fun", description: "Check your mood" })(
  async (message, match) => {
    const conn = message.conn;
    const mek = message.mek || message.raw || message;
    const reply = (t, opts) => message.send(t, opts);
    try {
      const moods = [
        "😇 Chill",
        "😡 Gussa",
        "😂 Mast mood",
        "🥲 Thoda udaas",
        "🤪 Pagalpan",
      ];
      await reply(`👉 Aaj ka tera mood: *${pickRandom(moods)}*`);
      (await message.react) && message.react("😎");
    } catch (e) {
      console.error("mood Error", e);
    }
  }
);

Module({
  command: "tharki",
  package: "fun",
  description: "Tharki level check",
})(async (message, match) => {
  const reply = (t) => message.send(t);
  try {
    const level = Math.floor(Math.random() * 100);
    await reply(`🔥 Tera Tharki level hai: *${level}%* 😏`);
    (await message.react) && message.react("🍑");
  } catch (e) {
    console.error("tharki Error", e);
  }
});

Module({ command: "chad", package: "fun", description: "Sigma check" })(
  async (message, match) => {
    const reply = (t) => message.send(t);
    try {
      const lines = [
        "Tu real CHAD hai 😎",
        "Bas acting karta hai bhai 😂",
        "Sigma male spotted 🔥",
        "Bhai tu toh simping kar raha hai 😭",
      ];
      await reply(pickRandom(lines));
      (await message.react) && message.react("🕶️");
    } catch (e) {
      console.error("chad Error", e);
    }
  }
);

Module({ command: "pappi", package: "fun", description: "Give a kiss" })(
  async (message, match) => {
    const reply = (t) => message.send(t);
    try {
      await reply("😚 Muaaah! Ek pappi le le bhai 💋");
      (await message.react) && message.react("💋");
    } catch (e) {
      console.error("pappi Error", e);
    }
  }
);

Module({ command: "bkl", package: "fun", description: "Baklol reply" })(
  async (message, match) => {
    const reply = (t) => message.send(t);
    try {
      await reply("BKL tu real comedian hai 🤡😂");
      (await message.react) && message.react("🤡");
    } catch (e) {
      console.error("bkl Error", e);
    }
  }
);

Module({ command: "majnu", package: "fun", description: "Love meter" })(
  async (message, match) => {
    const reply = (t) => message.send(t);
    try {
      const love = Math.floor(Math.random() * 100);
      await reply(`💞 Tera love level: *${love}%* Majnu vibes 💘`);
      (await message.react) && message.react("❤️");
    } catch (e) {
      console.error("majnu Error", e);
    }
  }
);

Module({ command: "insult", package: "fun", description: "Roast someone" })(
  async (message, match) => {
    const reply = (t) => message.send(t);
    try {
      const lines = [
        "Tu wifi signal jaisa hai – kabhi full, kabhi zero 😭",
        "Itna slow mat chal, 2G lagta hai 😭",
        "Tera brain toh background me hi run ho raha hai 🤣",
        "Tu chhota packet, bada error hai 💀",
      ];
      await reply(pickRandom(lines));
      (await message.react) && message.react("🔥");
    } catch (e) {
      console.error("insult Error", e);
    }
  }
);

Module({ command: "roast", package: "fun", description: "Desi roast" })(
  async (message, match) => {
    const reply = (t) => message.send(t);
    try {
      const roasts = [
        "Tere jaisa banda toh loading screen bhi skip kar deta hai 😂",
        "Tu toh WhatsApp ka last seen off karke bhi single hai 😭",
        "Aurat nahi, error 404 milta hai tujhe 😭",
        "Bhai tu toh OTP bhi reject kar deta hai 💀",
      ];
      await reply(pickRandom(roasts));
      (await message.react) && message.react("😈");
    } catch (e) {
      console.error("roast Error", e);
    }
  }
);

Module({
  command: "gf",
  package: "fun",
  description: "Random girlfriend reply",
})(async (message, match) => {
  try {
    await message.send("GF milti nahi bhai, system error 😭");
    (await message.react) && message.react("💞");
  } catch (e) {
    console.error("gf Error", e);
  }
});

Module({
  command: "bf",
  package: "fun",
  description: "Random boyfriend reply",
})(async (message, match) => {
  try {
    await message.send("BF? Huh! Sab to PUBG ke friend list me busy hain 🎮");
    (await message.react) && message.react("💘");
  } catch (e) {
    console.error("bf Error", e);
  }
});

Module({ command: "cute", package: "fun", description: "Compliment" })(
  async (message, match) => {
    try {
      await message.send("Tu itna cute hai ke emoji bhi sharma gaya 😳💖");
      (await message.react) && message.react("😊");
    } catch (e) {
      console.error("cute Error", e);
    }
  }
);

Module({ command: "attitude", package: "fun", description: "Show some swag" })(
  async (message, match) => {
    try {
      await message.send(
        "Mera attitude mausam jaisa hai — har kisi ke liye nahi badalta 😏🔥"
      );
      (await message.react) && message.react("😎");
    } catch (e) {
      console.error("attitude Error", e);
    }
  }
);

Module({ command: "tension", package: "fun", description: "Relieve stress" })(
  async (message, match) => {
    try {
      await message.send("Tension lene ka nahi, dene ka 😎💪");
      (await message.react) && message.react("😌");
    } catch (e) {
      console.error("tension Error", e);
    }
  }
);

Module({ command: "single", package: "fun", description: "Single life check" })(
  async (message, match) => {
    try {
      await message.send("Haan bhai... single aur khush bhi 😭✨");
      (await message.react) && message.react("💔");
    } catch (e) {
      console.error("single Error", e);
    }
  }
);

Module({ command: "mast", package: "fun", description: "Mast reply" })(
  async (message, match) => {
    try {
      await message.send(
        "Life mast hai bhai, bas data sasta hona chahiye 😎📱"
      );
      (await message.react) && message.react("🤪");
    } catch (e) {
      console.error("mast Error", e);
    }
  }
);

Module({ command: "pagal", package: "fun", description: "Pagalpanti" })(
  async (message, match) => {
    try {
      await message.send("Pagal nahi bhai, limited edition hu 💀🔥");
      (await message.react) && message.react("🤯");
    } catch (e) {
      console.error("pagal Error", e);
    }
  }
);

Module({ command: "sad", package: "fun", description: "Emo reply" })(
  async (message, match) => {
    try {
      await message.send(
        "Dil udaas hai, lekin meme dekh kar khush ho jaunga 😭❤️"
      );
      (await message.react) && message.react("🥺");
    } catch (e) {
      console.error("sad Error", e);
    }
  }
);

Module({ command: "bakchodi", package: "fun", description: "Desi bakchodi" })(
  async (message, match) => {
    try {
      await message.send(
        "Bakchodi bhi ek art hai bhai, sabke bas ki baat nahi 🎭💀"
      );
      (await message.react) && message.react("😂");
    } catch (e) {
      console.error("bakchodi Error", e);
    }
  }
);

Module({ command: "beta", package: "fun", description: "Beta meme reply" })(
  async (message, match) => {
    try {
      await message.send("Beta tumse na ho payega 😎💀");
      (await message.react) && message.react("🧠");
    } catch (e) {
      console.error("beta Error", e);
    }
  }
);

Module({ command: "dialogue", package: "fun", description: "Filmy dialogue" })(
  async (message, match) => {
    try {
      const lines = [
        "Babu bhaiya ka style alag hai 🔥",
        "Tera naam kya hai Basanti 😂",
        "Picture abhi baaki hai mere dost 🎞️",
        "Mogambo khush hua 💀",
      ];
      await message.send(pickRandom(lines));
      (await message.react) && message.react("🎬");
    } catch (e) {
      console.error("dialogue Error", e);
    }
  }
);

Module({ command: "op", package: "fun", description: "Overpowered reply" })(
  async (message, match) => {
    try {
      await message.send("Full OP bhai 🔥 Tu toh pura lobby wipe karega 💪");
      (await message.react) && message.react("💥");
    } catch (e) {
      console.error("op Error", e);
    }
  }
);
Module({ command: "legend", package: "fun", description: "Legend reply" })(
  async (message, match) => {
    try {
      await message.send("Tu legend nahi... LEG-END hai 😂👑");
      (await message.react) && message.react("👑");
    } catch (e) {
      console.error("legend Error", e);
    }
  }
);
Module({
  command: "ghanta",
  package: "fun",
  description: "Sarcastic ghanta reply",
})(async (message, match) => {
  try {
    await message.send("Ghanta! Sapne me dekh lena bhai 🤣");
    (await message.react) && message.react("🔔");
  } catch (e) {
    console.error("ghanta Error", e);
  }
});
Module({ command: "noob", package: "fun", description: "Noob check" })(
  async (message, match) => {
    try {
      await message.send("Noob spotted! 😂 Practice kar bhai next time 😭");
      (await message.react) && message.react("😹");
    } catch (e) {
      console.error("noob Error", e);
    }
  }
);
Module({ command: "pro", package: "fun", description: "Pro level reply" })(
  async (message, match) => {
    try {
      await message.send("Pro level: MAX 💪 Tu toh baap nikla bhai 😎");
      (await message.react) && message.react("🔥");
    } catch (e) {
      console.error("pro Error", e);
    }
  }
);
Module({ command: "kalesh", package: "fun", description: "Kalesh meme" })(
  async (message, match) => {
    try {
      await message.send("Kalesh chalu ho gaya bhai 💀 Ab maza aayega 🔥");
      (await message.react) && message.react("🤺");
    } catch (e) {
      console.error("kalesh Error", e);
    }
  }
);
Module({ command: "chomu", package: "fun", description: "Funny insult" })(
  async (message, match) => {
    try {
      await message.send("Tu real CHOMU hai bhai 😭🤣");
      (await message.react) && message.react("🤡");
    } catch (e) {
      console.error("chomu Error", e);
    }
  }
);
Module({ command: "zindagi", package: "fun", description: "Life line" })(
  async (message, match) => {
    try {
      const lines = [
        "Zindagi me bas ek rule hai — mute mat karna bhai 😂",
        "Zindagi jhand hai lekin band hai 💀",
        "Coffee bhi cold aur hope bhi old ☕😩",
      ];
      await message.send(pickRandom(lines));
      (await message.react) && message.react("🌧️");
    } catch (e) {
      console.error("zindagi Error", e);
    }
  }
);
Module({ command: "popat", package: "fun", description: "Popat reply" })(
  async (message, match) => {
    try {
      await message.send("Popat ban gaya bhai 🤡😂 Next time better luck 💀");
      (await message.react) && message.react("🦜");
    } catch (e) {
      console.error("popat Error", e);
    }
  }
);
Module({ command: "bhakk", package: "fun", description: "Desi roast" })(
  async (message, match) => {
    try {
      await message.send(
        "Bhakk! Tera logic toh Windows update me phas gaya 💀"
      );
      (await message.react) && message.react("😤");
    } catch (e) {
      console.error("bhakk Error", e);
    }
  }
);
Module({ command: "berozgaar", package: "fun", description: "Jobless meme" })(
  async (message, match) => {
    try {
      await message.send("Bhai tu IT sector ka pending project hai 😂");
      (await message.react) && message.react("💼");
    } catch (e) {
      console.error("berozgaar Error", e);
    }
  }
);
Module({ command: "gamer", package: "fun", description: "Gaming reply" })(
  async (message, match) => {
    try {
      await message.send("Lag maar raha hai bhai 😭 Ping 999+ 🔥");
      (await message.react) && message.react("🎮");
    } catch (e) {
      console.error("gamer Error", e);
    }
  }
);
Module({ command: "chutiya", package: "fun", description: "Roast reply" })(
  async (message, match) => {
    try {
      await message.send("Nahi bhai tu nahi, system hi chutiya ban gaya 😂💀");
      (await message.react) && message.react("🤬");
    } catch (e) {
      console.error("chutiya Error", e);
    }
  }
);

Module({
  command: "couple",
  package: "group-fun",
  description: "Make a random couple",
})(async (message, match) => {
  const conn = message.conn;
  const mek = message.mek || message.raw || message;
  const from = message.from;
  const reply = (t, opts) => message.send(t, opts);
  try {
    if (!message.isGroup) return reply("Ye command sirf group me chalega 😎");
    const meta = await conn.groupMetadata(from);
    const members = (meta.participants || []).map((p) => p.id);
    if (members.length < 2) return reply("Group me members kam hai 😕");
    const p1 = pickRandom(members);
    const p2 = pickRandom(members.filter((x) => x !== p1));
    await reply(
      `💘 *Couple of the day!* 💘\n❤️ @${p1.split("@")[0]} + 💕 @${
        p2.split("@")[0]
      }`,
      { mentions: [p1, p2] }
    );
  } catch (e) {
    console.error("couple Error", e);
  }
});

Module({
  command: "bestie",
  package: "group-fun",
  description: "Find besties",
})(async (message, match) => {
  const conn = message.conn;
  const from = message.from;
  const reply = (t) => message.send(t);
  try {
    const meta = await conn.groupMetadata(from);
    const members = (meta.participants || []).map((p) => p.id);
    if (members.length < 2) return reply("Group me members kam hai 😕");
    const p1 = pickRandom(members);
    const p2 = pickRandom(members.filter((x) => x !== p1));
    await reply(
      `👯 Besties for life 💞\n@${p1.split("@")[0]} & @${
        p2.split("@")[0]
      } are *BFFs*! 💕`,
      { mentions: [p1, p2] }
    );
  } catch (e) {
    console.error("bestie Error", e);
  }
});

Module({
  command: "roastall",
  package: "group-fun",
  description: "Roast sabko",
})(async (message, match) => {
  try {
    const reply = (t) => message.send(t);
    const roasts = [
      "Tum sab ka group photo wallpaper bana du kya? 🤣",
      "Yahan sab ke sab chomu hi nikle 💀",
      "Group chat ka IQ level negative me hai 💩",
      "Aaj sabko roast milne wala hai 🔥",
      "Ek se badhkar ek meme material yahan milta hai 😂",
    ];
    await reply(pickRandom(roasts));
  } catch (e) {
    console.error("roastall Error", e);
  }
});

Module({
  command: "randomtag",
  package: "group-fun",
  description: "Tag random member",
})(async (message, match) => {
  const conn = message.conn;
  const from = message.from;
  const reply = (t, opts) => message.send(t, opts);
  try {
    const meta = await conn.groupMetadata(from);
    const members = (meta.participants || []).map((p) => p.id);
    if (!members.length) return reply("No members found.");
    const chosen = pickRandom(members);
    const lines = [
      "Bhai ye banda OP hai 🔥",
      "Tag ho gaya chomu 😂",
      "Tu winner hai bhai 😎",
      "Is bande ko salute karo 🫡",
      "Aaj iska din hai 🌟",
    ];
    await reply(`@${chosen.split("@")[0]} ${pickRandom(lines)}`, {
      mentions: [chosen],
    });
  } catch (e) {
    console.error("randomtag Error", e);
  }
});

Module({
  command: "groupmood",
  package: "group-fun",
  description: "Check group mood",
})(async (message, match) => {
  try {
    const moods = [
      "😂 Bakchodi Mood",
      "😎 Cool AF",
      "🥲 Thoda Sad",
      "🤯 Full Overthinking",
      "🔥 Mast Masti Mood",
    ];
    await message.send(`👉 Group Mood Aaj ka: *${pickRandom(moods)}*`);
  } catch (e) {
    console.error("groupmood Error", e);
  }
});

Module({
  command: "dialogue",
  package: "group-fun",
  description: "Filmy line",
})(async (message, match) => {
  try {
    const lines = [
      "Don ka intezaar toh 11 mulkon ki police kar rahi hai 🔥",
      "Aaj khush toh bahut hoge tum 😎",
      "Zindagi me kuch banna ho toh meme mat banna 😂",
      "Aaj meri maa ka birthday nahi hai 💀",
    ];
    await message.send(pickRandom(lines));
  } catch (e) {
    console.error("dialogue (group) Error", e);
  }
});

Module({
  command: "lifeline",
  package: "group-fun",
  description: "Desi life quote",
})(async (message, match) => {
  try {
    const lines = [
      "Zindagi me bas ek rule hai — *bakchodi chalu rakho* 😂",
      "Zindagi jhand hai lekin band hai 💀",
      "System error: Hope not found ☠️",
      "Kabhi kabhi lagta hai apun hi bhagwan hai 😎",
    ];
    await message.send(pickRandom(lines));
  } catch (e) {
    console.error("lifeline Error", e);
  }
});

Module({
  command: "smart",
  package: "group-fun",
  description: "Smartness check",
})(async (message, match) => {
  try {
    const sm = Math.floor(Math.random() * 100);
    await message.send(
      `🧠 Smartness level: *${sm}%* — ${
        sm > 70 ? "IQ🔥" : "Retry in next life 💀"
      }`
    );
  } catch (e) {
    console.error("smart Error", e);
  }
});

Module({
  command: "bakchod",
  package: "group-fun",
  description: "Desi bakchodi",
})(async (message, match) => {
  try {
    const lines = [
      "Bakchodi ke bina group adhoora hai 🤣",
      "Tum sab certified bakchodi experts ho 😎",
      "Yahan toh logic bhi chhutti pe gaya hai 💀",
    ];
    await message.send(pickRandom(lines));
  } catch (e) {
    console.error("bakchod Error", e);
  }
});

Module({
  command: "legendary",
  package: "group-fun",
  description: "Legend moment",
})(async (message, match) => {
  try {
    const conn = message.conn;
    const from = message.from;
    const meta = await conn.groupMetadata(from);
    const members = (meta.participants || []).map((p) => p.id);
    if (!members.length) return message.send("No members found.");
    const chosen = pickRandom(members);
    await message.send(
      `👑 @${chosen.split("@")[0]} is the LEGEND of this group 💥`,
      { mentions: [chosen] }
    );
  } catch (e) {
    console.error("legendary Error", e);
  }
});

Module({ command: "popat", package: "group-fun", description: "Popat moment" })(
  async (message, match) => {
    try {
      const conn = message.conn;
      const from = message.from;
      const meta = await conn.groupMetadata(from);
      const members = (meta.participants || []).map((p) => p.id);
      if (!members.length) return message.send("No members found.");
      const chosen = pickRandom(members);
      await message.send(
        `🦜 @${chosen.split("@")[0]} Popat ban gaya aaj 💀🤣`,
        { mentions: [chosen] }
      );
    } catch (e) {
      console.error("popat (group) Error", e);
    }
  }
);

Module({
  command: "lovecheck",
  package: "group-fun",
  description: "Love meter for tagged user",
})(async (message, match) => {
  try {
    const love = Math.floor(Math.random() * 100);
    await message.send(
      `💘 Love Meter says: *${love}%* — ${
        love > 60 ? "True Lover 😍" : "Single 😭"
      }`
    );
  } catch (e) {
    console.error("lovecheck Error", e);
  }
});

Module({ command: "crazy", package: "group-fun", description: "Crazy level" })(
  async (message, match) => {
    try {
      const lvl = Math.floor(Math.random() * 100);
      await message.send(
        `🤯 Crazy level: *${lvl}%* — ${
          lvl > 80 ? "Pagal certified 💀" : "Thoda aur practice chahiye 😂"
        }`
      );
    } catch (e) {
      console.error("crazy Error", e);
    }
  }
);

Module({
  command: "respect",
  package: "group-fun",
  description: "Give respect to random",
})(async (message, match) => {
  try {
    const conn = message.conn;
    const from = message.from;
    const meta = await conn.groupMetadata(from);
    const members = (meta.participants || []).map((p) => p.id);
    if (!members.length) return message.send("No members found.");
    const chosen = pickRandom(members);
    await message.send(
      `🙏 Full respect to @${chosen.split("@")[0]} bhai/sis 😎💪`,
      { mentions: [chosen] }
    );
  } catch (e) {
    console.error("respect Error", e);
  }
});

Module({
  command: "boss",
  package: "group-fun",
  description: "Pick group boss",
})(async (message, match) => {
  try {
    const conn = message.conn;
    const from = message.from;
    const meta = await conn.groupMetadata(from);
    const members = (meta.participants || []).map((p) => p.id);
    if (!members.length) return message.send("No members found.");
    const chosen = pickRandom(members);
    await message.send(`😎 Boss of the day: @${chosen.split("@")[0]} 🔥`, {
      mentions: [chosen],
    });
  } catch (e) {
    console.error("boss Error", e);
  }
});

Module({
  command: "bhagwan",
  package: "group-fun",
  description: "Bhagwan meme",
})(async (message, match) => {
  try {
    await message.send(
      "😇 Bhagwan sab dekh raha hai bhai... bas tere chats skip kar raha hai 😂🙏"
    );
  } catch (e) {
    console.error("bhagwan Error", e);
  }
});

// End of fun/group-fun modules
