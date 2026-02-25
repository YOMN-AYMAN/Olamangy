"use client";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  VStack,
  Textarea,
  HStack,
  Icon,
  NativeSelect
} from '@chakra-ui/react'
import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {rtdb} from "@/auth/firebase"
import {ref, push, set, update} from "firebase/database"
import {useTeacher} from "@/providers/teacherProvider"
import {useAuth} from "@/providers/AuthContext"
import {toaster} from "@/components/ui/toaster"
import {CustomSelect} from "@/components/ui/Customselect"
import {MdOutlineVideoLibrary, MdTitle, MdDescription, MdLink, MdSchool, MdClass} from "react-icons/md"


// Academic years based on stage
const academicYears = {
  primary: [
    {value: "1", label: "الصف الأول الابتدائي"},
    {value: "2", label: "الصف الثاني الابتدائي"},
    {value: "3", label: "الصف الثالث الابتدائي"},
    {value: "4", label: "الصف الرابع الابتدائي"},
    {value: "5", label: "الصف الخامس الابتدائي"},
    {value: "6", label: "الصف السادس الابتدائي"},
  ],
  preparatory: [
    {value: "1", label: "الصف الأول الإعدادي"},
    {value: "2", label: "الصف الثاني الإعدادي"},
    {value: "3", label: "الصف الثالث الإعدادي"},
  ],
  secondary: [
    {value: "1", label: "الصف الأول الثانوي"},
    {value: "2", label: "الصف الثاني الثانوي"},
    {value: "3", label: "الصف الثالث الثانوي"},
  ]
}

const semesters = [
  {value: "1", label: "الترم الأول"},
  {value: "2", label: "الترم الثاني"},
]

