const { spawn } = require("child_process");
const fs = require("fs");
const sharp = require("sharp");
const zlib = require("zlib");
const axios = require("axios");
const path = require("path");
const FormData = require("form-data");
const cheerio = require("cheerio");
const config = require("../config");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const tempDir = path.join(__dirname, "../temp");
const sessionDir = path.join(__dirname, "../session");
const credsPath = path.join(sessionDir, "creds.json");
const createDirIfNotExist = (dir) =>
  !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

createDirIfNotExist(tempDir);
createDirIfNotExist(sessionDir);

// ========== GLOBAL VARIABLES ==========
global.myName = "prince_api_56yjJ568dte4";
global.caption = "𓆩ု᪳𝐒𝐓𝐀𝐑𝐊-𝐌𝐃ှ᪳𓆪";
global.api = "https://princeapi.zone.id/api";
global.footer = "© ᴘσωєʀє∂ ву ѕтα፝֟꧊ꝛ̴͜ƙ м∂⎯꯭̽🚩";
global.ytdl = "https://ytdl.giftedtech.web.id";
global.giftedCdn = "https://cdn.giftedtech.web.id";
global.princeRepo = "https://github.com/ALI-INXIDE/STARK-MD";
global.giftedApiRepo = "https://api.github.com/repos/ALI-INXIDE/STARK-MD";

// ========== FUNCTIONS ==========

function monospace(input) {
  const boldz = {
    0: "𝟎",
    1: "𝟏",
    2: "𝟐",
    3: "𝟑",
    4: "𝟒",
    5: "𝟓",
    6: "𝟔",
    7: "𝟕",
    8: "𝟖",
    9: "𝟗",
    " ": " ",
  };
  return input
    .split("")
    .map((char) => boldz[char] || char)
    .join("");
}

// 🔁 Convert Sticker to Image
async function convertStickerToImage(webpPath) {
  const outputPath = webpPath.replace(".webp", ".png");
  await sharp(webpPath).toFormat("png").toFile(outputPath);
  await fs.promises.unlink(webpPath);
  return fs.promises.readFile(outputPath);
}

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

async function loadSession() {
  try {
    const credsId = config.SESSION_ID;

    if (!credsId || typeof credsId !== "string" || credsId.trim() === "") {
      throw new Error(
        "❌ SESSION_ID is missing or invalid (set config.SESSION_ID)."
      );
    }

    const sessionPath = path.join(sessionDir, "creds.json");

    // ---------- Format 1: STARK-MD=<Base64 GZIP> ----------
    if (credsId.startsWith("STARK-MD=")) {
      console.log("[🕸️] DETECTED STARK-MD=SESSION FORMAT");
      const b64data = credsId.substring("STARK-MD=".length).trim();
      if (!b64data) throw new Error("❌ Invalid STARK-MD= session format");

      const compressed = Buffer.from(b64data, "base64");
      const decompressed = zlib.gunzipSync(compressed);

      fs.writeFileSync(sessionPath, decompressed, "utf8");
      console.log("[✅] STARK-MD=SESSION LOADED SUCCESSFULLY");
      return true;
    }

    // ---------- Format 2: STARK-MD~<MEGA File ID> ----------
    else if (credsId.startsWith("STARK-MD~")) {
      console.log("[🕸️] DETECTED STARK-MD~SESSION FORMAT");
      const megaId = credsId.replace("STARK-MD~", "").trim();
      if (!megaId)
        throw new Error("❌ MEGA file ID missing after 'STARK-MD~'.");

      let File;
      try {
        File = require("megajs").File;
      } catch {
        throw new Error("❌ megajs not installed. Run: npm i megajs");
      }

      const file = File.fromURL(`https://mega.nz/file/${megaId}`);
      await file.loadAttributes();
      const data = await new Promise((resolve, reject) => {
        file.download((err, data) => (err ? reject(err) : resolve(data)));
      });

      fs.writeFileSync(sessionPath, data);
      console.log("[✅] STARK-MD~SESSION LOADED SUCCESSFULLY");
      return true;
    }

    // ---------- Format 3: Some-Custom-Words_<PasteID> ----------
    else if (credsId.startsWith("STARK-MD≈")) {
      console.log("[🕸️] DETECTED STARK-MD≈SESSION FORMAT");
      const pasteId = credsId.replace("STARK-MD≈", "").trim();
      const pasteUrl = `https://pastebin.com/raw/${pasteId}`;
      console.log(`[🌐] FETCHING STARK-MD≈ SESSION`);

      const response = await axios.get(pasteUrl);
      const data =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data);
      fs.writeFileSync(sessionPath, data, "utf8");
      console.log("[✅] STARK-MD≈SESSION LOADED SUCCESSFULLY");
      return true;
    }

    // ---------- Format 4: 𓂃ᷱ᪳𝐀ɭīī-𝐌𝐃-𝐁𓋜𝐓=<slug>^👑🇦🇱 ----------
    else if (
      credsId.includes("𓂃ᷱ᪳𝐀ɭīī-𝐌𝐃-𝐁𓋜𝐓=") ||
      credsId.match(/=(.+?)\^👑🇦🇱/)
    ) {
      console.log("[🕸️] DETECTED ALI-INC ORIGINAL SESSION FORMAT");

      // Extract slug between = and ^👑🇦🇱
      const slugMatch = credsId.match(/=(.+?)\^👑🇦🇱/);
      if (!slugMatch || !slugMatch[1]) {
        throw new Error(
          "❌ Invalid STARK-MD-BOT format. Could not extract slug."
        );
      }

      const slug = slugMatch[1].trim();
      console.log(`📦 Extracted slug: ${slug}`);
      console.log(`[🌐] FETCHING ALI-INC SESSION`);

      const response = await axios.get(
        `https://ali-md-json-host.vercel.app/${slug}`,
        {
          timeout: 10000,
          headers: { Accept: "application/json" },
        }
      );

      if (!response.data) {
        throw new Error("❌ Empty response from API");
      }

      const jsonData =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data, null, 2);

      fs.writeFileSync(sessionPath, jsonData, "utf8");
      console.log("[✅] ALI-INC≠ SESSION LOADED SUCCESSFULLY");
      return true;
    }

    // ---------- Unknown Format ----------
    else {
      throw new Error(
        "[❌] UNSUPPORTED SESSION_ID FORMAT. USE:\n" +
          "  • STARK-MD=<base64>\n" +
          "  • STARK-MD~<mega_file_id>\n" +
          "  • STARK-MD≈<short_id>\n" +
          "  • ALI-INC≠<slug>"
      );
    }
  } catch (error) {
    console.error("❌ Session Load Error:", error.message || error);
    return false;
  }
}

