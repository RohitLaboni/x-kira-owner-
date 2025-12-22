const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");
const os = require("os");
const path = require("path");
const yts = require("yt-search");
const { File } = require("megajs");
const { promisify } = require("util");
const stream = require("stream");
const pipeline = promisify(stream.pipeline);
//const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { Module } = require("../lib/plugins");

const x = "AIzaSyDLH31M0HfyB7Wjttl6QQudyBEq5x9s1Yg";

// Helper: choose a working API from a list and a request path (full URL or path builder callback)
async function tryApis(apiList, buildUrlFn, options = {}) {
  for (const base of apiList) {
    try {
      const url =
        typeof buildUrlFn === "function"
          ? buildUrlFn(base)
          : buildUrlFn.replace("{base}", base);
      const res = await axios.get(url, { timeout: options.timeout || 25000 });
      if (res && res.data) return { base, data: res.data };
    } catch (e) {
      // continue to next
      continue;
    }
  }
  return null;
}

// Helper: download stream to temp file
async function downloadToTemp(url, ext = "") {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  const filename = `file_${Date.now()}${Math.random()
    .toString(36)
    .slice(2, 8)}${ext}`;
  const outPath = path.join(tempDir, filename);
  const res = await axios({
    method: "GET",
    url,
    responseType: "stream",
    timeout: 180000,
  });
  await pipeline(res.data, fs.createWriteStream(outPath));
  return outPath;
}

// Helper: safe cleanup
function safeUnlink(file) {
  try {
    if (file && fs.existsSync(file)) fs.unlinkSync(file);
  } catch (e) {}
}

// Common gift/quoted contact used previously
function makeGiftQuote(pushname, sender) {
  return {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      remoteJid: "status@broadcast",
    },
    message: {
      contactMessage: {
        displayName: pushname || "User",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${pushname || "User"};;\nFN:${
          pushname || "User"
        }\nitem1.TEL;waid=${(sender || "").split("@")[0]}:${
          (sender || "").split("@")[0]
        }\nitem1.X-ABLabel:WhatsApp\nEND:VCARD`,
      },
    },
  };
}

async function ytSearch(query, max = 10) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${x}&part=snippet&type=video&maxResults=${max}&q=${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  const data = await res.json();
  if (!data.items || !data.items.length) return [];
  return data.items.map((vid) => ({
    id: vid.id.videoId,
    title: vid.snippet.title,
    url: `https://www.youtube.com/watch?v=${vid.id.videoId}`,
    thumbnail: vid.snippet.thumbnails.high.url,
    channel: vid.snippet.channelTitle,
    publishedAt: vid.snippet.publishedAt,
  }));
}

// Helper function to download audio using the new API
async function downloadYtAudio(url) {
  const apiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp3?url=${encodeURIComponent(
    url
  )}`;
  const response = await axios.get(apiUrl);

  if (!response.data || !response.data.success) {
    throw new Error("Failed to fetch audio data from API");
  }

  return response.data.data;
}

// Helper function to download video using the new API
async function downloadYtVideo(url, resolution = "720p") {
  const apiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp4?url=${encodeURIComponent(
    url
  )}&resolution=${resolution}`;
  const response = await axios.get(apiUrl);

  if (!response.data || !response.data.success) {
    throw new Error("Failed to fetch video data from API");
  }

  return response.data.data;
}

// Helper function to handle song downloads
async function handleSongDownload(conn, input, message) {
  let videoUrl = input;
  let videoInfo = null;

  // Check if input is a URL or search query
  const urlRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  if (!urlRegex.test(input)) {
    // Search for the song
    await message.react("🔍");
    const searchResults = await yts(input);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return await message.send("❌ No results found");
    }
    videoInfo = searchResults.videos[0];
    videoUrl = videoInfo.url;
  } else {
    // Get video info from URL
    const videoId = input.match(urlRegex)[1];
    const searchResults = await yts({ videoId: videoId });
    videoInfo = searchResults;
  }

  // Download audio
  await message.react("⬇️");
  const audioData = await downloadYtAudio(videoUrl);

  // Download the audio file
  const audioBuffer = await axios.get(audioData.download_url, {
    responseType: "arraybuffer",
  });

  // Send audio with thumbnail and link preview
  await message.react("🎧");
  await conn.sendMessage(message.from, {
    audio: Buffer.from(audioBuffer.data),
    mimetype: "audio/mpeg",
    fileName: `${audioData.title}.mp3`,
    contextInfo: {
      externalAdReply: {
        title: audioData.title,
        body: `Duration: ${Math.floor(audioData.duration / 60)}:${(
          audioData.duration % 60
        )
          .toString()
          .padStart(2, "0")}`,
        thumbnail: await axios
          .get(audioData.thumbnail, { responseType: "arraybuffer" })
          .then((res) => Buffer.from(res.data)),
        mediaType: 2,
        mediaUrl: videoUrl,
        sourceUrl: videoUrl,
      },
    },
  });
}

