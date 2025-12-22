const axios = require("axios");
const yts = require("yt-search");
const { fetchJson } = require("../lib/handier");
const { Module } = require("../lib/plugins");

function formatNumber(num) {
  if (typeof num !== "number") return String(num || "0");
  return num >= 1e6
    ? (num / 1e6).toFixed(1) + "M"
    : num >= 1e3
    ? (num / 1e3).toFixed(1) + "K"
    : num.toString();
}

/* ---------------- YOUTUBE SEARCH (yts) ---------------- */
Module({
  command: "yts2",
  package: "search",
  description: "Search for YouTube Videos",
})(async (message, match) => {
  const args = (match || "").trim().split(/\s+/).filter(Boolean);
  const q = (match || "").trim();
  if (!q) return message.send("⚠️ Please provide a search query!");
  try {
    await message.react("🔍");
    const searchResults = await yts(q);
    const videos = searchResults?.videos || [];
    if (!videos.length) return message.send("❌ No videos found.");
    const firstVideo = videos[0];
    let resultText = "🎬 *YouTube Search Results:*\n\n";
    videos.slice(0, 10).forEach((video, index) => {
      resultText += `${index + 1}. *${video.title}*\n`;
      resultText += `📺 Channel: ${video.author?.name || video.author}\n`;
      resultText += `⏳ Duration: ${
        video.duration?.timestamp || video.timestamp || "N/A"
      }\n`;
      resultText += `👁️ Views: ${formatNumber(video.views || 0)}\n`;
      resultText += `🕓 Uploaded: ${video.ago || "N/A"}\n`;
      resultText += `🔗 Link: ${video.url}\n\n`;
    });
    await message.conn.sendMessage(
      message.from,
      {
        image: { url: firstVideo.thumbnail },
        caption: resultText,
      },
      { quoted: message.mek || message }
    );
  } catch (error) {
    console.error("YTS Error:", error);
    await message.react("❌");
    return message.send(
      `❌ Error: ${
        error.message || "An error occurred while searching YouTube."
      }`
    );
  }
});

/* ---------------- GITHUB SEARCH ---------------- */
Module({
  command: "github",
  package: "search",
  description: "Fetch GitHub user profile details",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "⚠️ Please provide a username.\n\nExample: *.github KAISEN-MD*"
    );
  try {
    await message.react("🌍");
    const { data } = await axios.get(
      `https://api.github.com/users/${encodeURIComponent(q)}`,
      { timeout: 15000 }
    );
    const caption = `\`「 🧑‍💻 GITHUB USER INFO 」\`\n╭────────────────⊷\n│👤 *Username:* ${
      data.login
    }\n│🏷️ *Name:* ${data.name || "N/A"}\n│🌍 *Location:* ${
      data.location || "N/A"
    }\n│🏢 *Company:* ${data.company || "N/A"}\n│📦 *Public Repos:* ${
      data.public_repos
    }\n│⭐ *Followers:* ${data.followers}\n│🤝 *Following:* ${
      data.following
    }\n│📅 *Created On:* ${new Date(
      data.created_at
    ).toLocaleDateString()}\n│🔗 *Profile:* ${
      data.html_url
    }\n╰────────────────┈⊷\n> *© ᴘσωєʀє∂...*`;
    await message.conn.sendMessage(
      message.from,
      {
        image: { url: data.avatar_url },
        caption,
        contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          externalAdReply: {
            title: `${data.login} on GitHub`,
            body: `⭐ ${data.public_repos} Repositories | ${data.followers} Followers`,
            thumbnailUrl: data.avatar_url,
            sourceUrl: data.html_url,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: message.mek || message }
    );
    await message.react("✅");
  } catch (e) {
    console.error("GitHub Error:", e);
    if (e.response && e.response.status === 404)
      return message.send("🚫 User not found. Please check the username.");
    await message.react("❌");
    return message.send(
      "⚠️ Error fetching GitHub user details. Try again later."
    );
  }
});

