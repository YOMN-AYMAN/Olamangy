"use client"
import {rtdb} from "@/auth/firebase";
import {CustomSelect} from "@/components/ui/Customselect";
import {uploadFileToB2} from "@/components/ui/UploadImg";
import {useAuth} from "@/providers/AuthContext";
import {
  Box, Input, VStack, SimpleGrid, Text, Button,
  Avatar, Flex, Icon, HStack, Textarea,
  NativeSelect
} from "@chakra-ui/react";
import {ref, set} from "firebase/database";
import {useEffect, useRef, useState} from "react";
import {MdEdit, MdCheckCircle} from "react-icons/md";


const egyptData = {
  "القاهرة": [
    "القاهرة", "مدينة نصر", "مصر الجديدة", "الزمالك", "المعادي", "حلوان",
    "مدينة الشروق", "المرج", "عين شمس", "النزهة", "المطرية", "شبرا",
    "روض الفرج", "الأميرية", "السلام", "النزهة", "الوايلي", "الخليفة",
    "مصر القديمة", "طره", "المعصرة", "15 مايو", "القطامية", "التجمع الخامس",
    "الرحاب", "مدينة بدر", "العبور", "العاصمة الإدارية الجديدة"
  ],
  "الجيزة": [
    "الجيزة", "الدقي", "المهندسين", "6 أكتوبر", "الشيخ زايد", "الهرم",
    "فيصل", "بولاق الدكرور", "أوسيم", "كرداسة", "أبو النمرس", "البدرشين",
    "الصف", "أطفيح", "العياط", "حوض الوسطى", "منشأة القناطر", "الباويطي",
    "إمبابة", "العمرانية", "الحوامدية", "المنيب", "الطالبية"
  ],
  "الإسكندرية": [
    "الإسكندرية", "المنتزه", "العامرية", "برج العرب", "أبو قير", "المعمورة",
    "سيدي بشر", "العجمي", "العصافرة", "بكوس", "سيدي جابر", "الرمل",
    "محرم بك", "كرموز", "اللبان", "ورديان", "الدخيلة", "الميناء",
    "المنشية", "الشاطبي", "ستانلي", "مامورة", "ميامي", "سموحة"
  ],
  "الدقهلية": [
    "المنصورة", "طلخا", "ميت غمر", "دكرنس", "أجا", "منية النصر",
    "السنبلاوين", "بني عبيد", "ميت سلسيل", "الجمالية", "شربين",
    "المطرية", "تمي الأمديد", "نبروه", "منية المرشد", "بلقاس",
    "ميت ناما", "المنزلة", "الكردي", "الكرنك"
  ],
  "الشرقية": [
    "الزقازيق", "بلبيس", "العاشر من رمضان", "فاقوس", "أبو كبير",
    "ديرب نجم", "الحسينية", "ههيا", "أبو حماد", "منيا القمح",
    "صان الحجر", "كفر صقر", "الإبراهيمية", "الصالحية الجديدة",
    "القرين", "أولاد صقر", "مشتول السوق", "هيهيا"
  ],
  "القليوبية": [
    "بنها", "شبرا الخيمة", "القناطر الخيرية", "الخانكة", "قليوب",
    "طوخ", "كفر شكر", "تلبانة", "بنها الجديدة", "قها",
    "العبور", "خصوص", "سرس الليان", "منوف القليوبية"
  ],
  "كفر الشيخ": [
    "كفر الشيخ", "دسوق", "فوه", "مطوبس", "بيلا", "الحامول",
    "سيدي سالم", "الرياض", "الرمانة", "بلطيم", "سيدي غازي",
    "قلين", "برج البرلس", "مصيف بلطيم"
  ],
  "الغربية": [
    "طنطا", "المحلة الكبرى", "كفر الزيات", "زفتى", "السنطة",
    "قطور", "بسيون", "سمنود", "الزقازيق الغربية", "طنطا الجديدة",
    "المنشاة الكبرى", "باصون", "نبروه", "شبراخيت"
  ],
  "المنوفية": [
    "شبين الكوم", "منوف", "أشمون", "قويسنا", "تلا", "الباجور",
    "السادات", "بركة السبع", "الشهداء", "سرس الليان",
    "ميت حلفا", "الخطاطبة", "الشيخ مسكين", "منوف الجديدة"
  ],
  "البحيرة": [
    "دمنهور", "كفر الدوار", "رشيد", "إدكو", "أبو المطامير",
    "الدلنجات", "أبو حمص", "الرحمانية", "شبراخيت", "حوش عيسى",
    "كوم حمادة", "المحمودية", "وادي النطرون", "إيتاي البارود",
    "بدر", "بسيون البحيرة", "النوبارية"
  ],
  "الإسماعيلية": [
    "الإسماعيلية", "فايد", "القنطرة", "أبو صوير", "التل الكبير",
    "القنطرة غرب", "القنطرة شرق", "الكيلو 40", "الشيخ زايد الإسماعيلية"
  ],
  "السويس": [
    "السويس", "الأربعين", "عتاقة", "فيصل",
    "الجناين", "الصخنة", "القابوطي", "أدبية"
  ],
  "بورسعيد": [
    "بورسعيد", "بورفؤاد", "الضواحي", "الشرق", "العرب",
    "الزهور", "المناخ", "الجنوب", "الشمال", "مدينة بورسعيد الجديدة"
  ],
  "دمياط": [
    "دمياط", "رأس البر", "فارسكور", "الزرقا", "كفر سعد",
    "عزبة البرج", "ميت أبو غالب", "دمياط الجديدة", "الروضة",
    "كفر البطيخ", "السرو"
  ],
  "الفيوم": [
    "الفيوم", "طامية", "إطسا", "سنورس", "إبشواي",
    "يوسف الصديق", "الحادقة", "أبشواي", "تامية", "قارون",
    "مدينة الفيوم الجديدة"
  ],
  "بني سويف": [
    "بني سويف", "الفشن", "ناصر", "إهناسيا", "ببا", "سمسطا",
    "الواسطى", "بياض العرب", "البدري", "الفشن الجديدة",
    "مدينة بني سويف الجديدة"
  ],
  "المنيا": [
    "المنيا", "ملوي", "سمالوط", "مغاغة", "أبو قرقاص", "العدوة",
    "بني مزار", "المطاهرة", "دير مواس", "أبو الفداء",
    "مدينة المنيا الجديدة", "ماغرة", "منيا الجديدة"
  ],
  "أسيوط": [
    "أسيوط", "ديروط", "منفلوط", "القوصية", "أبنوب", "أبو تيج",
    "الغنايم", "البداري", "ساحل سليم", "صدفا",
    "مدينة أسيوط الجديدة", "الفتح"
  ],
  "سوهاج": [
    "سوهاج", "أخميم", "جرجا", "البلينا", "المراغة", "طما",
    "طهطا", "دار السلام", "ساقلته", "المنشأة",
    "مدينة سوهاج الجديدة", "جهينة"
  ],
  "قنا": [
    "قنا", "قوص", "نجع حمادي", "دشنا", "أبو تشت", "فرشوط",
    "الوقف", "قفط", "نقادة", "إسنا القنا",
    "مدينة قنا الجديدة"
  ],
  "أسوان": [
    "أسوان", "كوم أمبو", "إدفو", "دراو", "نصر النوبة",
    "أبو سمبل", "كلابشة", "البصيلية", "الدر", "الشلال",
    "مدينة أسوان الجديدة", "أرمنت أسوان"
  ],
  "الأقصر": [
    "الأقصر", "إسنا", "أرمنت", "الطود", "الزينية",
    "البياضية", "الحبيل", "القرنة", "الدير", "توت عنخ آمون"
  ],
  "البحر الأحمر": [
    "الغردقة", "سفاجا", "القصير", "مرسى علم", "رأس غارب",
    "شلاتين", "حلايب", "أبو رماد", "الداهر", "ضبعة"
  ],
  "الوادي الجديد": [
    "الخارجة", "الداخلة", "الفرافرة", "باريس", "بلاط",
    "موط", "القصر", "تنيدة", "بلاط الجديدة", "طنيدة"
  ],
  "مطروح": [
    "مرسى مطروح", "الحمام", "العلمين", "سيدي براني", "السلوم",
    "النجيلة", "الضبعة", "سيوة", "مارينا", "رأس الحكمة",
    "الساحل الشمالي", "العلمين الجديدة"
  ],
  "شمال سيناء": [
    "العريش", "رفح", "الشيخ زويد", "بئر العبد", "نخل",
    "الحسنة", "قسيمة", "أبو عجيلة", "المليز"
  ],
  "جنوب سيناء": [
    "شرم الشيخ", "دهب", "نويبع", "طابا", "سانت كاترين",
    "رأس سدر", "أبو زنيمة", "الطور", "أبو رديس", "وادي فيران",
    "رأس سدر الجديدة"
  ],
};

