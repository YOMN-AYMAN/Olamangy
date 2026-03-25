"use client"
import {rtdb} from "@/auth/firebase";
import {CustomSelect} from "@/components/ui/Customselect";
import {uploadFileToB2} from "@/components/ui/UploadImg";
import {useAuth} from "@/providers/AuthContext";
import {useTeacher} from "@/providers/teacherProvider";
import {toaster, Toaster} from "@/components/ui/toaster";
import {
  Box, Input, VStack, SimpleGrid, Text, Button,
  Avatar, Flex, Icon, HStack, Textarea,
  NativeSelect
} from "@chakra-ui/react";
import {ref, set, update} from "firebase/database";
import {useEffect, useRef, useState} from "react";
import {MdEdit, MdCheckCircle} from "react-icons/md";
import {teacherSubjects, teachingStages, egyptData, countryCodes} from "@/components/Arr"









export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const {user} = useAuth()
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const {teacherProfile} = useTeacher()
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
  const [localTeacherData, setLocalTeacherData] = useState({
    stages: [],
    fullName: userData.fullName,
    email: userData.email,
    bio: userData.bio,
    jobTitle: userData.jobTitle,
    city: userData.city,
    subjectId: ""
  });
  ////////////////////////////////

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  useEffect(() => {
    if (teacherProfile) {
      setLocalTeacherData({
        stages: teacherProfile.stages || [],
        subjectId: teacherProfile.subjectId || ""
      });
    }
  }, [teacherProfile]);

  const filteredSubjects = (userStages) => {
    if (!userStages || !Array.isArray(userStages) || userStages.length === 0) return [];
    return teacherSubjects.filter(subject =>
      userStages.every(stage => subject.stage.includes(stage))
    );
  };
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
      toaster.create({
        title: "خطأ",
        description: "فقط صور JPG, PNG, WEBP مسموحة",
        type: "error",
      });
      return;
    }

    if (file.size > maxSize) {
      toaster.create({
        title: "خطأ",
        description: "حجم الصورة يجب أن يكون أقل من 5MB",
        type: "error",
      });
      return;
    }

    setUploading(true);

    try {
      // ✅ ضغط الصورة قبل الرفع
      const compressedFile = await compressImage(file, 300, 0.8);

      // إنشاء File جديد بالاسم
      const finalFile = new File([compressedFile], `${user?.uid}.webp`, {
        type: "image/webp",
      });

      const url = await uploadFileToB2(finalFile);

      await set(ref(rtdb, `users/${user?.uid}/avatar`), url);
      await set(ref(rtdb, `teachers/${user?.uid}/avatar`), url);

      setUserData(prev => ({...prev, avatar: url}));

      toaster.create({
        title: "تم",
        description: "تم تحديث الصورة الشخصية",
        type: "success",
      });

    } catch (err) {
      console.error(err);
      toaster.create({
        title: "فشل الرفع",
        description: err.message,
        type: "error",
      });
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
    try {
      // Update basic user info
      await update(ref(rtdb, `users/${user?.uid}`), userData);

      // Update teacher-specific info (stages and subjectId)
      // We use update to preserve other fields like status, createdAt, etc.
      const teacherUpdates = {
        stages: localTeacherData.stages,
        fullName: userData.fullName,
        email: userData.email,
        bio: userData.bio,
        jobTitle: userData.jobTitle,
        city: userData.city,
        subjectId: localTeacherData.subjectId
      };
      await update(ref(rtdb, `teachers/${user?.uid}`), teacherUpdates);

      toaster.create({
        title: "تم الحفظ",
        description: "تم تحديث بياناتك بنجاح",
        type: "success",
      });
    } catch (error) {
      console.error("Save error:", error);
      toaster.create({
        title: "خطأ",
        description: "فشل في حفظ البيانات، يرجى المحاولة مرة أخرى",
        type: "error",
      });
    }
  };


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
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المرحلة</Text>
              <Flex gap={2} flexWrap="wrap">
                {teachingStages.map((stage) => (
                  <Button
                    key={stage.value}
                    size="xs"
                    disabled={!isEditing}
                    variant={localTeacherData?.stages?.includes(stage.value) ? "solid" : "outline"}
                    colorScheme={localTeacherData?.stages?.includes(stage.value) ? "blue" : "gray"}
                    onClick={() => {
                      const currentStages = localTeacherData?.stages || [];
                      let newStages;
                      if (currentStages.includes(stage.value)) {
                        newStages = currentStages.filter(s => s !== stage.value);
                      } else {
                        newStages = [...currentStages, stage.value];
                      }
                      setLocalTeacherData(prev => ({...prev, stages: newStages}));
                    }}
                  >
                    {stage.label}
                  </Button>
                ))}
              </Flex>
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المادة الدراسية</Text>
              <NativeSelect.Root h={"55px"} w="100%" disabled={!isEditing || !localTeacherData?.stages?.length}>
                <NativeSelect.Field
                  h={"55px"} px={3}
                  value={localTeacherData?.subjectId || ""}
                  onChange={(e) => setLocalTeacherData(prev => ({...prev, subjectId: e.target.value}))}
                >
                  <option value="">{localTeacherData?.stages?.length ? "اختر المادة" : "اختر المراحل أولاً"}</option>
                  {filteredSubjects(localTeacherData?.stages).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>اللقب المهني (يظهر للطلاب)</Text>
              <Input
                {...inputStyle}
                name="jobTitle"
                value={userData?.jobTitle || ""}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="مثلاً: كبير معلمي الفيزياء"
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
      <Toaster />
    </>
  );
}