// ☁️ Upload to Gifted CDN
async function giftedCdn(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("originalFileName", path.basename(filePath));

  try {
    const response = await axios.post(
      `${global.giftedCdn}/api/upload.php`,
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        `API Error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    else if (error.request)
      throw new Error("No response received from the server.");
    else throw new Error(`Request Error: ${error.message}`);
  }
}

// 🧠 Misc Helper Functions
function makeId(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function getRandom(ext) {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
}

const getBuffer = async (url, options = {}) => {
  const res = await axios.get(url, { ...options, responseType: "arraybuffer" });
  return res.data;
};

const getGroupAdmins = (participants) =>
  participants.filter((p) => p.admin).map((p) => p.id);

const h2k = (eco) => {
  const lyrik = ["", "K", "M", "B", "T", "P", "E"];
  const ma = Math.floor(Math.log10(Math.abs(eco)) / 3);
  if (ma === 0) return eco;
  const ppo = lyrik[ma];
  const scale = Math.pow(10, ma * 3);
  const scaled = eco / scale;
  let formatt = scaled.toFixed(1);
  if (/\.0$/.test(formatt)) formatt = formatt.slice(0, -2);
  return formatt + ppo;
};

const isUrl = (url) => /https?:\/\/[^\s]+/gi.test(url);
const Json = (string) => JSON.stringify(string, null, 2);
const runtime = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d ? `${d}d, ` : ""}${h ? `${h}h, ` : ""}${m ? `${m}m, ` : ""}${s}s`;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJson = async (url, options = {}) => {
  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    ...options,
  });
  return res.data;
};

const AliAnticall = async (json, conn) => {
  for (const id of json) {
    if (id.status === "offer") {
      if (config.ANTI_CALL === "true") {
        await conn.sendMessage(id.from, {
          text: config.ANTI_CALL_MSG,
          mentions: [id.from],
        });
        await conn.rejectCall(id.id, id.from);
      } else if (config.ANTI_CALL === "block") {
        await conn.sendMessage(id.from, {
          text: `${config.ANTI_CALL_MSG}\nYou are Being Blocked.`,
          mentions: [id.from],
        });
        await conn.rejectCall(id.id, id.from);
        await conn.updateBlockStatus(id.from, "block");
      }
    }
  }
};

// Base64 + Binary Encoding Helpers
const eBasef = (str = "") => Buffer.from(str).toString("base64");
const dBasef = (b64 = "") => Buffer.from(b64, "base64").toString("utf8");
const eBinary = (str = "") =>
  str
    .split("")
    .map((c) => c.charCodeAt(0).toString(2))
    .join(" ");
const dBinary = (bin = "") =>
  bin
    .split(" ")
    .map((b) => String.fromCharCode(parseInt(b, 2)))
    .join("");

module.exports = {
  AliAnticall,
  giftedCdn,
  loadSession,
  makeId,
  convertStickerToImage,
  getBuffer,
  monospace,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  eBasef,
  dBasef,
  eBinary,
  dBinary,
  fetchJson,
};
