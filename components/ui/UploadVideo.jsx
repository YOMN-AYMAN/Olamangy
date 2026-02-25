// ============================================
//   bunnyService.js — Bunny CDN API Service
//   الاستخدام: import * as bunny from './bunnyService'
// ============================================

const BASE_URL = "https://bunny-beryl.vercel.app/api/bunny"; // ← غيّرها لو الباك على domain مختلف

// ─────────────────────────────────────────
// 1. إنشاء فيديو جديد والحصول على Upload URL
// ─────────────────────────────────────────
/**
 * const { uploadURL, videoGuid } = await getUploadLink("درس اول");
 * // ثم ارفع الفيديو على uploadURL بـ PUT request
 */
export async function getUploadLink(title) {
  const res = await fetch(`${BASE_URL}/link/${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error((await res.json()).error || "فشل جلب رابط الرفع");
  return res.json();
}

// ─────────────────────────────────────────
// 2. جلب رابط مشاهدة الفيديو (Embed / HLS)
// ─────────────────────────────────────────
/**
 * const { embedUrl, thumbnailUrl } = await getVideoLink("abc-guid-123");
 */
export async function getVideoLink(videoId) {
  const res = await fetch(`${BASE_URL}/video/${videoId}/link`);
  if (!res.ok) throw new Error((await res.json()).error || "فشل جلب رابط الفيديو");
  return res.json();
}

// ─────────────────────────────────────────
// 3. الحصول على روابط مباشرة (HLS + MP4)
// ─────────────────────────────────────────
/**
 * const { hlsUrl } = await getDirectLink("abc-guid-123");
 */
export async function getDirectLink(videoId) {
  const res = await fetch(`${BASE_URL}/video/${videoId}/direct-link`);
  if (!res.ok) throw new Error((await res.json()).error || "فشل جلب الرابط المباشر");
  return res.json();
}

// ─────────────────────────────────────────
// 4. جلب كل الفيديوهات
// ─────────────────────────────────────────
/**
 * const { videos, totalItems } = await getAllVideos();
 */
export async function getAllVideos() {
  const res = await fetch(`${BASE_URL}/videos`);
  if (!res.ok) throw new Error((await res.json()).error || "فشل جلب الفيديوهات");
  return res.json();
}

// ─────────────────────────────────────────
// 5. حذف فيديو
// ─────────────────────────────────────────
/**
 * await deleteVideo("abc-guid-123");
 */
export async function deleteVideo(videoId) {
  const res = await fetch(`${BASE_URL}/video/${videoId}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).error || "فشل حذف الفيديو");
  return res.json();
}

// ─────────────────────────────────────────
// 6. الحصول على رابط مشاهدة مؤمَّن (Token)
// ─────────────────────────────────────────
/**

 * const { secureUrl } = await getSecureWatchUrl("abc-guid-123");
 * // secureUrl صالح لـ 48 ساعة
 */
export async function getSecureWatchUrl(videoGuid) {
  const res = await fetch(`${BASE_URL}/video/${videoGuid}/watch/`);
  if (!res.ok) throw new Error((await res.json()).error || "فشل توليد الرابط المؤمَّن");
  return res.json();
}

// ─────────────────────────────────────────
// 7. رفع الفيديو الفعلي إلى Bunny بعد جلب الـ Upload URL
// ─────────────────────────────────────────
/**

 * const { uploadURL, videoGuid } = await getUploadLink("درس اول");
 * await uploadVideo(uploadURL, file, (p) => console.log(p + "%"));
 */
export function uploadVideo(uploadURL, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`فشل الرفع: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error("خطأ في الشبكة أثناء الرفع"));

    xhr.open("PUT", uploadURL);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    xhr.send(file);
  });
} 