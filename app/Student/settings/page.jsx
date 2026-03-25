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
import { color } from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {MdEdit, MdCheckCircle} from "react-icons/md";
import {egyptData, countryCodes, academicStages,  departments, languages, years} from "@/components/Arr"

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
    academicStage: "",
    academicYear: "",
    emailVerified: "",
    department:"",
    secondLanguage:"",
  });
  ////////////////////////////////

  useEffect(() => {
    setUserData(user)
    if (user) {
      const normStage = normalizeStage(user.academicStage || user?.academicStage || "")
      const normYear = normalizeYear(user.academicYear || "")
      const normDept = normalizeDepartment(user.department || user?.department || "")
      setAcademicStage(normStage)
      setAcademicYear(normYear)
      setDepartment(normDept)
      setSecondLanguage(user.secondLanguage || "")
    }
  }, [user])

  // compute verification flag since it might come as string or boolean
  const isVerified =
    userData?.emailVerified === true || userData?.emailVerified === "true";

  /////////////////////////////
  // student-related state (move before derived values)
  const [academicStage, setAcademicStage] = useState("")
  const [academicYear, setAcademicYear] = useState("")
  const [department, setDepartment] = useState("")
  const [secondLanguage, setSecondLanguage] = useState("")

  // normalize values coming from DB so they match our option `value`s
  const normalizeStage = (input) => {
    if (!input) return "";
    const s = String(input).toLowerCase();
    if (s.includes("primary") || s.includes("ابتد")) return "primary";
    if (s.includes("prepar") || s.includes("إعد")) return "preparatory";
    if (s.includes("second") || s.includes("ثان")) return "secondary";
    if (s.includes("الابتدائية")) return "primary";
    if (s.includes("الاعدادية") || s.includes("الإعدادية")) return "preparatory";
    if (s.includes("الثانوية")) return "secondary";
    return input;
  };

  const normalizeDepartment = (input) => {
    if (!input) return "";
    const s = String(input).toLowerCase();
    if (s.includes("math") || s.includes("mathm") || s.includes("علمي رياضة")) return "mathematics";
    if (s.includes("sci") || s.includes("science") || s.includes( "علمي علوم")) return "science";
    if (s.includes("lit") || s.includes("ad") || s.includes("أدب") || s.includes("أدبي") || s.includes("ادبي")) return "literary";
    if (departments.find(d => d.value === input)) return input;
    const byLabel = departments.find(d => d.label === input);
    if (byLabel) return byLabel.value;
    return input;
  };

  const normalizeYear = (input) => {
    if (!input) return "";
    const s = String(input).trim();
    const arabicDigits = { '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
    const converted = s.replace(/[٠-٩]/g, d => arabicDigits[d] || d);
    if (/^[1-6]$/.test(converted)) return converted;
    if (s.includes("الأول") || s.includes("الاول") || s.includes("الأولى") || s.includes("الأولي")) return '1';
    if (s.includes("الثاني") || s.includes("الثانية") || s.includes("الثانى")) return '2';
    if (s.includes("الثالث") || s.includes("الثالثة")) return '3';
    if (s.includes("الرابع") || s.includes("الرابعة")) return '4';
    if (s.includes("الخامس") || s.includes("الخامسة")) return '5';
    if (s.includes("السادس") || s.includes("السادسة")) return '6';
    const found = converted.match(/\d/);
    if (found) return found[0];
    return input;
  };

  const handleStageChange = (value) => {
    setAcademicStage(value);
    setAcademicYear("");
    setDepartment("");
    setSecondLanguage("");
    setUserData(prev => ({
      ...prev,
      academicStage: value,
      academicYear: "",
      department: "",
      secondLanguage: ""
    }));
  };

  const isSecondary = academicStage === "secondary";
  const availableYears = academicStage ? years[academicStage] || [] : [];
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
      const finalFile = new File([compressedFile],  `${user?.uid}.webp`, {
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


  const inputStyle = {
    borderRadius: "xl",
    h: "55px",
    p: 4,
    transition: "all 0.3s ease",
    color: "fg",
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
                  }} w={"20%"} h={"55px"} display={"flex"} alignItems={"center"} color={"fg"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing}>
                  <NativeSelect.Field border="none" h={"55px"} px={1}
                    value={userData?.code || ""}
                    onChange={(e) => setUserData({...userData, code: e.target.value})}
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
                disabled={true}  
                color={"fg.muted"}              
                borderRadius="xl" border="1px solid" borderColor={isEditing ? "red.400" : "border.subtle"} bg={isEditing ? "bg.muted" : "bg.subtle"} h="55px" p={4} opacity={isEditing ? 0.8 : 1}
                cursor="not-allowed"
              />

            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المحافظة</Text>
              <NativeSelect.Root _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182ce"
              }} h={"55px"} display={"flex"} alignItems={"center"} color={"fg"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing}>
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
              }} h={"55px"} display={"flex"} alignItems={"center"} color={"fg"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing}>
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
              البيانات الدراسية
            </Text>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المرحلة الدراسية</Text>
              <NativeSelect.Root _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182ce"
              }} h={"55px"} display={"flex"} alignItems={"center"} color={"fg"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing}>
                <NativeSelect.Field border="none" h={"55px"} px={3}
                  value={academicStage}
                  onChange={(e) => handleStageChange(e.target.value)}
                >
                  
                  <option value="">اختر المرحلة</option>
                  {academicStages.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>


            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}> الصف الدراسي</Text>
              <NativeSelect.Root _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182ce"
              }} h={"55px"} display={"flex"} alignItems={"center"} color={"fg"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing}>
                <NativeSelect.Field border="none" h={"55px"} px={3}
                  value={academicYear || userData?.academicYear || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAcademicYear(v);
                    setUserData(prev => ({...prev, academicYear: v}));
                  }}
                >
                  <option value="">اختر الصف الدراسي</option>
                  {availableYears.map((y) => (
                    <option key={y.value} value={y.value}>{y.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>

            {/* STUDENT FIELDS (native selects for consistent UI) */}
            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>القسم الدراسي</Text>
              <NativeSelect.Root _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182ce"
              }} h={"55px"} display={"flex"} alignItems={"center"} color={"fg"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing || !isSecondary}>
                <NativeSelect.Field border="none" h={"55px"} px={3}
                  value={department || userData?.department || ""}
                  onChange={(e) => {
                    setDepartment(e.target.value)
                    setUserData(prev => ({...prev, department: e.target.value}))
                  }}
                
                >
                  <option value="">{isSecondary ? "اختر القسم الدراسي" : "متاح للمرحلة الثانوية فقط"}</option>
                  {departments.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>اللغة الثانية</Text>
              <NativeSelect.Root _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182ce"
              }} h={"55px"} display={"flex"} alignItems={"center"} color={"fg"} bg={isEditing ? "bg.panel" : "bg.subtle"} border={"1px solid"} borderColor={isEditing ? "blue.400" : "border.subtle"} borderRadius="lg" disabled={!isEditing || !isSecondary}>
                <NativeSelect.Field border="none" h={"55px"} px={3}
                  value={secondLanguage || userData?.secondLanguage || ""}
                  onChange={(e) => {
                    setSecondLanguage(e.target.value)
                    setUserData(prev => ({...prev, secondLanguage: e.target.value}))
                  }}
                >
                  <option value="">{isSecondary ? "اختر اللغة الثانية" : "متاح للمرحلة الثانوية فقط"}</option>
                  {languages.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}> حالة الحساب</Text>
              {/* display active/inactive text based on verification boolean */}
              <Text
                fontSize="md"
                fontWeight="bold"
                color={isVerified ? "green.500" : "red.500"}
              >
                {isVerified ? "مفعل" : "غير مفعل"}
              </Text>
            </VStack>

          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}