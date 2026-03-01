export const uploadFileToB2 = async (file, onProgress) => {
  if (!file) throw new Error("اختار ملف أولاً");

  // 1️⃣ اطلب presigned URL
  const res = await fetch(
    `https://bunny-beryl.vercel.app/api/b2/presigned-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`
  );
  if (!res.ok) throw new Error("فشل الحصول على رابط الرفع");
  const { presignedUrl } = await res.json();

  // 2️⃣ ارفع مع progress عبر XMLHttpRequest
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent); // ✅ ارسل النسبة للـ component
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) resolve();
      else reject(new Error(`فشل الرفع: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error("خطأ في الشبكة"));

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });

  // 3️⃣ ارجع الرابط
  return `https://f003.backblazeb2.com/file/Video-Dolphin/${encodeURIComponent(file.name)}`;
};







  // const handleClick = () => {
  //   fileInputRef.current.click();
  // };


  // const handleChangeFile = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // ✅ التحقق من نوع وحجم الملف
  //   const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  //   const maxSize = 5 * 1024 * 1024; // 5MB

  //   if (!allowedTypes.includes(file.type)) {
  //     alert("فقط صور JPG, PNG, WEBP مسموحة");
  //     return;
  //   }

  //   if (file.size > maxSize) {
  //     alert("حجم الصورة يجب أن يكون أقل من 5MB");
  //     return;
  //   }

  //   setUploading(true); // ✅ أضف هذا الـ state

  //   try {
  //     const url = await uploadFileToB2(file);
  //     console.log("Direct URL:", url);
  //     await set(ref(rtdb, `kkkkkkkkkk`), url);
  //     // if (onUploaded) onUploaded(url);
  //     setUserData(prev => ({...prev, avatar: url}));

  //   } catch (err) {
  //     console.error(err);
  //     alert("فشل رفع الملف: " + err.message);
  //   } finally {
  //     setUploading(false); // ✅ دائماً يوقف الـ loading
  //     e.target.value = ""; // ✅ reset input عشان تقدر ترفع نفس الملف مرة ثانية
  //   }
  // };


  // <input
  // type="file"
  // ref={fileInputRef}
  // disabled={uploading}
  // accept="image/jpeg,image/png,image/webp"
  // onChange={handleChangeFile}
  // style={{display: "none"}}
  // />
  
  //       <Button
  //         size="xs"
  //         variant="surface"
  //         colorScheme="gray"
  //         borderRadius="lg"
  //         disabled={uploading}
  //                   p={1}
  //                   onClick={handleClick}
  //                 >
  //                   تغيير الصورة
  //                 </Button>