const countryCodes = [
  {code: "+20", country: "مصر", flag: "🇪🇬"},
  {code: "+966", country: "السعودية", flag: "🇸🇦"},
  {code: "+971", country: "الإمارات", flag: "🇦🇪"},
  {code: "+965", country: "الكويت", flag: "🇰🇼"},
  {code: "+974", country: "قطر", flag: "🇶🇦"},
  {code: "+973", country: "البحرين", flag: "🇧🇭"},
  {code: "+968", country: "عمان", flag: "🇴🇲"},
  {code: "+962", country: "الأردن", flag: "🇯🇴"},
  {code: "+961", country: "لبنان", flag: "🇱🇧"},
  {code: "+963", country: "سوريا", flag: "🇸🇾"},
  {code: "+964", country: "العراق", flag: "🇮🇶"},
  {code: "+967", country: "اليمن", flag: "🇾🇪"},
  {code: "+218", country: "ليبيا", flag: "🇱🇾"},
  {code: "+216", country: "تونس", flag: "🇹🇳"},
  {code: "+213", country: "الجزائر", flag: "🇩🇿"},
  {code: "+212", country: "المغرب", flag: "🇲🇦"},
  {code: "+249", country: "السودان", flag: "🇸🇩"},
]








export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const {user} = useAuth()
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "",
    phone: "",
    email: "",
    governorate: "",
    city: "",
    specialization: "",
    levels: "",
    grades: "",
    jobTitle: "",
    bio: ""
  });
  ////////////////////////////////

  useEffect(() => {
    setUserData(user)
  }, [user])

  /////////////////////////////

  const compressImage = (file, maxWidth = 512, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (event) => {
        img.src = event.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // تحويل إلى WebP مضغوط
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            resolve(blob);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = (error) => reject(error);
    });
  };
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleChangeFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("فقط صور JPG, PNG, WEBP مسموحة");
      return;
    }

    if (file.size > maxSize) {
      alert("حجم الصورة يجب أن يكون أقل من 5MB");
      return;
    }

    setUploading(true);

    try {
      // ✅ ضغط الصورة قبل الرفع
      const compressedFile = await compressImage(file, 300, 0.8);

      // إنشاء File جديد بالاسم
      const finalFile = new File([compressedFile], "avatar.webp", {
        type: "image/webp",
      });

      const url = await uploadFileToB2(finalFile);

      await set(ref(rtdb, `users/${user?.uid}/avatar`), url);

      setUserData(prev => ({...prev, avatar: url}));

    } catch (err) {
      console.error(err);
      alert("فشل رفع الملف: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  //////////////////////////////

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData(prev => ({...prev, [name]: value}));
  };
  const handleSave = async () => {
    setIsEditing(false);
    await set(ref(rtdb, `users/${user?.uid}`), userData);
  };

  /////////////////////////////

  const inputStyle = {
    borderRadius: "xl",
    h: "55px",
    p: 4,
    transition: "all 0.3s ease",
    border: "1px solid",
    borderColor: isEditing ? "blue.400" : "border.subtle",
    bg: isEditing ? "bg.panel" : "bg.subtle",
    _focus: {
      borderColor: "blue.500",
      boxShadow: "0 0 0 1px #3182ce"
    }
  };


  return (
    <>
      <Box p={{base: 4, md: 8}} dir="rtl" maxW="1100px" mx="auto">
        <Box bg="bg.panel" p={{base: 6, md: 10}} borderRadius="3xl" border="1px solid" borderColor="border.subtle" shadow="sm">
          {/* Header */}

          <Flex direction={{base: "column", md: "row"}} justify="space-between" align={{base: "start", md: "center"}} mb={10} gap={6}>
            <HStack gap={6}>
              <Avatar.Root size="2xl" shape="rounded">
                <Avatar.Image src={userData?.avatar} />
              </Avatar.Root>
              <VStack align="flex-start" gap={1}>
                <input
                  type="file"
                  ref={fileInputRef}
                  disabled={uploading}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleChangeFile}
                  style={{display: "none"}}
                />

                <Button
                  size="xs"
                  variant="surface"
                  colorScheme="gray"
                  borderRadius="lg"
                  disabled={uploading}
                  p={1}
                  onClick={handleClick}
                >
                  تغيير الصورة
                </Button>
              </VStack>
            </HStack>

            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              variant="outline"
              size="sm"
              colorPalette={isEditing ? "green" : "blue"}
              borderRadius="full"
              px={6}
              borderWidth="2px"
            >
              <HStack gap={2}>
                <Text fontWeight="bold">{isEditing ? "حفظ البيانات" : "تعديل الحساب"}</Text>
                <Icon fontSize="lg">
                  {isEditing ? <MdCheckCircle /> : <MdEdit />}
                </Icon>
              </HStack>
            </Button>
          </Flex>

          <SimpleGrid columns={{base: 1, md: 2}} gapX={10} gapY={6}>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>الاسم الرباعي</Text>
              <Input
                {...inputStyle}
                name="fullName"
                value={userData?.fullName || ""}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="أدخل اسمك الرباعي"
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>رقم الهاتف</Text>
              <Box display={"flex"} w={"100%"} justifyContent={"center"} alignItems={"center"} gap={2}>
                <NativeSelect.Root
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px #3182ce"
                  }} w={"20%"} h={"55px"} display={"flex"} alignItems={"center"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing}>
                  <NativeSelect.Field border="none" h={"55px"} px={3}
                    value={userData?.countryCode || ""}
                    onChange={(e) => setUserData({...userData, countryCode: e.target.value})}
                  >
                    <option value="">الكود </option>
                    {countryCodes.map((c, o) => (
                      <option key={o} value={c.code}>
                        {c.flag} {c.country}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <Input
                  {...inputStyle}
                  name="phone"
                  type="number"
                  maxLength={10}
                  value={userData?.phone || ""}
                  disabled={!isEditing}
                  onChange={handleChange}
                />

              </Box>

            </VStack>

            <VStack align="flex-start" gap={1.5} gridColumn={{base: "auto", md: "span 2"}}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>البريد الإلكتروني (أساسي)</Text>
              <Input
                value={userData?.email || ""}
                disabled
                borderRadius="xl" border="1px solid" borderColor="red.400" bg="bg.muted" h="55px" p={4} opacity={0.8}
                cursor="not-allowed"
              />

            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المحافظة</Text>
              <NativeSelect.Root _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182ce"
              }} h={"55px"} display={"flex"} alignItems={"center"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing}>
                <NativeSelect.Field border="none" h={"55px"} px={3}
                  value={userData?.governorate || ""}
                  onChange={(e) => setUserData({...userData, governorate: e.target.value})}
                >
                  <option value="">اختر المحافظة</option>
                  {Object.keys(egyptData).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المدينة</Text>
              <NativeSelect.Root _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182ce"
              }} h={"55px"} display={"flex"} alignItems={"center"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing}>
                <NativeSelect.Field border="none" h={"55px"} px={3}
                  value={userData?.city || ""}
                  onChange={(e) => setUserData({...userData, city: e.target.value})}
                >
                  <option value="">اختر المحافظة</option>
                  {egyptData?.[userData?.governorate || ""]?.map((c) => (
                    <option style={{padding: 20}} key={c} value={c}>{c}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>

            <Text
              gridColumn={{base: "auto", md: "span 2"}}
              fontWeight="bold" color="blue.500" fontSize="md"
              borderBottom="1px dashed" borderColor="border.subtle" mt={6} pb={2}
            >
              البيانات المهنية
            </Text>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المادة الدراسية</Text>
              <Input
                {...inputStyle}
                name="specialization"
                value={userData?.specialization || ""}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>اللقب المهني</Text>
              <Input
                {...inputStyle}
                name="jobTitle"
                value={userData?.jobTitle || ""}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المرحلة</Text>
              <Input
                {...inputStyle}
                name="city"
                value={userData?.levels || ""}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المستويات</Text>
              <Input
                {...inputStyle}
                name="city"
                value={userData?.grades || ""}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5} gridColumn={{base: "auto", md: "span 2"}}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>النبذة التعريفية</Text>
              <Textarea
                {...inputStyle}
                h="auto"
                name="bio"
                value={userData?.bio || ""}
                disabled={!isEditing}
                onChange={handleChange}
                rows={4}
              />
            </VStack>

          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}