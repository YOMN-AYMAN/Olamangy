"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/auth/firebase"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { getDatabase, ref, set, get } from "firebase/database"

import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  VStack,
  Checkbox,
} from "@chakra-ui/react"

import { CustomSelect } from "@/components/ui/Customselect"

import {
  MdEmail,
  MdLock,
  MdPerson,
  MdPhone,
  MdCalendarToday,
  MdVisibility,
  MdVisibilityOff,
  MdLocationOn,
} from "react-icons/md"

// Egyptian governorates and their cities
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

export default function Signup1() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [governorate, setGovernorate] = useState("")
  const [city, setCity] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [countryCode, setCountryCode] = useState("+20")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  // Google auth states
  const [isGoogleAuth, setIsGoogleAuth] = useState(false)
  const [googleUserData, setGoogleUserData] = useState(null)

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const availableCities = governorate ? egyptData[governorate] || [] : []

  const governorateOptions = Object.keys(egyptData).map(gov => ({
    value: gov,
    label: gov
  }))

  const cityOptions = availableCities.map(city => ({
    value: city,
    label: city
  }))

  const countryCodeOptions = countryCodes.map(c => ({
    value: c.code,
    label: `${c.flag} ${c.code}`
  }))

  // Check for Google auth data from login page on mount
  useEffect(() => {
    const googleData = sessionStorage.getItem('googleAuthData')
    if (googleData) {
      const parsed = JSON.parse(googleData)
      setEmail(parsed.email)
      setIsGoogleAuth(true)
      setGoogleUserData({
        uid: parsed.uid,
        email: parsed.email
      })
      // Clear the data so it doesn't persist on refresh
      sessionStorage.removeItem('googleAuthData')
    }
  }, [])

  const handleGovernorateChange = (value) => {
    setGovernorate(value)
    setCity("")
  }

  // Save user data to Firebase Realtime Database with pending status
  const saveUserToDatabase = async (userData) => {
    try {
      const db = getDatabase()
      const userRef = ref(db, 'users/' + userData.uid)

      await set(userRef, {
        ...userData,
        role: 'pending',
        createdAt: new Date().toISOString(),
        signupStep: 1
      })
      
      return { success: true }
    } catch (error) {
      console.error('Database error:', error)
      throw new Error('Failed to save user data')
    }
  }

  // Send OTP to email using your backend API
  const sendOTP = async (emailAddress) => {
    try {
      const response = await fetch('https://backend-dolphin.vercel.app/send-otp ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          expiresIn: 600 // 10 minutes in seconds
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send OTP')
      }

      return await response.json()
    } catch (error) {
      console.error('OTP error:', error)
      throw error
    }
  }

  const handleSignup = async () => {
    // Validation
    if (!fullName || !email || !governorate || !city || !birthDate || !phone) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    // Validate 4 names (اسم رباعي)
    const nameParts = fullName.trim().split(/\s+/).filter(part => part.length > 0)
    if (nameParts.length !== 4) {
      setErrorMessage("الرجاء إدخال الاسم الرباعي بالكامل (مثال: محمد أحمد عبدالله محمود)")
      return
    }

    // Only validate password if not Google auth
    if (!isGoogleAuth) {
      if (!password || !confirmPassword) {
        setErrorMessage("يرجى ملء جميع الحقول المطلوبة")
        return
      }
      if (password !== confirmPassword) {
        setErrorMessage("كلمة المرور وتأكيد كلمة المرور غير متطابقين")
        return
      }
      if (password.length < 6) {
        setErrorMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        return
      }
    }

    if (!agreeToTerms) {
      setErrorMessage("يجب الموافقة على الشروط والأحكام وسياسة الخصوصية")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      let firebaseUser = null

      if (!isGoogleAuth) {
        // Create Firebase user with email/password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        firebaseUser = userCredential.user
      } else {
        // Use existing Google auth user
        firebaseUser = googleUserData
      }

      // Prepare user data
      const userData = {
        uid: firebaseUser.uid,
        fullName,
        email,
        governorate,
        city,
        birthDate,
        phone: `${phone}`,
        code: countryCode,
        authMethod: isGoogleAuth ? 'google' : 'email',
        emailVerified: isGoogleAuth ? true : false // Google users are pre-verified
      }

      // Save to Firebase Realtime Database with pending role
      await saveUserToDatabase(userData)

      // Store signup data in sessionStorage
      sessionStorage.setItem('signupData', JSON.stringify({
        uid: firebaseUser.uid,
        email: email,
        fullName: fullName,
        isGoogleAuth: isGoogleAuth, // Flag to identify Google users
        authMethod: isGoogleAuth ? 'google' : 'email'
      }))

      // DIFFERENT FLOW BASED ON AUTH METHOD
      if (isGoogleAuth) {
        // Google users skip OTP and go directly to Signup2
        router.push("/Onboarding/signup2")
      } else {
        // Email users go to OTP verification
        await sendOTP(email)
        router.push("/Onboarding/otp-verification")
      }

    } catch (error) {
      console.error("Signup error:", error)
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("البريد الإلكتروني مستخدم بالفعل")
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage("كلمة المرور ضعيفة، يجب أن تكون أقوى")
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage("البريد الإلكتروني غير صالح")
      } else {
        setErrorMessage("حدث خطأ أثناء إنشاء الحساب")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setErrorMessage("")

    try {
      // Create fresh provider instance (FIX for COOP issue)
      const provider = new GoogleAuthProvider()
      // Add custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Auto-fill email and disable password inputs
      setEmail(user.email)
      setIsGoogleAuth(true)
      setGoogleUserData(user)

      // Check if user already exists in Firebase Realtime Database
      const db = getDatabase()
      const userRef = ref(db, 'users/' + user.uid)
      const snapshot = await get(userRef)
      if (snapshot.exists()) {
        const existingUser = snapshot.val()
        if (existingUser.role !== 'pending') {
          // User already completed signup
          router.push("/dashboard")
          return
        }
      }

      // Show message to complete the rest of the form
      setErrorMessage("تم استيراد بياناتك من جوجل. يرجى إكمال باقي الحقول.")

    } catch (error) {
      console.error("Google signup error:", error)
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage("تم إغلاق نافذة تسجيل الدخول")
      } else if (error.code === 'auth/popup-blocked') {
        setErrorMessage("تم حظر النافذة المنبثقة، يرجى السماح بالنوافذ المنبثقة لهذا الموقع")
      } else {
        setErrorMessage("فشل إنشاء الحساب بواسطة جوجل")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex direction="column" minH="100vh" bg="#f7f9fc" _dark={{bg: "gray.950"}}>

      <Flex direction="column" align="center" mt={6} px={4} pb={10}>
        <Image src="/Union.svg" alt="Union Logo" maxW="260px" mb={2} />

        <Box w="100%" maxW="600px">
          <Text color="#00A3E0" fontSize="lg" mb={8} textAlign="left">
            دايمًا في ضهرك خطوة بخطوة
          </Text>
        </Box>

        <Box bg="white" p={8} rounded="2xl" shadow="lg" w="100%" maxW="600px" _dark={{bg: "gray.900"}}>
          <VStack spacing={6} align="stretch">

            {errorMessage && (
              <Box bg={errorMessage.includes("تم استيراد") ? "green.50" : "red.50"}
                color={errorMessage.includes("تم استيراد") ? "green.500" : "red.500"}
                p={3} rounded="md" fontSize="sm">
                {errorMessage}
              </Box>
            )}

            {/* FULL NAME */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{color: "white"}}>
                <MdPerson color="currentColor" size={20} style={{marginRight: 8}} />
                <Text fontWeight="medium" fontSize="sm">
                  الاسم رباعي
                </Text>
              </Flex>
              <Input
                bg="white"
                rounded="lg"
                px={4}
                py={3}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="محمد مجدي فؤاد حلمي"
                color="#535353"
                fontSize="sm"
                borderColor="#e2e8f0"
                _placeholder={{color: "#a0aec0"}}
                _dark={{
                  bg: "gray.800",
                  color: "white",
                  borderColor: "gray.700",
                  _placeholder: {color: "gray.400"}
                }}
              />
            </Box>

            {/* EMAIL - Disabled if Google Auth */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{color: "white"}}>
                <MdEmail color="currentColor" size={20} style={{marginRight: 8}} />
                <Text fontWeight="medium" fontSize="sm">
                  البريد الإلكتروني
                </Text>
                {isGoogleAuth && (
                  <Text fontSize="xs" color="green.500" mr={2}>(تم التحقق من جوجل)</Text>
                )}
              </Flex>
              <Input
                bg={isGoogleAuth ? "gray.100" : "white"}
                rounded="lg"
                px={4}
                py={3}
                value={email}
                onChange={(e) => !isGoogleAuth && setEmail(e.target.value)}
                placeholder="example@gmail.com"
                color="#535353"
                fontSize="sm"
                borderColor="#e2e8f0"
                _placeholder={{color: "#a0aec0"}}
                disabled={isGoogleAuth}
                readOnly={isGoogleAuth}
                _dark={{
                  bg: isGoogleAuth ? "gray.700" : "gray.800",
                  color: "white",
                  borderColor: "gray.700",
                  _placeholder: {color: "gray.400"}
                }}
              />
            </Box>

            {/* GOVERNORATE */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{color: "white"}}>
                <MdLocationOn color="currentColor" size={20} style={{marginRight: 8}} />
                <Text fontWeight="medium" fontSize="sm">
                  المحافظة
                </Text>
              </Flex>
              <CustomSelect
                value={governorate}
                onChange={handleGovernorateChange}
                options={governorateOptions}
                placeholder="اختر المحافظة"
              />
            </Box>

            {/* CITY */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{color: "white"}}>
                <MdLocationOn color="currentColor" size={20} style={{marginRight: 8}} />
                <Text fontWeight="medium" fontSize="sm">
                  المدينة
                </Text>
              </Flex>
              <CustomSelect
                value={city}
                onChange={setCity}
                options={cityOptions}
                placeholder={governorate ? "اختر المدينة" : "اختر المحافظة أولاً"}
                disabled={!governorate}
              />
            </Box>

            {/* BIRTH DATE */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{color: "white"}}>
                <MdCalendarToday color="currentColor" size={20} style={{marginRight: 8}} />
                <Text fontWeight="medium" fontSize="sm">
                  تاريخ الميلاد
                </Text>
              </Flex>
              <Input
                type="date"
                bg="white"
                rounded="lg"
                px={4}
                py={3}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                color="#535353"
                fontSize="sm"
                borderColor="#e2e8f0"
                _dark={{
                  bg: "gray.800",
                  color: "white",
                  borderColor: "gray.700"
                }}
              />
            </Box>

            {/* PHONE NUMBER WITH COUNTRY CODE */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{color: "white"}}>
                <MdPhone color="currentColor" size={20} style={{marginRight: 8}} />
                <Text fontWeight="medium" fontSize="sm">
                  رقم الهاتف
                </Text>
              </Flex>
              <Flex gap={2}>
                <CustomSelect
                  value={countryCode}
                  onChange={setCountryCode}
                  options={countryCodeOptions}
                  width="140px"
                />
                <Input
                  flex={1}
                  bg="white"
                  rounded="lg"
                  px={4}
                  py={3}
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 15)
                    setPhone(digitsOnly)
                  }}
                  placeholder="1123456789"
                  color="#535353"
                  fontSize="sm"
                  borderColor="#e2e8f0"
                  _placeholder={{color: "#a0aec0"}}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  _dark={{
                    bg: "gray.800",
                    color: "white",
                    borderColor: "gray.700",
                    _placeholder: {color: "gray.400"}
                  }}
                />
              </Flex>
            </Box>

            {/* PASSWORD - Hidden if Google Auth */}
            {!isGoogleAuth && (
              <>
                <Box>
                  <Flex align="center" mb={2} color="#000" _dark={{color: "white"}}>
                    <MdLock color="currentColor" size={20} style={{marginRight: 8}} />
                    <Text fontWeight="medium" fontSize="sm">
                      كلمة المرور
                    </Text>
                  </Flex>
                  <Box position="relative">
                    <Input
                      bg="white"
                      rounded="lg"
                      px={4}
                      py={3}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      color="#535353"
                      fontSize="sm"
                      borderColor="#e2e8f0"
                      _placeholder={{color: "#a0aec0"}}
                      _dark={{
                        bg: "gray.800",
                        color: "white",
                        borderColor: "gray.700",
                        _placeholder: {color: "gray.400"}
                      }}
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      left="12px"
                      transform="translateY(-50%)"
                      cursor="pointer"
                    >
                      {showPassword ? (
                        <MdVisibilityOff
                          size={18}
                          color="#718096"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <MdVisibility
                          size={18}
                          color="#718096"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Flex align="center" mb={2} color="#000" _dark={{color: "white"}}>
                    <MdLock color="currentColor" size={20} style={{marginRight: 8}} />
                    <Text fontWeight="medium" fontSize="sm">
                      تأكيد كلمة المرور
                    </Text>
                  </Flex>
                  <Box position="relative">
                    <Input
                      bg="white"
                      rounded="lg"
                      px={4}
                      py={3}
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="********"
                      color="#535353"
                      fontSize="sm"
                      borderColor="#e2e8f0"
                      _placeholder={{color: "#a0aec0"}}
                      _dark={{
                        bg: "gray.800",
                        color: "white",
                        borderColor: "gray.700",
                        _placeholder: {color: "gray.400"}
                      }}
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      left="12px"
                      transform="translateY(-50%)"
                      cursor="pointer"
                    >
                      {showConfirmPassword ? (
                        <MdVisibilityOff
                          size={18}
                          color="#718096"
                          onClick={() => setShowConfirmPassword(false)}
                        />
                      ) : (
                        <MdVisibility
                          size={18}
                          color="#718096"
                          onClick={() => setShowConfirmPassword(true)}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </>
            )}

            {/* TERMS */}
            <Box>
              <Flex alignItems="center" gap={2}>
                <Checkbox.Root
                  checked={agreeToTerms}
                  onCheckedChange={(e) => setAgreeToTerms(e.checked)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label color="#000" mr={2} _dark={{color: "white"}}>
                    أوافق على الشروط والأحكام وسياسة الخصوصية
                    <Text
                      as="span"
                      color="#009EDB"
                      textDecoration="underline"
                      cursor="pointer"
                      onClick={() => setShowTerms(true)}
                      _hover={{color: "#0085bb"}}
                      fontSize="sm"
                      marginRight={"10px"}
                    >
                      اقرأ المزيد
                    </Text>
                  </Checkbox.Label>
                </Checkbox.Root>
              </Flex>
            </Box>

            {/* SIGNUP BUTTON */}
            <Button
              bg="#009EDB"
              color="white"
              size="lg"
              rounded="xl"
              _hover={{bg: "#0085bb"}}
              onClick={handleSignup}
              loading={loading}
              fontSize="md"
              fontWeight="bold"
              disabled={loading}
            >
              إنشاء حساب
            </Button>

            {/* OR DIVIDER - Only show if not Google Auth */}
            {!isGoogleAuth && (
              <Flex align="center" justify="center" gap={4}>
                <Box flex="1" h="1px" bg="#e2e8f0" _dark={{bg: "gray.700"}} />
                <Text color="#666" fontSize="sm" whiteSpace="nowrap" _dark={{color: "gray.400"}}>
                  أو
                </Text>
                <Box flex="1" h="1px" bg="#e2e8f0" _dark={{bg: "gray.700"}} />
              </Flex>
            )}

            {/* GOOGLE SIGNUP - Only show if not already using Google */}
            {!isGoogleAuth && (
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={3}
                border="1px solid #ddd"
                borderRadius="xl"
                p={4}
                bg="white"
                _hover={{bg: "#f9f9f9"}}
                _active={{bg: "#f1f1f1"}}
                transition="all 0.2s"
                onClick={handleGoogleSignup}
                cursor="pointer"
                disabled={loading}
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  _hover: {bg: "gray.700"},
                  _active: {bg: "gray.600"}
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <Text color="#333" fontWeight="medium" fontSize="sm" _dark={{color: "white"}}>
                  التسجيل باستخدام جوجل
                </Text>
              </Flex>
            )}

          </VStack>
        </Box>

        {/* LOGIN LINK */}
        <Flex mt={8} justify="center" align="center" gap={2} fontSize="lg" fontWeight="bold">
          <Text color="#333" _dark={{color: "gray.300"}}>عندك حساب بالفعل؟</Text>
          <Text
            color="#ff3b5c"
            cursor="pointer"
            borderBottom="3px solid #ff3b5c"
            onClick={() => router.push("/Onboarding/login")}
          >
            تسجيل دخول
          </Text>
        </Flex>

        {/* TERMS MODAL */}
        {showTerms && (
          <>
            <Box
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              p={6}
              rounded="xl"
              shadow="2xl"
              w="90%"
              maxW="500px"
              maxH="80vh"
              overflowY="auto"
              zIndex={1000}
              border="1px solid"
              borderColor="gray.200"
              _dark={{
                bg: "gray.900",
                borderColor: "gray.700"
              }}
            >
              <Flex justify="space-between" align="center" mb={4} pb={3} borderBottom="1px solid" borderColor="gray.200" _dark={{borderColor: "gray.700"}}>
                <Text fontWeight="bold" fontSize="lg" color={"#000"} _dark={{color: "white"}}>
                  الشروط والأحكام
                </Text>
                <Text
                  cursor="pointer"
                  fontSize="xl"
                  color="gray.500"
                  _hover={{color: "gray.700"}}
                  onClick={() => setShowTerms(false)}
                  _dark={{color: "gray.400", _hover: {color: "gray.200"}}}
                >
                  ×
                </Text>
              </Flex>
              <Box minH="200px">
                <Text color="gray.400" textAlign="center" mt={10} _dark={{color: "gray.500"}}>
                </Text>
              </Box>
              <Button
                mt={4}
                w="100%"
                bg="#009EDB"
                color="white"
                onClick={() => setShowTerms(false)}
              >
                إغلاق
              </Button>
            </Box>
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={999}
              onClick={() => setShowTerms(false)}
            />
          </>
        )}
      </Flex>
    </Flex>
  )
}