// Helper function to handle video downloads
async function handleVideoDownload(conn, input, message, resolution = "720p") {
  let videoUrl = input;

  // Check if input is a URL or search query
  const urlRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  if (!urlRegex.test(input)) {
    // Search for the video
    await message.send("🔍 Searching...");
    const searchResults = await yts(input);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return await message.send("❌ No results found");
    }
    videoUrl = searchResults.videos[0].url;
  }

  // Download video
  await message.send(`⬇️ Downloading video in ${resolution}...`);
  const videoData = await downloadYtVideo(videoUrl, resolution);

  // Download the video file
  const videoBuffer = await axios.get(videoData.download_url, {
    responseType: "arraybuffer",
  });

  // Get thumbnail
  const thumbnailBuffer = await axios.get(videoData.thumbnail, {
    responseType: "arraybuffer",
  });

  // Send video with small link preview
  await conn.sendMessage(message.from, {
    video: Buffer.from(videoBuffer.data),
    caption: `*${videoData.title}*\n\n📹 Quality: ${
      videoData.format
    }\n⏱️ Duration: ${Math.floor(videoData.duration / 60)}:${(
      videoData.duration % 60
    )
      .toString()
      .padStart(2, "0")}`,
    jpegThumbnail: Buffer.from(thumbnailBuffer.data),
  });
}

Module({
  command: "yts",
  package: "search",
  description: "Search YouTube videos",
})(async (message, match) => {
  if (!match) return await message.send("Please provide a search query");
  const query = match.trim();
  const results = await ytSearch(query, 10);
  if (!results.length) return await message.send("❌ No results found");

  let reply = `*YouTube results for "${query}":*\n\n`;
  results.forEach((v, i) => {
    const date = new Date(v.publishedAt).toISOString().split("T")[0];
    reply += `⬢ ${i + 1}. ${v.title}\n   Channel: ${
      v.channel
    }\n   Published: ${date}\n   Link: ${v.url}\n\n`;
  });

  await message.send({
    image: { url: results[0].thumbnail },
    caption: reply,
  });
});

Module({
  command: "song",
  package: "downloader",
  description: "Download audio from YouTube",
})(async (message, match) => {
  if (!match) return message.send("_need a yt url or song name_");
  let input = match.trim();
  try {
    await handleSongDownload(message.conn, input, message);
  } catch (err) {
    console.error("[PLUGIN SONG] Error:", err?.message || err);
    await message.send("⚠️ Song download failed. Please try again later.");
  }
});

Module({
  command: "mp4",
  package: "downloader",
  description: "Download YouTube MP4",
})(async (message, match) => {
  if (!match) return message.send("_need a yt url or video name_");
  let input = match.trim();
  try {
    await handleVideoDownload(message.conn, input, message, "720p");
  } catch (err) {
    console.error("[PLUGIN MP4] Error:", err?.message || err);
    await message.send("⚠️ Video download failed. Please try again later.");
  }
});

Module({
  command: "video",
  package: "downloader",
  description: "Download YouTube Video",
})(async (message, match) => {
  if (!match) return message.send("_need a yt url or video name_");
  let input = match.trim();
  try {
    await handleVideoDownload(message.conn, input, message, "720p");
  } catch (err) {
    console.error("[PLUGIN VIDEO] Error:", err?.message || err);
    await message.send("⚠️ Video download failed. Please try again later.");
  }
});

