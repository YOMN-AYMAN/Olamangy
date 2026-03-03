"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { rtdb } from "@/auth/firebase"
import { ref, update } from "firebase/database"
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { toaster, Toaster } from "@/components/ui/toaster"
import { MdArrowBack, MdUpload, MdInfoOutline, MdCheckCircle, MdCancel } from "react-icons/md"
import Navbar from "@/components/ui/Navbar"
import { CustomSelect } from "@/components/ui/Customselect"
import { uploadFileToB2 } from "@/components/ui/UploadImg" // 👈 adjust path as needed

// Academic stages
const academicStages = [
  { value: "primary", label: "الابتدائية" },
  { value: "preparatory", label: "الإعدادية" },
  { value: "secondary", label: "الثانوية" },
]

// Academic years
const academicYears = {
  primary: [
    { value: "1", label: "الصف الأول الابتدائي" },
    { value: "2", label: "الصف الثاني الابتدائي" },
    { value: "3", label: "الصف الثالث الابتدائي" },
    { value: "4", label: "الصف الرابع الابتدائي" },
    { value: "5", label: "الصف الخامس الابتدائي" },
    { value: "6", label: "الصف السادس الابتدائي" },
  ],
  preparatory: [
    { value: "1", label: "الصف الأول الإعدادي" },
    { value: "2", label: "الصف الثاني الإعدادي" },
    { value: "3", label: "الصف الثالث الإعدادي" },
  ],
  secondary: [
    { value: "1", label: "الصف الأول الثانوي" },
    { value: "2", label: "الصف الثاني الثانوي" },
    { value: "3", label: "الصف الثالث الثانوي" },
  ]
}

// Departments - only for secondary
const departments = [
  { value: "science", label: "علمي علوم" },
  { value: "mathematics", label: "علمي رياضة" },
  { value: "literary", label: "أدبي" }
]

// Languages - only for secondary
const languages = [
  { value: "french", label: "الفرنسية" },
  { value: "german", label: "الألمانية" },
  { value: "italian", label: "الإيطالية" },
  { value: "spanish", label: "الإسبانية" },
  { value: "english", label: "الإنجليزية" },
]

// Education type options
const educationTypes = [
  { value: "public", label: "تعليم حكومي" },
  { value: "private", label: "تعليم خاص" },
  { value: "azhar", label: "الأزهر الشريف" },
  { value: "institutes", label: "معاهد" },
]

// Teacher subjects
const teacherSubjects = [
  { value: "arabic", label: "اللغة العربية" },
  { value: "english", label: "اللغة الإنجليزية" },
  { value: "math", label: "الرياضيات" },
  { value: "physics", label: "الفيزياء" },
  { value: "chemistry", label: "الكيمياء" },
  { value: "biology", label: "الأحياء" },
  { value: "geography", label: "الجغرافيا" },
  { value: "history", label: "التاريخ" },
  { value: "philosophy", label: "الفلسفة" },
  { value: "psychology", label: "علم النفس" },
  { value: "economics", label: "الاقتصاد" },
  { value: "french", label: "اللغة الفرنسية" },
  { value: "german", label: "اللغة الألمانية" },
  { value: "italian", label: "اللغة الإيطالية" },
  { value: "spanish", label: "اللغة الإسبانية" },
  { value: "science", label: "العلوم" },
  { value: "social", label: "الدراسات الاجتماعية" },
  { value: "religion", label: "التربية الدينية" },
  { value: "art", label: "التربية الفنية" },
  { value: "music", label: "التربية الموسيقية" },
  { value: "sports", label: "التربية البدنية" },
  { value: "technology", label: "التكنولوجيا" },
  { value: "computers", label: "الحاسب الآلي" },
]

const teachingStages = [
  { value: "primary", label: "الابتدائي" },
  { value: "preparatory", label: "الإعدادي" },
  { value: "secondary", label: "الثانوي" },
]