export default function UploadVideo() {
  const router = useRouter()
  const {user} = useAuth()
  const [loading, setLoading] = useState(false)
  const {teacherProfile} = useTeacher()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "", // Added videoUrl
    academicStage: "",
    academicYear: "",
    semester: "1",
  })
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Reset academic year if stage changes
    if (field === "academicStage") {
      setFormData(prev => ({
        ...prev,
        academicStage: value,
        academicYear: ""
      }))
    }
  }
  const handleSave = async () => {

    if (!user) {
      toaster.create({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        type: "error",
      })
      return
    }

    const {title, academicStage, academicYear, videoUrl} = formData
    if (!title || !academicStage || !academicYear || !videoUrl) {
      const missing = []
      if (!title) missing.push("العنوان")
      if (!videoUrl) missing.push("رابط الفيديو")
      if (!academicStage) missing.push("المرحلة")
      if (!academicYear) missing.push("السنة الدراسية")

      toaster.create({
        title: "حقول ناقصة",
        description: `يرجى إكمال: ${missing.join("، ")}`,
        type: "error",
      })
      return
    }
    console.log("Handle Save clicked", formData)

    setLoading(true)
    try {
      const lessonsRef = ref(rtdb, `teachers/${user.uid}/lessons/${formData.academicStage.slice(0, 3) + formData.academicYear + formData.semester}`)
      const newLessonRef = push(lessonsRef)
      const lessonId = newLessonRef.key
      const arrLessonsRef = ref(rtdb, `teachers/${user.uid}/arrLessons`)

      const lessonData = {
        id: lessonId,
        createdBy: user.uid,
        teacherName: user.fullName || user.name || "معلم",
        subjectId: "oo",
        ...formData,
        createdAt: new Date().toISOString(),
        views: 0,
        status: "active"
      }
      const obj = {[lessonId]: formData.academicStage.slice(0, 3) + formData.academicYear + formData.semester}
      await set(newLessonRef, lessonData)
      await update(arrLessonsRef, obj)

      toaster.create({
        title: "تم الحفظ",
        description: "تم رفع الدرس بنجاح، جاري التحويل...",
        type: "success",
      })

      // Redirect to the detail page
      setTimeout(() => {
        router.push(`/Teacher/videos/${lessonId}`)
      }, 500)
    } catch (error) {
      console.error("Error saving lesson:", error)
      toaster.create({
        title: "خطأ",
        description: "فشل في حفظ الدرس في قاعدة البيانات",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Academic stages
  const academicStages = [
    {value: "primary", label: "الابتدائية"},
    {value: "preparatory", label: "الإعدادية"},
    {value: "secondary", label: "الثانوية"},
  ].filter((stage) => teacherProfile?.stages?.includes(stage.value))

  console.log(academicStages);

  const availableYears = formData.academicStage ? academicYears[formData.academicStage] || [] : []

  return (
    <Box
      width="100%"
      mx="auto"
      p={6}
      bg="bg.panel"
      borderRadius="2xl"
      shadow="xl"
      dir="rtl"
    >
      <VStack gap={6} align="stretch">
        <HStack gap={3} borderBottom="1px solid" borderColor="border.subtle" pb={4}>
          <Icon as={MdOutlineVideoLibrary} boxSize={6} color="blue.500" />
          <Text fontSize="xl" fontWeight="bold">تفاصيل الدرس الجديد</Text>
        </HStack>

        <Stack gap={4}>
          <Box>
            <HStack mb={2} gap={2}>
              <Icon as={MdTitle} color="gray.500" />
              <Text fontSize="sm" fontWeight="semibold">عنوان الدرس *</Text>
            </HStack>
            <Input
              placeholder="مثال: مقدمة في علم الأحياء"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              borderRadius="xl"
              bg="bg.muted"
              _focus={{borderColor: "blue.400", bg: "bg.panel"}}
            />
          </Box>

          <Box>
            <HStack mb={2} gap={2}>
              <Icon as={MdDescription} color="gray.500" />
              <Text fontSize="sm" fontWeight="semibold">وصف الدرس</Text>
            </HStack>
            <Textarea
              placeholder="اكتب وصفاً مختصراً لمحتوى الفيديو..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              borderRadius="xl"
              bg="bg.muted"
              rows={3}
            />
          </Box>

          <Box>
            <HStack mb={2} gap={2}>
              <Icon as={MdLink} color="gray.500" />
              <Text fontSize="sm" fontWeight="semibold">رابط الفيديو (YouTube) *</Text>
            </HStack>
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.videoUrl}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              borderRadius="xl"
              bg="bg.muted"
              _focus={{borderColor: "blue.400", bg: "bg.panel"}}
            />
          </Box>
          <HStack gap={4} width="100%">
            <Box flex={1}>
              <HStack mb={2} gap={2}>
                <Icon as={MdSchool} color="gray.500" />
                <Text fontSize="sm" textOverflow={"ellipsis"} whiteSpace={"nowrap"} fontWeight="semibold">المرحلة الدراسية *</Text>
              </HStack>
              <NativeSelect.Root
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce"
                }}
                display={"flex"}
                alignItems={"center"} bg={"bg.panel"}
                border={"1px solid"}
                borderColor={"blue.400"}
                borderRadius="lg" >
                <NativeSelect.Field border="none" px={3}
                  name="academicStage"
                  value={formData?.academicStage ?? ""}
                  onChange={(e) => handleChange("academicStage", e.target.value)}
                >
                  <option value="">اختر المرحلة</option>
                  {academicStages?.map((c, indx) => (
                    <option style={{padding: 20}} key={indx} value={c.value}>{c.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>
            <Box flex={1}>
              <HStack mb={2} gap={2}>
                <Icon as={MdClass} color="gray.500" />
                <Text fontSize="sm" fontWeight="semibold">السنة الدراسية *</Text>
              </HStack>
              <NativeSelect.Root
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce"
                }}
                display={"flex"}
                alignItems={"center"} bg={"bg.panel"}
                border={"1px solid"}
                borderColor={"blue.400"}
                borderRadius="lg" >
                <NativeSelect.Field border="none" px={3}
                  name="academicYear"
                  value={formData?.academicYear || ""}
                  onChange={(e) => handleChange("academicYear", e.target.value)}
                >
                  <option value="">اختر السنة</option>
                  {availableYears?.map((c, indx) => (
                    <option style={{padding: 20}} key={indx} value={c.value}>{c.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>
          </HStack>

          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>الفصل الدراسي</Text>
            <NativeSelect.Root
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182ce"
              }}
              display={"flex"}
              alignItems={"center"} bg={"bg.panel"}
              border={"1px solid"}
              borderColor={"blue.400"}
              borderRadius="lg" >
              <NativeSelect.Field border="none" px={3}
                name="semester"
                value={formData?.semester ?? ""}
                onChange={(e) => handleChange("semester", e.target.value)}
              >
                <option value="">اختر الترم</option>
                {semesters?.map((c, indx) => (
                  <option style={{padding: 20}} key={indx} value={c.value}>{c.label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
        </Stack>

        <Button
          colorScheme="blue"
          size="lg"
          width="100%"
          borderRadius="xl"
          mt={4}
          bg="blue.500"
          color="white"
          _hover={{bg: "blue.600", transform: "translateY(-2px)"}}
          _active={{transform: "translateY(0)"}}
          onClick={handleSave}
          loading={loading}
          shadow="md"
        >
          حفظ ونشر الدرس
        </Button>
      </VStack>
    </Box>
  )
}