/* ---------------- GOOGLE IMAGE SEARCH (img) ---------------- */
Module({
  command: "img",
  package: "search",
  description: "Search and download Google images",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) {
    await message.conn.sendMessage(message.from, {
      react: { text: "❓", key: message.mek?.key || message.key },
    });
    return message.send("Please provide a search query for the image.");
  }
  try {
    await message.react("⏳");
    const url = `https://api.id.dexter.it.com/search/google/image?q=${encodeURIComponent(
      q
    )}`;
    const response = await axios.get(url, { timeout: 15000 });
    const data = response.data;
    let results =
      data?.result?.result?.search_data ||
      data?.result?.search_data ||
      data?.result ||
      data?.results ||
      data?.data ||
      [];
    if (!Array.isArray(results) || results.length === 0) {
      await message.conn.sendMessage(message.from, {
        react: { text: "❌", key: message.mek?.key || message.key },
      });
      return message.send("*No images found for the given query.*");
    }
    await message.conn.sendMessage(message.from, {
      react: { text: "✅", key: message.mek?.key || message.key },
    });
    const selectedImages = results
      .map((r) => (typeof r === "string" ? r : r.url || r.image || r.link))
      .filter(Boolean)
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    for (const imageUrl of selectedImages) {
      await message.conn.sendMessage(
        message.from,
        { image: { url: imageUrl }, caption: "> *© ᴘσωєʀє∂ x-kira*" },
        { quoted: message.mek || message }
      );
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    await message.react("✅");
  } catch (error) {
    console.error("IMG Error:", error);
    await message.conn.sendMessage(message.from, {
      react: { text: "❌", key: message.mek?.key || message.key },
    });
    return message.send(
      `❌ *Error:* ${error.message || "occurred while fetching images."}`
    );
  }
});

/* ---------------- GOOGLE SEARCH ---------------- */
Module({
  command: "google",
  package: "search",
  description: "Search from Google",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("⚠️ Enter a query to search.");
  try {
    const data = await fetchJson(
      `${global.api}/search/google?apikey=${
        global.myName
      }&query=${encodeURIComponent(q)}`
    );
    if (!data || !data.success) return message.send("❌ Error fetching data!");
    let txt = `🌍 *Google Search Results for:* ${q}\n\n`;
    (data.results || []).slice(0, 5).forEach((r) => {
      txt += `🔹 *${r.title}*\n📝 ${r.description}\n🔗 ${r.url}\n\n`;
    });
    await message.conn.sendMessage(
      message.from,
      { text: txt + `> ${global.footer}` },
      { quoted: message.mek || message }
    );
  } catch (e) {
    console.error("Google Error:", e);
    return message.send(`❌ ${e.message || "Error fetching Google results."}`);
  }
});

/* ---------------- WIKIPEDIA ---------------- */
Module({
  command: "wiki",
  package: "search",
  description: "Search from Wikipedia",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("⚠️ Please provide a search term!");
  try {
    const data = await fetchJson(
      `${global.api}/search/wikimedia?apikey=${
        global.myName
      }&title=${encodeURIComponent(q)}`
    );
    if (!data || !data.success) return message.send("❌ No data found!");
    let msg = `📚 *Wikipedia Search for:* ${q}\n\n`;
    (data.results || []).slice(0, 5).forEach((a) => {
      msg += `📝 *Title:* ${a.title}\n🔗 ${a.source}\n\n`;
    });
    await message.conn.sendMessage(
      message.from,
      { text: msg + `> ${global.footer}` },
      { quoted: message.mek || message }
    );
  } catch (e) {
    console.error("Wiki Error:", e);
    return message.send(`❌ ${e.message || "Error fetching Wikipedia."}`);
  }
});

