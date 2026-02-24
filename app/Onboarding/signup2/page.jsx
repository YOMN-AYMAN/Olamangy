"use client"

import { useState, useEffect } from "react"
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
import { MdArrowBack, MdUpload } from "react-icons/md"
import Navbar from "@/components/ui/Navbar"
import { CustomSelect } from "@/components/ui/Customselect"

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

// NEW: Education type options
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

export default function Signup2() {
  const router = useRouter()
  
  const [userType, setUserType] = useState("student")
  const [loading, setLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [signupData, setSignupData] = useState(null)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  // Student fields
  const [academicStage, setAcademicStage] = useState("")
  const [academicYear, setAcademicYear] = useState("")
  const [department, setDepartment] = useState("")
  const [secondLanguage, setSecondLanguage] = useState("")
  const [educationType, setEducationType] = useState("") // NEW: حكومي/خاص/أزهر/معاهد

  // Teacher fields
  const [explanationSubject, setExplanationSubject] = useState("")
  const [teacherStages, setTeacherStages] = useState([])
  const [teacherLanguage, setTeacherLanguage] = useState("")
  const [profileImage, setProfileImage] = useState(null)

  // Check if secondary stage
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
    setEducationType("") // Reset education type when stage changes
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 2MB for base64 storage)
      if (file.size > 2 * 1024 * 1024) {
        toaster.create({
          title: "خطأ",
          description: "حجم الصورة يجب أن يكون أقل من 2 ميجابايت",
          type: "error",
          duration: 3000,
        })
        return
      }

      try {
        const base64 = await convertToBase64(file)
        setProfileImage(base64)
        toaster.create({
          title: "تم",
          description: "تم تحميل الصورة بنجاح",
          type: "success",
          duration: 2000,
        })
      } catch (error) {
        toaster.create({
          title: "خطأ",
          description: "فشل في تحميل الصورة",
          type: "error",
          duration: 3000,
        })
      }
    }
  }

  // Handle user type switch with animation
  const handleSwitchUserType = () => {
  setIsAnimating(true)
  setTimeout(() => {
    setUserType(userType === "student" ? "teacher" : "student")
    // Reset fields when switching
    setAcademicStage("")
    setAcademicYear("")
    setDepartment("")
    setSecondLanguage("")
    setExplanationSubject("")
    setTeacherStages([]) // Changed from setTeacherQualification("")
    setTeacherLanguage("")
    setProfileImage(null)
    setTimeout(() => setIsAnimating(false), 50)
  }, 300)
}

  // Determine back button destination
  const handleBack = () => {
    if (isGoogleUser) {
      router.push("/Onboarding/signup1")
    } else {
      router.push("/Onboarding/otp-verification")
    }
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
      // Save to users collection (basic info from signup1)
      const userData = {
        userType: "teacher",
        role: "pending",
        signupStep: 'completed',
        emailVerified: true,
        completedAt: new Date().toISOString(),
      }
      
      await update(ref(rtdb, 'users/' + signupData.uid), userData)

      // Save to teachers collection (additional teacher-specific data)
      const teacherData = {
        id: signupData.uid, // or generate unique teacher ID
        userId: signupData.uid,
        subjectId: explanationSubject,
        stages: teacherStages, // Array of selected stages
        language: teacherLanguage,
        profileImage: profileImage,
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
      // Student - save to users only
      const userData = {
        userType: "student",
        role: "student",
        signupStep: 'completed',
        emailVerified: true,
        completedAt: new Date().toISOString(),
        academicStage,
        academicYear,
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

  // Check if form is valid
  const isValid = userType === "student"
  ? academicStage && academicYear && (isSecondary ? department && secondLanguage : true)
  : explanationSubject && teacherStages.length > 0 && teacherLanguage && profileImage
  // Show loading state while checking session storage
  if (!signupData) {
    return (
      <Flex direction="column" minH="100vh" bg="#f7f9fc">
        <Navbar />
        <Flex flex={1} align="center" justify="center">
          <Text>جاري التحميل...</Text>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex direction="column" minH="100vh" bg="#f7f9fc">

      <Flex direction="column" align="center" mt={6} px={4} pb={10}>
        {/* Back Button and Progress Indicator */}
        <Flex w="100%" maxW="600px" justify="space-between" align="center" mb={6} direction="row-reverse">
          {/* Back Button */}
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
          
          {/* Progress Indicator */}
          <Flex justify="center" align="center" gap={2}>
            <Box
              h={2}
              rounded="full"
              bg={userType === "student" ? "#e2e8f0" : "#ff3b5c"}
              transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              w={userType === "student" ? 2 : 8}
            />
            <Box
              h={2}
              rounded="full"
              bg={userType === "student" ? "#ff3b5c" : "#e2e8f0"}
              transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              w={userType === "student" ? 8 : 2}
            />
          </Flex>
        </Flex>

        <Image src="/Union.svg" alt="Union Logo" maxW="200px" mb={2} />

        <Box w="100%" maxW="600px">
          <Text color="#00A3E0" fontSize="lg" mb={8} textAlign="left">
            دايمًا في ضهرك خطوة بخطوة
          </Text>
        </Box>

        <Box bg="white" p={8} rounded="2xl" shadow="lg" w="100%" maxW="600px" overflow="hidden">
          
          {/* Animated Form Container */}
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
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right">
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
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right">
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
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right">
                      القسم الدراسي {isSecondary && "*"}
                    </Text>
                    <CustomSelect
                      value={department}
                      onChange={setDepartment}
                      options={departments}
                      placeholder={isSecondary ? "اختر القسم الدراسي" : "متاح للمرحلة الثانوية فقط"}
                      disabled={!isSecondary}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right">
                      اللغة الثانية {isSecondary && "*"}
                    </Text>
                    <CustomSelect
                      value={secondLanguage}
                      onChange={setSecondLanguage}
                      options={languages}
                      placeholder={isSecondary ? "اختر اللغة الثانية" : "متاح للمرحلة الثانوية فقط"}
                      disabled={!isSecondary}
                    />
                  </Box>
                </>
              ) : (
                /* TEACHER FORM */
                <>
                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right">
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
  <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right">
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
    <Text fontSize="xs" color="gray.500" mt={1}>
      اختر مرحلة واحدة على الأقل
    </Text>
  )}
</Box>

                  <Box>
  <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right">
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

                  <Box>
                    <Text fontWeight="medium" color="#000" fontSize="sm" mb={2} textAlign="right">
                      صورة الملف الشخصي *
                    </Text>
                    <Box
                      as="label"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      bg="white"
                      border="1px solid"
                      borderColor={profileImage ? "#009EDB" : "#e2e8f0"}
                      rounded="lg"
                      px={4}
                      py={3}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: "#009EDB", bg: "#f0f9ff" }}
                    >
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        display="none"
                      />
                      <Text color={profileImage ? "#009EDB" : "#a0aec0"} fontSize="sm" fontWeight={profileImage ? "medium" : "normal"}>
                        {profileImage ? "تم اختيار الصورة" : "اختر صورة الملف الشخصي"}
                      </Text>
                      <MdUpload color={profileImage ? "#009EDB" : "#718096"} size={20} />
                    </Box>
                    {profileImage && (
                      <Text fontSize="xs" color="green.500" mt={1}>
                        ✓ تم اختيار الصورة بنجاح
                      </Text>
                    )}
                    {/* Preview selected image */}
                    {profileImage && (
                      <Box mt={2}>
                        <Image 
                          src={profileImage} 
                          alt="Preview" 
                          maxH="100px" 
                          rounded="md"
                          border="1px solid #e2e8f0"
                        />
                      </Box>
                    )}
                  </Box>
                  <Box bg="yellow.50" p={3} rounded="md" border="1px solid" borderColor="yellow.200">
  <Text fontSize="sm" color="yellow.800" textAlign="right">
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
            disabled={!isValid || loading}
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
              _before: {
                left: "100%",
              }
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
      
      {/* Toaster component for Chakra v3 */}
      <Toaster />
    </Flex>
  )
}