function ImageGuideModal({ onClose }) {
  return (
    <>
      {/* Modal */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        rounded="2xl"
        shadow="2xl"
        w="92%"
        maxW="520px"
        maxH="88vh"
        zIndex={1000}
        border="1px solid"
        borderColor="gray.200"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      >
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          px={6}
          py={4}
          borderBottom="1px solid"
          borderColor="gray.100"
          flexShrink={0}
          _dark={{ borderColor: "gray.700" }}
        >
          <Text fontWeight="bold" fontSize="md" color="#000" _dark={{ color: "white" }}>
            إرشادات صورة الملف الشخصي
          </Text>
          <Box
            as="button"
            w="28px"
            h="28px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            rounded="full"
            bg="gray.100"
            color="gray.500"
            fontSize="lg"
            fontWeight="bold"
            cursor="pointer"
            _hover={{ bg: "gray.200", color: "gray.700" }}
            onClick={onClose}
            _dark={{
              bg: "gray.700",
              color: "gray.300",
              _hover: { bg: "gray.600", color: "white" },
            }}
          >
            ×
          </Box>
        </Flex>

        {/* Content */}
        <Box px={6} py={5} overflowY="auto" flex="1" dir="rtl">

          {/* Intro text */}
          <Text fontSize="sm" color="gray.600" mb={5} lineHeight="1.8" _dark={{ color: "gray.400" }}>
            يجب أن تكون صورتك الشخصية صورة رسمية واضحة تعكس هويتك المهنية كمدرس. اطّلع على الأمثلة أدناه لمعرفة الفرق بين الصورة المقبولة وغير المقبولة.
          </Text>

          {/* Examples side by side */}
          <Flex gap={4} mb={5} direction={{ base: "column", sm: "row" }}>

            {/* CORRECT - Formal */}
            <Box flex={1}>
              <Box
                position="relative"
                rounded="xl"
                overflow="hidden"
                border="2px solid"
                borderColor="green.400"
                shadow="md"
              >
                <Image
                  src="/formal.jpg"
                  alt="صورة رسمية مقبولة"
                  w="100%"
                  h="180px"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  bg="green.500"
                  color="white"
                  rounded="full"
                  p={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MdCheckCircle size={20} />
                </Box>
              </Box>
              <Flex
                align="center"
                justify="center"
                gap={1}
                mt={2}
                bg="green.50"
                rounded="lg"
                py={2}
                border="1px solid"
                borderColor="green.200"
                _dark={{ bg: "green.900", borderColor: "green.700" }}
              >
                <MdCheckCircle color="#38A169" size={16} />
                <Text fontSize="sm" fontWeight="bold" color="green.600" _dark={{ color: "green.300" }}>
                  صورة مقبولة
                </Text>
              </Flex>
              <VStack align="stretch" spacing={1} mt={2}>
                {[
                  "صورة واضحة للوجه",
                  "خلفية محايدة أو بسيطة",
                  "مظهر رسمي ومحترم",
                  "إضاءة جيدة",
                ].map((tip) => (
                  <Flex key={tip} align="center" gap={1}>
                    <Box color="green.500" flexShrink={0}>
                      <MdCheckCircle size={13} />
                    </Box>
                    <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
                      {tip}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>

            {/* INCORRECT - Informal */}
            <Box flex={1}>
              <Box
                position="relative"
                rounded="xl"
                overflow="hidden"
                border="2px solid"
                borderColor="red.400"
                shadow="md"
              >
                <Image
                  src="/informal2.jpg"
                  alt="صورة غير رسمية مرفوضة"
                  w="100%"
                  h="180px"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  bg="red.500"
                  color="white"
                  rounded="full"
                  p={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MdCancel size={20} />
                </Box>
              </Box>
              <Flex
                align="center"
                justify="center"
                gap={1}
                mt={2}
                bg="red.50"
                rounded="lg"
                py={2}
                border="1px solid"
                borderColor="red.200"
                _dark={{ bg: "red.900", borderColor: "red.700" }}
              >
                <MdCancel color="#E53E3E" size={16} />
                <Text fontSize="sm" fontWeight="bold" color="red.600" _dark={{ color: "red.300" }}>
                  صورة مرفوضة
                </Text>
              </Flex>
              <VStack align="stretch" spacing={1} mt={2}>
                {[
                  "صورة سيلفي أو غير رسمية",
                  "خلفية مزدحمة أو ملهية",
                  "مظهر غير مناسب",
                  "صورة مجموعة أو منقوصة",
                ].map((tip) => (
                  <Flex key={tip} align="center" gap={1}>
                    <Box color="red.500" flexShrink={0}>
                      <MdCancel size={13} />
                    </Box>
                    <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
                      {tip}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>

          </Flex>

          {/* Bottom note */}
          <Box
            bg="blue.50"
            border="1px solid"
            borderColor="blue.200"
            rounded="lg"
            px={4}
            py={3}
            _dark={{ bg: "blue.900", borderColor: "blue.700" }}
          >
            <Text fontSize="xs" color="blue.700" lineHeight="1.8" _dark={{ color: "blue.300" }}>
              💡 ملاحظة: سيتم مراجعة صورتك من قِبل فريق Dolphin Models. الصور غير الرسمية أو غير اللائقة ستؤدي إلى رفض طلب التسجيل أو طلب استبدال الصورة.
            </Text>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          px={6}
          pb={5}
          pt={4}
          borderTop="1px solid"
          borderColor="gray.100"
          flexShrink={0}
          _dark={{ borderColor: "gray.700" }}
        >
          <Button
            w="100%"
            bg="#009EDB"
            color="white"
            rounded="xl"
            fontWeight="bold"
            _hover={{ bg: "#0085bb" }}
            onClick={onClose}
          >
            فهمت
          </Button>
        </Box>
      </Box>

      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={999}
        onClick={onClose}
      />
    </>
  )
}

// ─────────────────────────────────────────────
// MAIN SIGNUP2 PAGE
// ─────────────────────────────────────────────
export default function Signup2() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [userType, setUserType] = useState("student")
  const [loading, setLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [signupData, setSignupData] = useState(null)
  const [isGoogleUser, setIsGoogleUser] = useState(false)
  const [showImageGuide, setShowImageGuide] = useState(false)

  // Student fields
  const [academicStage, setAcademicStage] = useState("")
  const [academicYear, setAcademicYear] = useState("")
  const [department, setDepartment] = useState("")
  const [secondLanguage, setSecondLanguage] = useState("")
  const [educationType, setEducationType] = useState("")

  // Teacher fields
  const [explanationSubject, setExplanationSubject] = useState("")
  const [teacherStages, setTeacherStages] = useState([])
  const [teacherLanguage, setTeacherLanguage] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState(null) // 👈 now stores B2 URL
  const [profileImagePreview, setProfileImagePreview] = useState(null) // 👈 local preview
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const isSecondary = academicStage === "secondary"
  const availableYears = academicStage ? academicYears[academicStage] || [] : []

  useEffect(() => {
    const stored = sessionStorage.getItem('signupData')
    if (!stored) {
      router.push("/Onboarding/signup1")
      return
    }
    const parsed = JSON.parse(stored)
    setSignupData(parsed)
    if (parsed.isGoogleAuth || parsed.authMethod === 'google') {
      setIsGoogleUser(true)
    }
  }, [router])

  const handleStageChange = (value) => {
    setAcademicStage(value)
    setAcademicYear("")
    setDepartment("")
    setSecondLanguage("")
    setEducationType("")
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      toaster.create({
        title: "خطأ",
        description: "فقط صور JPG, PNG, WEBP مسموحة",
        type: "error",
        duration: 3000,
      })
      return
    }

    if (file.size > maxSize) {
      toaster.create({
        title: "خطأ",
        description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
        type: "error",
        duration: 3000,
      })
      return
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file)
    setProfileImagePreview(localPreview)

    setUploading(true)
    setUploadProgress(0)

    try {
      const url = await uploadFileToB2(file, (percent) => {
        setUploadProgress(percent)
      })
      setProfileImageUrl(url)
      toaster.create({
        title: "تم",
        description: "تم رفع الصورة بنجاح",
        type: "success",
        duration: 2000,
      })
    } catch (error) {
      console.error(error)
      setProfileImagePreview(null)
      setProfileImageUrl(null)
      toaster.create({
        title: "خطأ",
        description: "فشل في رفع الصورة: " + error.message,
        type: "error",
        duration: 3000,
      })
    } finally {
      setUploading(false)
      e.target.value = "" // reset so same file can be re-uploaded
    }
  }

  const handleSwitchUserType = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setUserType(userType === "student" ? "teacher" : "student")
      setAcademicStage("")
      setAcademicYear("")
      setDepartment("")
      setSecondLanguage("")
      setEducationType("")
      setExplanationSubject("")
      setTeacherStages([])
      setTeacherLanguage("")
      setProfileImageUrl(null)
      setProfileImagePreview(null)
      setUploadProgress(0)
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }

  const handleBack = () => {
    router.push("/Onboarding/signup1")
  }

  const handleSubmit = async () => {
    if (!signupData) {
      toaster.create({
        title: "خطأ",
        description: "بيانات المستخدم غير موجودة",
        type: "error",
        duration: 3000,
      })
      return
    }

    setLoading(true)

    try {
      if (userType === "teacher") {
        const userData = {
          userType: "teacher",
          role: "pending",
          signupStep: 'completed',
          emailVerified: true,
          completedAt: new Date().toISOString(),
        }
        await update(ref(rtdb, 'users/' + signupData.uid), userData)

        const teacherData = {
          id: signupData.uid,
          userId: signupData.uid,
          subjectId: explanationSubject,
          stages: teacherStages,
          language: teacherLanguage,
          profileImage: profileImageUrl, // 👈 B2 URL instead of base64
          status: "pending",
          createdAt: new Date().toISOString(),
          totalStudents: 0,
          rating: 0,
        }
        await update(ref(rtdb, 'teachers/' + signupData.uid), teacherData)

        toaster.create({
          title: "تم استلام طلبك",
          description: "سنقوم بمراجعة بياناتك والتواصل معك خلال 24 ساعة",
          type: "success",
          duration: 5000,
        })
        router.push("/Onboarding/mainPage")

      } else {
        const userData = {
          userType: "student",
          role: "student",
          signupStep: 'completed',
          emailVerified: true,
          completedAt: new Date().toISOString(),
          academicStage,
          academicYear,
          educationType,
          ...(isSecondary && { department, secondLanguage })
        }
        await update(ref(rtdb, 'users/' + signupData.uid), userData)

        toaster.create({
          title: "تم إنشاء الحساب بنجاح",
          description: "مرحباً بك في Union!",
          type: "success",
          duration: 3000,
        })
        router.push("/Onboarding/mainPage")
      }

      sessionStorage.removeItem('signupData')

    } catch (error) {
      console.error("Error saving data:", error)
      toaster.create({
        title: "حدث خطأ",
        description: "فشل في حفظ البيانات، يرجى المحاولة مرة أخرى",
        type: "error",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const isValid = userType === "student"
    ? academicStage && academicYear && educationType && (isSecondary ? department && secondLanguage : true)
    : explanationSubject && teacherStages.length > 0 && teacherLanguage && profileImageUrl // 👈 check URL not base64

  if (!signupData) {
    return (
      <Flex direction="column" minH="100vh" bg="#f7f9fc" _dark={{ bg: "gray.950" }}>
        <Navbar />
        <Flex flex={1} align="center" justify="center">
          <Text _dark={{ color: "white" }}>جاري التحميل...</Text>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex direction="column" minH="100vh" bg="#f7f9fc" _dark={{ bg: "gray.950" }}>

      <Flex direction="column" align="center" mt={6} px={4} pb={10}>

        {/* Back Button and Progress Indicator */}
        <Flex w="100%" maxW="600px" justify="space-between" align="center" mb={6} direction="row-reverse">
          <Box
            as="button"
            onClick={handleBack}
            p={2}
            rounded="lg"
            bg="black"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              transform: "translateX(-4px) scale(1.05)",
              bg: "#333",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
            _active={{ transform: "translateX(-2px) scale(0.95)" }}
          >
            <MdArrowBack size={20} />
          </Box>

          <Flex justify="center" align="center" gap={2}>
            <Box
              h={2}
              rounded="full"
              bg={userType === "student" ? "#e2e8f0" : "#ff3b5c"}
              transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              w={userType === "student" ? 2 : 8}
              _dark={{ bg: userType === "student" ? "gray.700" : "#ff3b5c" }}
            />
            <Box
              h={2}
              rounded="full"
              bg={userType === "student" ? "#ff3b5c" : "#e2e8f0"}
              transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              w={userType === "student" ? 8 : 2}
              _dark={{ bg: userType === "student" ? "#ff3b5c" : "gray.700" }}
            />
          </Flex>
        </Flex>

        <Image src="/Union.svg" alt="Union Logo" maxW="200px" mb={2} />

        <Box w="100%" maxW="600px">
          <Text color="#00A3E0" fontSize="lg" mb={8} textAlign="left">
            دايمًا في ضهرك خطوة بخطوة
          </Text>
        </Box>

        <Box bg="white" p={8} rounded="2xl" shadow="lg" w="100%" maxW="600px" overflow="hidden" _dark={{ bg: "gray.900" }}>

          <Box
            position="relative"
            transition="transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
            transform={isAnimating ? (userType === "student" ? "translateX(-100%)" : "translateX(100%)") : "translateX(0)"}
            opacity={isAnimating ? 0 : 1}
          >
            <VStack spacing={6} align="stretch">

              {userType === "student" ? (
                /* STUDENT FORM */
                <>
                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right" _dark={{ color: "white" }}>
                      المرحلة الدراسية *
                    </Text>
                    <CustomSelect
                      value={academicStage}
                      onChange={handleStageChange}
                      options={academicStages}
                      placeholder="اختر المرحلة الدراسية"
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right" _dark={{ color: "white" }}>
                      السنة الدراسية *
                    </Text>
                    <CustomSelect
                      value={academicYear}
                      onChange={setAcademicYear}
                      options={availableYears}
                      placeholder={academicStage ? "اختر السنة الدراسية" : "اختر المرحلة أولاً"}
                      disabled={!academicStage}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right" _dark={{ color: "white" }}>
                      نوع التعليم *
                    </Text>
                    <CustomSelect
                      value={educationType}
                      onChange={setEducationType}
                      options={educationTypes}
                      placeholder="اختر نوع المدرسة"
                    />
                  </Box>

                  {isSecondary && (
                    <>
                      <Box>
                        <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right" _dark={{ color: "white" }}>
                          القسم الدراسي *
                        </Text>
                        <CustomSelect
                          value={department}
                          onChange={setDepartment}
                          options={departments}
                          placeholder="اختر القسم الدراسي"
                        />
                      </Box>

                      <Box>
                        <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right" _dark={{ color: "white" }}>
                          اللغة الثانية *
                        </Text>
                        <CustomSelect
                          value={secondLanguage}
                          onChange={setSecondLanguage}
                          options={languages}
                          placeholder="اختر اللغة الثانية"
                        />
                      </Box>
                    </>
                  )}
                </>
              ) : (
                /* TEACHER FORM */
                <>
                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right" _dark={{ color: "white" }}>
                      المادة المراد شرحها *
                    </Text>
                    <CustomSelect
                      value={explanationSubject}
                      onChange={setExplanationSubject}
                      options={teacherSubjects}
                      placeholder="اختر المادة"
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right" _dark={{ color: "white" }}>
                      المراحل الدراسية التي تدرسها *
                    </Text>
                    <Flex gap={2} flexWrap="wrap">
                      {teachingStages.map((stage) => (
                        <Button
                          key={stage.value}
                          size="sm"
                          variant={teacherStages.includes(stage.value) ? "solid" : "outline"}
                          colorScheme={teacherStages.includes(stage.value) ? "blue" : "gray"}
                          onClick={() => {
                            if (teacherStages.includes(stage.value)) {
                              setTeacherStages(teacherStages.filter(s => s !== stage.value))
                            } else {
                              setTeacherStages([...teacherStages, stage.value])
                            }
                          }}
                        >
                          {stage.label}
                        </Button>
                      ))}
                    </Flex>
                    {teacherStages.length === 0 && (
                      <Text fontSize="xs" color="gray.500" mt={1} _dark={{ color: "gray.400" }}>
                        اختر مرحلة واحدة على الأقل
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right" _dark={{ color: "white" }}>
                      لغة الشرح *
                    </Text>
                    <Flex gap={3}>
                      <Button
                        flex={1}
                        size="md"
                        variant={teacherLanguage === "عربي" ? "solid" : "outline"}
                        colorScheme={teacherLanguage === "عربي" ? "blue" : "gray"}
                        onClick={() => setTeacherLanguage("عربي")}
                      >
                        عربي
                      </Button>
                      <Button
                        flex={1}
                        size="md"
                        variant={teacherLanguage === "لغات" ? "solid" : "outline"}
                        colorScheme={teacherLanguage === "لغات" ? "blue" : "gray"}
                        onClick={() => setTeacherLanguage("لغات")}
                      >
                        لغات
                      </Button>
                    </Flex>
                  </Box>

                  {/* Profile Image Upload */}
                  <Box>
                    <Flex align="center" justify="space-between" mb={2}>
                      <Text fontWeight="medium" color="#000" fontSize="sm" textAlign="right" _dark={{ color: "white" }}>
                        * صورة الملف الشخصي
                      </Text>
                      <Box
                        as="button"
                        display="flex"
                        alignItems="center"
                        gap={1}
                        color="#009EDB"
                        cursor="pointer"
                        onClick={() => setShowImageGuide(true)}
                        bg="blue.50"
                        px={2}
                        py={1}
                        rounded="md"
                        border="1px solid"
                        borderColor="blue.200"
                        transition="all 0.2s"
                        _hover={{ bg: "blue.100", borderColor: "blue.300" }}
                        _dark={{
                          bg: "blue.900",
                          borderColor: "blue.700",
                          _hover: { bg: "blue.800" }
                        }}
                      >
                        <MdInfoOutline size={16} />
                        <Text fontSize="xs" fontWeight="medium" color="#009EDB" _dark={{ color: "blue.300" }}>
                          إرشادات الصورة
                        </Text>
                      </Box>
                    </Flex>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: "none" }}
                    />

                    {/* Upload Box */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      bg="white"
                      border="1px solid"
                      borderColor={profileImageUrl ? "#009EDB" : "#e2e8f0"}
                      rounded="lg"
                      px={4}
                      py={3}
                      cursor={uploading ? "not-allowed" : "pointer"}
                      transition="all 0.2s"
                      onClick={uploading ? undefined : handleImageClick}
                      _hover={uploading ? {} : { borderColor: "#009EDB", bg: "#f0f9ff" }}
                      opacity={uploading ? 0.7 : 1}
                      _dark={{
                        bg: "gray.800",
                        borderColor: profileImageUrl ? "#009EDB" : "gray.700",
                        _hover: uploading ? {} : { borderColor: "#009EDB", bg: "gray.700" }
                      }}
                    >
                      <Text
                        color={profileImageUrl ? "#009EDB" : uploading ? "gray.400" : "#a0aec0"}
                        fontSize="sm"
                        fontWeight={profileImageUrl ? "medium" : "normal"}
                        _dark={{ color: profileImageUrl ? "#009EDB" : "gray.400" }}
                      >
                        {uploading
                          ? `جاري الرفع... ${uploadProgress}%`
                          : profileImageUrl
                            ? "تم رفع الصورة ✓"
                            : "اختر صورة الملف الشخصي"
                        }
                      </Text>
                      <MdUpload color={profileImageUrl ? "#009EDB" : "#718096"} size={20} />
                    </Box>

                    {/* Progress Bar */}
                    {uploading && (
                      <Box mt={2} h="4px" bg="gray.200" rounded="full" overflow="hidden" _dark={{ bg: "gray.700" }}>
                        <Box
                          h="100%"
                          bg="#009EDB"
                          rounded="full"
                          transition="width 0.3s ease"
                          w={`${uploadProgress}%`}
                        />
                      </Box>
                    )}

                    {/* Preview */}
                    {profileImagePreview && (
                      <Box mt={3}>
                        <Image
                          src={profileImagePreview}
                          alt="Preview"
                          maxH="100px"
                          rounded="md"
                          border="2px solid"
                          borderColor={profileImageUrl ? "green.300" : "yellow.300"}
                          _dark={{ borderColor: profileImageUrl ? "green.600" : "yellow.600" }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box bg="yellow.50" p={3} rounded="md" border="1px solid" borderColor="yellow.200" _dark={{ bg: "yellow.900", borderColor: "yellow.700" }}>
                    <Text fontSize="sm" color="yellow.800" textAlign="right" _dark={{ color: "yellow.200" }}>
                      ⚠️ ملاحظة: بعد إتمام التسجيل، سيقوم فريق Dolphin Models بمراجعة بياناتك والتواصل معك خلال 24 ساعة لتفعيل حسابك
                    </Text>
                  </Box>
                </>
              )}

            </VStack>
          </Box>

          {/* Submit Button */}
          <Button
            w="100%"
            mt={8}
            mb={6}
            bg="#009EDB"
            color="white"
            size="lg"
            rounded="xl"
            onClick={handleSubmit}
            loading={loading}
            disabled={!isValid || loading || uploading}
            fontSize="md"
            fontWeight="bold"
            overflow="hidden"
            position="relative"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              bg: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              transition: "left 0.5s",
            }}
            _hover={{
              bg: "#0085bb",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 158, 219, 0.4)",
              _before: { left: "100%" }
            }}
            _active={{
              transform: "translateY(0)",
              boxShadow: "0 4px 15px rgba(0, 158, 219, 0.3)",
            }}
          >
            إنشاء الحساب
          </Button>

          {/* Toggle Link */}
          <Text
            textAlign="center"
            color="#009EDB"
            fontSize="sm"
            cursor="pointer"
            textDecoration="underline"
            onClick={handleSwitchUserType}
            _hover={{ color: "#0085bb" }}
          >
            {userType === "student"
              ? "التسجيل كمعلم؟ اضغط هنا"
              : "التسجيل كطالب؟ اضغط هنا"}
          </Text>

        </Box>
      </Flex>

      {/* Image Guide Modal */}
      {showImageGuide && <ImageGuideModal onClose={() => setShowImageGuide(false)} />}

      <Toaster />
    </Flex>
  )
}