/* ---------------- WEATHER ---------------- */
Module({
  command: "weather",
  package: "search",
  description: "Get weather information for a city",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "❗ Please provide a city name.\n\nExample: *.weather Karachi*"
    );
  try {
    await message.react("🌤");
    const apiKey =
      process.env.OPENWEATHER_API_KEY || "2d61a72574c11c4f36173b627f8cb177";
    const city = q;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url, { timeout: 15000 });
    const data = response.data;
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const caption = `\`「 🌦️ WEATHER REPORT 」\`\n╭────────────────⊷\n│🏙️ *City:* ${
      data.name
    }, ${data.sys.country}\n│🌡️ *Temperature:* ${
      data.main.temp
    }°C\n│🤒 *Feels Like:* ${data.main.feels_like}°C\n│🌤️ *Condition:* ${
      data.weather[0].main
    }\n│🧾 *Description:* ${data.weather[0].description}\n│💧 *Humidity:* ${
      data.main.humidity
    }%\n│💨 *Wind:* ${data.wind.speed} m/s\n│🔽 *Pressure:* ${
      data.main.pressure
    } hPa\n│📆 *Date:* ${new Date().toLocaleDateString()}\n│🕐 *Time:* ${new Date().toLocaleTimeString()}\n╰───────────────┈⊷\n> *© ᴘσωєʀє∂ x-kira*`;
    await message.conn.sendMessage(
      message.from,
      {
        image: { url: iconUrl },
        caption,
        contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          externalAdReply: {
            title: `🌤 ${data.name} Weather`,
            body: `Temperature: ${data.main.temp}°C`,
            thumbnailUrl: iconUrl,
            sourceUrl: `https://openweathermap.org/city/${data.id}`,
            mediaType: 1,
          },
        },
      },
      { quoted: message.mek || message }
    );
    await message.react("✅");
  } catch (e) {
    console.error("Weather Error:", e);
    if (e.response && e.response.status === 404)
      return message.send(
        "🚫 City not found. Please check the spelling and try again."
      );
    return message.send(
      "⚠️ Something went wrong while fetching weather data. Try again later."
    );
  }
});

/* ---------------- LYRICS ---------------- */
Module({
  command: "lyrics",
  package: "search",
  description: "Get Song Lyrics",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("🎤 Provide a song name!");
  try {
    const data = await fetchJson(
      `${global.api}/search/lyrics?apikey=${
        global.myName
      }&query=${encodeURIComponent(q)}`
    );
    if (!data || !data.success) return message.send("❌ No lyrics found!");
    await message.conn.sendMessage(
      message.from,
      { text: `🎶 *Lyrics for ${q}:*\n\n${data.result}\n\n> ${global.footer}` },
      { quoted: message.mek || message }
    );
  } catch (e) {
    console.error("Lyrics Error:", e);
    return message.send(`❌ ${e.message || "Error fetching lyrics."}`);
  }
});

/* ---------------- NEWS ---------------- */
Module({
  command: "news",
  package: "search",
  description: "Get Latest News Headlines",
})(async (message, match) => {
  try {
    const key = process.env.NEWSAPI_KEY || "0f2c43ab11324578a7b1709651736382";
    const res = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`,
      { timeout: 15000 }
    );
    const articles = (res.data.articles || []).slice(0, 5);
    for (let a of articles) {
      await message.conn.sendMessage(
        message.from,
        {
          image: a.urlToImage ? { url: a.urlToImage } : undefined,
          caption: `📰 *${a.title}*\n🗞️ ${
            a.description || "No description"
          }\n🔗 ${a.url}\n\n> ${global.footer}`,
        },
        { quoted: message.mek || message }
      );
    }
  } catch (e) {
    console.error("News Error:", e);
    return message.send(`❌ ${e.message || "Error fetching news."}`);
  }
});

/* ---------------- MOVIE (OMDB) ---------------- */
Module({
  command: "movie",
  package: "search",
  description: "Get detailed Movie or Series information.",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "🍿 Please provide a movie or series name!\n\nExample: *.movie Interstellar*"
    );
  try {
    const { data } = await axios.get(
      `http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(
        q
      )}&plot=full`,
      { timeout: 15000 }
    );
    if (data.Response === "False")
      return message.send(
        "❌ No movie found. Please check the spelling or try another title."
      );
    const caption = `\`「 🎬 MOVIE INFORMATION 」\`\n╭─────────────────⊷\n│🎞️ *Title:* ${data.Title} (${data.Year})\n│⭐ *Rated:* ${data.Rated}\n│📆 *Released:* ${data.Released}\n│🌀 *Genre:* ${data.Genre}\n│🎥 *Director:* ${data.Director}\n│🧑‍🤝‍🧑 *Actors:* ${data.Actors}\n│📃 *Plot:* ${data.Plot}\n│🌍 *Country:* ${data.Country}\n│🏆 *Awards:* ${data.Awards}\n│💫 *IMDb Rating:* ${data.imdbRating}\n╰────────────────┈⊷\n> *© ᴘσωєʀє∂ x-kira*`;
    await message.conn.sendMessage(
      message.from,
      {
        image: { url: data.Poster },
        caption,
      },
      { quoted: message.mek || message }
    );
    await message.react("✅");
  } catch (e) {
    console.error("Movie Error:", e);
    return message.send(
      "⚠️ Error fetching movie details. Please try again later."
    );
  }
});