Module({
  command: "ytv",
  package: "downloader",
  description: "Download YouTube Video",
})(async (message, match) => {
  if (!match) return message.send("_need a yt url or video name_");
  let input = match.trim();
  try {
    await handleVideoDownload(message.conn, input, message, "720p");
  } catch (err) {
    console.error("[PLUGIN YTV] Error:", err?.message || err);
    await message.send("⚠️ Video download failed. Please try again later.");
  }
});

Module({
  command: "yta",
  package: "downloader",
  description: "Download YouTube Audio",
})(async (message, match) => {
  if (!match) return message.send("_need a yt url or song name_");
  let input = match.trim();
  try {
    await handleSongDownload(message.conn, input, message);
  } catch (err) {
    console.error("[PLUGIN YTA] Error:", err?.message || err);
    await message.send("⚠️ Audio download failed. Please try again later.");
  }
});

Module({
  command: "ytmp3",
  package: "downloader",
  description: "Download YouTube MP3",
})(async (message, match) => {
  if (!match) return message.send("_need a yt url or song name_");
  let input = match.trim();
  try {
    await handleSongDownload(message.conn, input, message);
  } catch (err) {
    console.error("[PLUGIN YTMP3] Error:", err?.message || err);
    await message.send("⚠️ MP3 download failed. Please try again later.");
  }
});

Module({
  command: "play",
  package: "downloader",
  description: "YouTube video player",
})(async (message, match) => {
  if (!match) return message.send("_need a yt url or song name_");
  let input = match.trim();
  try {
    await handleSongDownload(message.conn, input, message);
  } catch (err) {
    console.error("[PLUGIN PLAY] Error:", err?.message || err);
    await message.send("⚠️ Playback failed. Please try again later.");
  }
});

/* ----------------- PLAY (MP3) ----------------- */
Module({
  command: "play3",
  package: "downloader",
  description:
    "Download YouTube song using multiple APIs (PrivateZia / Zen / Finix)",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "🎵 Please provide a song name!\n\nExample: .play On My Way"
    );
  try {
    await message.react("⏳");
    const apiList = [
      "https://api.privatezia.biz.id",
      "https://api.zenzxz.my.id",
      "https://api.finix-id.my.id",
    ];
    const result = await tryApis(
      apiList,
      (base) =>
        `${base}/api/downloader/ytplaymp3?query=${encodeURIComponent(q)}`,
      { timeout: 25000 }
    );
    if (!result || !result.data?.result)
      return message.send("❌ All APIs failed. Please try again later.");
    const r = result.data.result;
    const title = r.title || q;
    const thumbnail = r.thumbnail;
    const downloadUrl = r.downloadUrl || r.downloadUrlFull || r.url;
    if (!downloadUrl)
      return message.send("⚠️ No download URL returned by API.");
    // download to temp
    await message.react("⬇️");
    const tempPath = await downloadToTemp(downloadUrl, ".mp3");
    const buffer = fs.readFileSync(tempPath);

    // prepare externalAdReply style
    const contextInfo = {};
    if (thumbnail)
      contextInfo.externalAdReply = {
        title: title,
        body: `Duration: ${r.duration || "unknown"}`,
        thumbnail: await (async () => {
          try {
            const t = await axios.get(thumbnail, {
              responseType: "arraybuffer",
            });
            return Buffer.from(t.data);
          } catch (e) {
            return undefined;
          }
        })(),
        sourceUrl: r.videoUrl || r.video || "",
      };

    await message.conn.sendMessage(
      message.from,
      {
        audio: buffer,
        mimetype: "audio/mpeg",
        fileName: `${title.replace(/[^\w\s]/gi, "")}.mp3`,
        contextInfo,
      },
      {
        quoted: makeGiftQuote(
          message.pushname || message.pushName,
          message.sender || message.from
        ),
      }
    );
    await message.react("✅");
    safeUnlink(tempPath);
  } catch (err) {
    console.error("Play Error:", err);
    await message.react("❌");
    return message.send("❌ Something went wrong while fetching the song.");
  }
});

