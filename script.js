async function processLink() {
  const url = document.getElementById('url').value.trim();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "<p>🔍 Mendeteksi link...</p>";

  if (!url) {
    resultDiv.innerHTML = "<p style='color:red'>Masukkan URL terlebih dahulu.</p>";
    return;
  }

  try {
    if (url.includes("tiktok.com")) {
      // === TikTok Downloader ===
      const api = `https://api.kriszzyy.xyz/downloader/tiktok?url=${encodeURIComponent(url)}`;
      const res = await fetch(api);
      const data = await res.json();

      if (!data.status) throw new Error("Gagal mengambil data TikTok");

      const video = data.result.data;
      resultDiv.innerHTML = `
        <img src="${video.cover}" class="thumb" alt="Thumbnail">
        <h2>${video.title || "Video TikTok"}</h2>
        <video src="${video.play}" controls></video>
        <div>
          <a href="${video.play}" class="download-btn" target="_blank">Download Video</a>
          <a href="${video.music}" class="download-btn" target="_blank">Download Audio</a>
        </div>
      `;
    } 
    else if (url.includes("youtu")) {
      // === YouTube Downloader ===
      const apiVideo = `https://api.kriszzyy.xyz/downloader/ytv?url=${encodeURIComponent(url)}`;
      const apiAudio = `https://api.kriszzyy.xyz/downloader/yta?url=${encodeURIComponent(url)}`;

      const [resVid, resAud] = await Promise.all([fetch(apiVideo), fetch(apiAudio)]);
      const vidData = await resVid.json();
      const audData = await resAud.json();

      if (!vidData.status && !audData.status) throw new Error("Gagal mengambil data YouTube");

      resultDiv.innerHTML = `
        <img src="${vidData.thumbnail || audData.thumbnail}" class="thumb" alt="Thumbnail">
        <h2>${vidData.title || audData.title}</h2>
        <div>
          <a href="${vidData.download_url}" class="download-btn" target="_blank">🎥 YouTube Video</a>
          <a href="${audData.download_url}" class="download-btn" target="_blank">🎧 YouTube Audio</a>
        </div>
      `;
    } 
    else {
      resultDiv.innerHTML = "<p style='color:orange'>❌ Link tidak dikenali. Gunakan link YouTube atau TikTok.</p>";
    }
  } catch (e) {
    resultDiv.innerHTML = `<p style='color:red'>Terjadi kesalahan: ${e.message}</p>`;
  }
}