/* ---------------- YT STALK ---------------- */
Module({
  command: "ytstalk",
  package: "search",
  description: "Get details about a YouTube channel.",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "❌ Please provide a valid YouTube channel username or ID."
    );
  try {
    await message.react("🔍");
    const apiUrl = `https://delirius-apiofc.vercel.app/tools/ytstalk?channel=${encodeURIComponent(
      q
    )}`;
    const { data } = await axios.get(apiUrl, { timeout: 15000 });
    if (!data?.status || !data?.data)
      return message.send("⚠️ Failed to fetch channel details.");
    const yt = data.data;
    const caption = `\`「 YOUTUBE STALKER 」\`\n╭────────────────⊷\n│👤 *Username:* ${yt.username}\n│📊 *Subscribers:* ${yt.subscriber_count}\n│🎥 *Videos:* ${yt.video_count}\n│🔗 *Channel:* ${yt.channel}\n╰───────────────┈⊷\n> *© ᴘσωєʀє∂ x-kira*`;
    await message.conn.sendMessage(
      message.from,
      { image: { url: yt.avatar }, caption },
      { quoted: message.mek || message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("YTStalk Error:", err);
    return message.send("❌ Error fetching YouTube data.");
  }
});

/* ---------------- WHATSAPP CHANNEL STALK ---------------- */
Module({
  command: "wastalk",
  package: "search",
  description: "Get WhatsApp Channel info from link",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "❎ Example: .wastalk https://whatsapp.com/channel/xxxx"
    );
  try {
    const matchId = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!matchId) return message.send("⚠️ Invalid link format.");
    const inviteId = matchId[1];
    const metadata = await message.conn.newsletterMetadata("invite", inviteId);
    if (!metadata?.id)
      return message.send("❌ Channel not found or inaccessible.");
    const caption = `\`「 WHATSAPP CHANNEL 」\`\n╭────────────────⊷\n│📛 *Name:* ${
      metadata.name
    }\n│🆔 *Jid:* ${metadata.id}\n│👥 *Followers:* ${
      metadata.subscribers || "N/A"
    }\n│📅 *Created:* ${
      metadata.creation_time
        ? new Date(metadata.creation_time * 1000).toLocaleString()
        : "Unknown"
    }\n│📜 *Description:* ${
      metadata.description || "No description"
    }\n╰───────────────┈⊷\n> *© ᴘσωєʀє∂ x-kira*`;
    await message.conn.sendMessage(
      message.from,
      {
        image: metadata.preview
          ? { url: `https://pps.whatsapp.net${metadata.preview}` }
          : undefined,
        caption,
      },
      { quoted: message.mek || message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("Wastalk Error:", err);
    return message.send("⚠️ Error fetching channel info.");
  }
});

/* ---------------- X/TWITTER STALK ---------------- */
Module({
  command: "xstalk",
  package: "search",
  description: "Get details about a Twitter/X user.",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("❌ Provide a Twitter username.");
  try {
    await message.react("🐦");
    const apiUrl = `https://delirius-apiofc.vercel.app/tools/xstalk?username=${encodeURIComponent(
      q
    )}`;
    const { data } = await axios.get(apiUrl, { timeout: 15000 });
    if (!data?.status || !data?.data) return message.send("⚠️ User not found.");
    const u = data.data;
    const caption = `\`「 TWITTER/X STALKER 」\`\n╭────────────────⊷\n│👤 *Name:* ${
      u.name
    }\n│🔹 *Username:* @${u.username}\n│✔️ *Verified:* ${
      u.verified ? "✅" : "❌"
    }\n│👥 *Followers:* ${u.followers_count}\n│👤 *Following:* ${
      u.following_count
    }\n│📝 *Tweets:* ${u.tweets_count}\n│📅 *Joined:* ${
      u.created
    }\n│🔗 *Profile:* ${u.url}\n╰───────────────┈⊷\n> *© ᴘσωєʀє∂ x-kira*`;
    await message.conn.sendMessage(
      message.from,
      { image: { url: u.avatar }, caption },
      { quoted: message.mek || message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("Xstalk Error:", err);
    return message.send("❌ Error fetching X profile.");
  }
});

/* ---------------- TIKTOK STALK ---------------- */
Module({
  command: "tiktokstalk",
  package: "search",
  description: "Fetch TikTok user profile details.",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("❎ Example: .tiktokstalk mrbeast");
  try {
    await message.react("🎭");
    const { data } = await axios.get(
      `https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(
        q
      )}`,
      { timeout: 15000 }
    );
    if (!data?.status) return message.send("❌ User not found.");
    const u = data.data.user,
      s = data.data.stats;
    const caption = `\`「 TIKTOK STALKER 」\`\n╭─────────────────⊷\n│👤 *Username:* @${
      u.uniqueId
    }\n│📛 *Nickname:* ${u.nickname}\n│✅ *Verified:* ${
      u.verified ? "Yes ✅" : "No ❌"
    }\n│📍 *Region:* ${u.region}\n│📝 *Bio:* ${
      u.signature || "No bio"
    }\n│🌐 *Bio Link:* ${u.bioLink?.link || "None"}\n│👥 *Followers:* ${
      s.followerCount
    }\n│👤 *Following:* ${s.followingCount}\n│❤️ *Likes:* ${
      s.heartCount
    }\n│🎥 *Videos:* ${s.videoCount}\n│📅 *Created:* ${new Date(
      u.createTime * 1000
    ).toLocaleDateString()}\n│🔒 *Private:* ${
      u.privateAccount ? "Yes 🔒" : "No 🌍"
    }\n│🔗 *Profile:* https://tiktok.com/@${
      u.uniqueId
    }\n╰────────────────┈⊷\n> *© ᴘσωєʀє∂ x-kira*`;
    await message.conn.sendMessage(
      message.from,
      { image: { url: u.avatarLarger }, caption },
      { quoted: message.mek || message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("TikTokStalk Error:", err);
    return message.send("⚠️ Error fetching TikTok data.");
  }
});

/* ---------------- INSTAGRAM STALK ---------------- */
Module({
  command: "igstalk",
  package: "search",
  description: "Get details about an Instagram user.",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q)
    return message.send(
      "❎ Please provide an Instagram username.\n\nExample: .igstalk cristiano"
    );
  try {
    await message.react("📸");
    const apiUrl = `https://api.siputzx.my.id/api/stalk/ig?username=${encodeURIComponent(
      q
    )}`;
    const { data } = await axios.get(apiUrl, { timeout: 15000 });
    if (!data?.status)
      return message.send("⚠️ User not found or private account.");
    const user = data.result;
    const caption = `\`「 INSTAGRAM STALKER 」\`\n╭─────────────────⊷\n│👤 *Username:* @${
      user.username
    }\n│📛 *Full Name:* ${user.full_name}\n│✅ *Verified:* ${
      user.is_verified ? "Yes ✅" : "No ❌"
    }\n│🔒 *Private:* ${
      user.is_private ? "Yes 🔒" : "No 🌍"
    }\n│👥 *Followers:* ${user.followers}\n│👤 *Following:* ${
      user.following
    }\n│📸 *Posts:* ${user.posts}\n│📝 *Bio:* ${
      user.biography || "No bio available."
    }\n│🌐 *Bio Link:* ${
      user.external_url || "No link"
    }\n│🔗 *Profile:* https://instagram.com/${
      user.username
    }\n╰────────────────┈⊷\n> *© ᴘσωєʀє∂ x-kira*`;
    await message.conn.sendMessage(
      message.from,
      { image: { url: user.profile_pic_url_hd }, caption },
      { quoted: message.mek || message }
    );
    await message.react("✅");
  } catch (err) {
    console.error("IGStalk Error:", err);
    return message.send(
      "❌ Error fetching Instagram profile. Try again later."
    );
  }
});

/* ---------------- WALLPAPER ---------------- */
Module({
  command: "wallpaper",
  package: "search",
  description: "Search and send a wallpaper image.",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("🔍 Example: *.wallpaper anime girl*");
  try {
    const apiUrl = `https://apis.davidcyriltech.my.id/search/wallpaper?text=${encodeURIComponent(
      q
    )}`;
    let res = await axios.get(apiUrl, { timeout: 15000 });
    let result = res.data?.result;
    if (!result || result.length === 0) {
      await message.send("⚠️ Main API failed, trying fallback...");
      const fallbackUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        q
      )}&client_id=${process.env.UNSPLASH_KEY || "YOUR_UNSPLASH_ACCESS_KEY"}`;
      const fallback = await axios.get(fallbackUrl, { timeout: 15000 });
      result = (fallback.data.results || []).map((v) => v.urls.full);
    }
    if (!result || result.length === 0)
      return message.send("❌ No wallpaper found.");
    const randomImage = result[Math.floor(Math.random() * result.length)];
    await message.conn.sendMessage(
      message.from,
      {
        image: { url: randomImage },
        caption: `🖼️ *Wallpaper Search:* ${q}\n> *© ᴘσωєʀє∂ x-kira*`,
      },
      { quoted: message.mek || message }
    );
  } catch (error) {
    console.error("Wallpaper Error:", error);
    return message.send(
      `❌ *Error:* ${error.message || "Failed to fetch wallpaper."}`
    );
  }
});

/* ---------------- PLAYSTORE ---------------- */
Module({
  command: "playstore",
  package: "search",
  description: "Search for an app on the Play Store.",
})(async (message, match) => {
  const q = (match || "").trim();
  if (!q) return message.send("⚠️ Please provide an *app name* to search.");
  try {
    await message.send("🔍 Searching Play Store, please wait...");
    const apiUrl = `https://apis.davidcyriltech.my.id/search/playstore?q=${encodeURIComponent(
      q
    )}`;
    const { data } = await axios.get(apiUrl, { timeout: 15000 });
    if (!data || !data.success || !data.result)
      return message.send("❌ No app found for your search query.");
    const app = data.result;
    const messageText =
      `\`「 PLAY STORE SEARCH 」\`\n╭────────────────⊷\n│📱 *Name:* ${
        app.title || "N/A"
      }\n│📖 *Summary:* ${app.summary || "Not available"}\n│📥 *Installs:* ${
        app.installs || "N/A"
      }\n│⭐ *Rating:* ${app.score || "N/A"}\n│💲 *Price:* ${
        app.price || "Free"
      }\n│📦 *Size:* ${app.size || "Unknown"}\n│🤖 *Android:* ${
        app.androidVersion || "N/A"
      }\n│👨‍💻 *Developer:* ${app.developer || "Unknown"}\n│📅 *Released:* ${
        app.released || "N/A"
      }\n│🔄 *Updated:* ${app.updated || "N/A"}\n│🔗 *Play Link:* ${
        app.url || "No link"
      }\n╰───────────────┈⊷\n> *© ᴘσωєʀє∂ x-kira*`.trim();
    if (app.icon) {
      await message.conn.sendMessage(
        message.from,
        { image: { url: app.icon }, caption: messageText },
        { quoted: message.mek || message }
      );
    } else {
      await message.send(messageText);
    }
  } catch (error) {
    console.error("Playstore Error:", error);
    return message.send("🚫 Error fetching app data. Try again later.");
  }
});

// End of converted search plugins file