/* ----------------- VIDEO (MP4) ----------------- */
Module({
  command: "video3",
  package: "downloader",
  description:
    "Download YouTube video using multiple APIs (PrivateZia / Zen / Finix)",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "🎥 Please provide a video name!\n\nExample: .video On My Way"
    );
  try {
    await message.send(`🔍 *Searching video:* ${q} ...`);
    const apiList = [
      "https://api.privatezia.biz.id",
      "https://api.zenzxz.my.id",
      "https://api.finix-id.my.id",
    ];
    const res = await tryApis(
      apiList,
      (base) =>
        `${base}/api/downloader/ytplaymp4?query=${encodeURIComponent(q)}`,
      { timeout: 30000 }
    );
    if (!res || !res.data?.result)
      return message.send("❌ All APIs failed. Try again later.");
    const data = res.data.result;
    const { title, thumbnail, duration, downloadUrl, quality } = data;
    if (!downloadUrl)
      return message.send("⚠️ No download URL returned by API.");

    // send thumbnail first if exists
    const tempThumb = thumbnail
      ? await (async () => {
          try {
            return await downloadToTemp(thumbnail, ".jpg");
          } catch (e) {
            return null;
          }
        })()
      : null;
    if (tempThumb) {
      await message.conn.sendMessage(
        message.from,
        {
          image: fs.readFileSync(tempThumb),
          caption: `🎬 *${title}*\n📏 Duration: ${
            duration || "unknown"
          }s\n📺 Quality: ${quality || "HD"}\n> *Downloading video...* ⏳`,
        },
        { quoted: message }
      );
    }

    await message.react("⬇️");
    const tempVideo = await downloadToTemp(downloadUrl, ".mp4");
    await message.conn.sendMessage(
      message.from,
      {
        video: fs.readFileSync(tempVideo),
        mimetype: "video/mp4",
        caption: `🎬 *${title}*\n*✅ Download Complete!*`,
      },
      { quoted: message }
    );

    [tempVideo, tempThumb].forEach(safeUnlink);
    await message.react("✅");
  } catch (err) {
    console.error("Video Error:", err);
    await message.react("❌");
    return message.send("❌ Something went wrong while downloading the video.");
  }
});

/* ----------------- SONG (alias for play) ----------------- */
Module({
  command: "song2",
  package: "downloader",
  description: "Download YouTube song (alias to play)",
})(async (message, match) => {
  // simply call the play handler by delegating
  return Module.get && Module.get("play")
    ? Module.get("play")(message, match)
    : message.send("❌ Play module not available.");
});

