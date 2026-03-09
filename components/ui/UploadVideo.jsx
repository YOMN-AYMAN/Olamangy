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
  const res = await fetch(`${BASE_URL}/video/${videoId}`, {method: "DELETE"});
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

    // تحديث الـ progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    // لما ينجح الرفع
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("Bunny upload successful!");
        resolve({
          success: true,
          publicUrl: uploadURL,
          status: xhr.status,
        });
      } else {
        reject(new Error(`فشل الرفع: ${xhr.status} ${xhr.statusText}`));
      }
    };

    // لو حصل خطأ في الشبكة
    xhr.onerror = () => reject(new Error("خطأ في الشبكة أثناء الرفع"));

    // فتح الاتصال
    xhr.open("PUT", uploadURL);

    // مهم جداً: AccessKey زي ما في الدالة التانية
    xhr.setRequestHeader(
      "AccessKey",
      process.env.NEXT_PUBLIC_BUNNY_STREAM_KEY
    );

    // نوع الملف
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    );

    // ارسال الملف
    xhr.send(file);
  });
}
const uploadToBunny = async (fileObject) => {
  try {
    console.log("Starting Bunny upload for:", fileObject.name);

    // Step 1: Get upload URL from backend
    const response = await fetch(`https://bunny-beryl.vercel.app/api/bunny/link/${fileObject.name}`);
    if (!response.ok) {
      throw new Error("Failed to get Bunny upload URL");
    }
    const data = await response.json();
    const {uploadURL, videoGuid, videoId} = data;

    console.log("Got Bunny upload info:", data);

    // Update status
    updateFileProgress(fileObject.id, 0, "uploading");

    // Step 2: Upload file using PUT
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          updateFileProgress(
            fileObject.id,
            progress,
            "uploading"
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Bunny upload successful!");
          updateFileProgress(
            fileObject.id,
            100,
            "completed",
            videoGuid
          );
          resolve({
            success: true,
            publicUrl: videoGuid,
            key: videoId,
            service: 'bunny'
          });
        } else {
          reject(new Error(`Bunny upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Bunny upload network error"));
      };

      xhr.open("PUT", uploadURL);
      // 👈 هنا بالظبط
      xhr.setRequestHeader(
        "AccessKey",
        process.env.NEXT_PUBLIC_BUNNY_STREAM_KEY
      );
      xhr.setRequestHeader(
        "Content-Type",
        "application/octet-stream"
      );
      // The upload URL provided by the backend is used directly.
      xhr.send(fileObject.file);
    });

  } catch (error) {
    console.error("Bunny upload error:", error);
    updateFileProgress(fileObject.id, 0, "error", null, error.message);
    throw error;
  }
};