/* ----------------- GitClone ----------------- */
Module({
  command: "gitclone",
  package: "downloader",
  description: "Download GitHub repository as zip",
})(async (message, match) => {
  const arg = (match || "").trim();
  if (!arg)
    return message.send(
      "❌ Provide a GitHub link.\n\nExample:\n.gitclone https://github.com/username/repository"
    );
  try {
    const link = arg.split(/\s+/)[0];
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const m = link.match(regex);
    if (!m) return message.send("⚠️ Invalid GitHub repository format.");
    const [, username, repo] = m;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;
    // Confirm repository exists
    const head = await fetch(zipUrl, { method: "HEAD" });
    if (!head.ok) return message.send("Repository not found or private.");
    const filename = `${repo}.zip`;
    await message.conn.sendMessage(
      message.from,
      {
        document: { url: zipUrl },
        fileName: filename,
        mimetype: "application/zip",
        caption: `GitHub: ${username}/${repo}`,
      },
      { quoted: message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("GitClone Error:", err);
    await message.react("❌");
    return message.send(
      "❌ Failed to download repository. Please try again later."
    );
  }
});

/* ----------------- APK Downloader ----------------- */
Module({
  command: "apk",
  package: "downloader",
  description: "Download APK files using NexOracle API",
})(async (message, match) => {
  const appName = (match || "").trim();
  if (!appName) return message.send("*🏷️ Please provide an app name.*");
  try {
    await message.react("⏳");
    const apiUrl = `https://api.nexoracle.com/downloader/apk`;
    const params = { apikey: "free_key@maher_apis", q: appName };
    const res = await axios.get(apiUrl, { params }).catch(() => null);
    if (!res || !res.data || res.data.status !== 200 || !res.data.result) {
      await message.react("❌");
      return message.send("❌ Unable to find the APK. Please try again later.");
    }
    const { name, lastup, package: pkg, size, icon, dllink } = res.data.result;
    // send metadata first
    await message.conn.sendMessage(
      message.from,
      {
        image: { url: icon },
        caption: `\`「 APK DOWNLOADED 」\`\nName: ${name}\nUpdated: ${lastup}\nPackage: ${pkg}\nSize: ${size}\nSending APK...`,
      },
      { quoted: message }
    );
    const apkRes = await axios
      .get(dllink, { responseType: "arraybuffer" })
      .catch(() => null);
    if (!apkRes || !apkRes.data) {
      await message.react("❌");
      return message.send("❌ Failed to download the APK.");
    }
    await message.conn.sendMessage(
      message.from,
      {
        document: Buffer.from(apkRes.data),
        mimetype: "application/vnd.android.package-archive",
        fileName: `${name}.apk`,
        caption: "APK file",
      },
      { quoted: message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("APK Error:", err);
    await message.react("❌");
    return message.send("❌ Unable to fetch APK details.");
  }
});

/* ----------------- YT Community Post ----------------- */
Module({
  command: "ytpost",
  package: "downloader",
  description: "Download YouTube community post (text + images)",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send("❌ Please provide a YouTube community post URL.");
  try {
    await message.react("⏳");
    const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(
      q
    )}`;
    const { data } = await axios.get(apiUrl);
    if (!data?.status || !data?.data) {
      await message.react("❌");
      return message.send("⚠️ Failed to fetch the community post.");
    }
    const post = data.data;
    const caption = `📢 *YouTube Community Post*\n📝 *Content:* ${
      post.content || "No text content."
    }`;
    if (post.images && post.images.length > 0) {
      for (let i = 0; i < post.images.length; i++) {
        await message.conn.sendMessage(
          message.from,
          {
            image: { url: post.images[i] },
            caption: i === 0 ? caption : undefined,
          },
          { quoted: message }
        );
      }
    } else {
      await message.send(caption);
    }
    await message.react("✅");
  } catch (err) {
    console.error("YTPOST Error:", err);
    await message.react("❌");
    return message.send(
      "❌ Something went wrong while fetching the YouTube post."
    );
  }
});

/* ----------------- Ringtone ----------------- */
Module({
  command: "ringtone",
  package: "downloader",
  description: "Download random ringtone from API",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "🎧 Please provide a search term!\nExample: .ringtone Suna Hai"
    );
  try {
    await message.react("⏳");
    const apiUrl = `https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(
      q
    )}`;
    const { data } = await axios.get(apiUrl);
    if (
      !data?.status ||
      !Array.isArray(data?.result) ||
      data.result.length === 0
    ) {
      await message.react("❌");
      return message.send("❌ No ringtones found.");
    }
    const random = data.result[Math.floor(Math.random() * data.result.length)];
    await message.conn.sendMessage(
      message.from,
      {
        audio: { url: random.dl_link },
        mimetype: "audio/mpeg",
        fileName: `${random.title || "Ringtone"}.mp3`,
        caption: `🎶 ${random.title || "Ringtone"}`,
      },
      { quoted: message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("Ringtone Error:", err);
    await message.react("❌");
    return message.send("⚠️ Error fetching ringtone.");
  }
});

/* ----------------- Pinterest ----------------- */
Module({
  command: "pinterest",
  package: "downloader",
  description: "Download images or videos from Pinterest",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("❌ Please provide a Pinterest URL!");
  if (!q.includes("pinterest.com") && !q.includes("pin.it"))
    return message.send("❌ Invalid Pinterest link!");
  try {
    await message.react("⏳");
    const api1 = `https://api.privatezia.biz.id/api/downloader/pinterestdl?url=${encodeURIComponent(
      q
    )}`;
    const api2 = `https://bk9.fun/download/pinterest?url=${encodeURIComponent(
      q
    )}`;
    let data;
    try {
      const r = await axios.get(api1, { timeout: 20000 });
      data = r.data?.data?.medias;
    } catch {
      const r = await axios.get(api2, { timeout: 20000 });
      data = r.data?.BK9;
    }
    if (!data || data.length === 0) {
      await message.react("❌");
      return message.send("⚠️ No downloadable media found!");
    }
    const video = data.find((i) => i.url && i.extension === "mp4");
    const image = data.find((i) => i.url && i.extension !== "mp4");
    if (video) {
      await message.conn.sendMessage(
        message.from,
        {
          video: { url: video.url },
          mimetype: "video/mp4",
          caption: "Pinterest Video",
        },
        { quoted: message }
      );
    } else {
      await message.conn.sendMessage(
        message.from,
        { image: { url: image.url }, caption: "Pinterest Image" },
        { quoted: message }
      );
    }
    await message.react("✅");
  } catch (err) {
    console.error("Pinterest Error:", err);
    await message.react("❌");
    return message.send("⚠️ Failed to download Pinterest media.");
  }
});

/* ----------------- Mega.nz Downloader ----------------- */
Module({
  command: "mega",
  package: "downloader",
  description: "Download files from Mega.nz",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("❌ Please provide a Mega.nz link!");
  try {
    await message.react("⏳");
    const file = File.fromURL(q);
    const data = await new Promise((resolve, reject) =>
      file.download((err, data) => (err ? reject(err) : resolve(data)))
    );
    const fileName = file.name || `mega_file_${Date.now()}`;
    const savePath = path.join(os.tmpdir(), fileName);
    fs.writeFileSync(savePath, data);
    await message.conn.sendMessage(
      message.from,
      {
        document: fs.readFileSync(savePath),
        fileName,
        mimetype: "application/octet-stream",
        caption: `Downloaded from Mega.nz: ${fileName}`,
      },
      { quoted: message }
    );
    fs.unlinkSync(savePath);
    await message.react("✅");
  } catch (err) {
    console.error("MegaDL Error:", err);
    await message.react("❌");
    return message.send("❌ Failed to download from Mega.nz.");
  }
});

/* ----------------- YouTube MP4 (alternate) ----------------- */
Module({
  command: "video2",
  package: "downloader",
  description: "Download YouTube videos (MP4)",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("🎬 Please enter a video name or YouTube link!");
  try {
    await message.react("⏳");
    let videoUrl, title, thumb;
    if (q.includes("youtube.com") || q.includes("youtu.be")) videoUrl = q;
    else {
      const { videos } = await yts(q);
      if (!videos || videos.length === 0)
        return message.send("❌ No video found!");
      videoUrl = videos[0].url;
      title = videos[0].title;
      thumb = videos[0].thumbnail;
    }
    const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(
      videoUrl
    )}&format=720`;
    const res = await axios.get(apiUrl, { timeout: 30000 });
    if (!res.data?.result?.download)
      return message.send("❌ Failed to fetch video link.");
    const videoData = res.data.result;
    await message.conn.sendMessage(
      message.from,
      {
        video: { url: videoData.download },
        mimetype: "video/mp4",
        fileName: `${videoData.title || title || "video"}.mp4`,
        caption: `${videoData.title || title}`,
      },
      { quoted: message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("Video2 Error:", err);
    await message.react("❌");
    return message.send("❌ Failed to download video.");
  }
});

/* ----------------- Play2 (alternate) ----------------- */
Module({
  command: "play2",
  package: "downloader",
  description: "Download YouTube music (MP3) alternate API",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("🎧 Please enter song name!");
  try {
    await message.react("⏳");
    const { videos } = await yts(q);
    if (!videos || videos.length === 0)
      return message.send("❌ No results found!");
    const vid = videos[0];
    await message.conn.sendMessage(
      message.from,
      { image: { url: vid.thumbnail }, caption: `🎧 PLAYING: ${vid.title}` },
      { quoted: message }
    );
    const api = `https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(
      vid.url
    )}`;
    const res = await axios.get(api, { timeout: 30000 });
    if (!res.data?.status || !res.data?.result?.data?.downloadUrl)
      return message.send("❌ Failed to get audio link.");
    await message.conn.sendMessage(
      message.from,
      {
        audio: { url: res.data.result.data.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${vid.title}.mp3`,
      },
      { quoted: message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("Play2 Error:", err);
    await message.react("❌");
    return message.send("❌ Download failed.");
  }
});
