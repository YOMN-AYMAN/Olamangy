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
import { egyptData, countryCodes} from "@/components/Arr"

// ─────────────────────────────────────────────
// TERMS MODAL COMPONENT
// ─────────────────────────────────────────────
function TermsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("privacy")
  const [content, setContent] = useState({ privacy: null, terms: null })
  const [loadingContent, setLoadingContent] = useState(true)

  useEffect(() => {
    const db = getDatabase()
    Promise.all([
      get(ref(db, "legal/privacy")),
      get(ref(db, "legal/terms")),
    ])
      .then(([privacySnap, termsSnap]) => {
        setContent({
          privacy: privacySnap.exists() ? privacySnap.val() : null,
          terms:   termsSnap.exists()   ? termsSnap.val()   : null,
        })
      })
      .catch(() => setContent({ privacy: null, terms: null }))
      .finally(() => setLoadingContent(false))
  }, [])

  const tabs = [
    { key: "privacy", label: "سياسة الخصوصية" },
    { key: "terms",   label: "شروط الخدمة والاستخدام" },
  ]

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
        maxW="560px"
        maxH="82vh"
        zIndex={1000}
        border="1px solid"
        borderColor="gray.200"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      >
        {/* Modal Header */}
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
            الشروط والسياسات
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

        {/* Tabs Navbar */}
        <Flex
          px={6}
          pt={3}
          borderBottom="2px solid"
          borderColor="gray.100"
          flexShrink={0}
          _dark={{ borderColor: "gray.700" }}
        >
          {tabs.map((tab) => (
            <Box
              key={tab.key}
              pb={3}
              px={1}
              ml={6}
              cursor="pointer"
              fontSize="sm"
              fontWeight={activeTab === tab.key ? "bold" : "medium"}
              color={activeTab === tab.key ? "#009EDB" : "gray.400"}
              borderBottom="2px solid"
              borderColor={activeTab === tab.key ? "#009EDB" : "transparent"}
              mb="-2px"
              onClick={() => setActiveTab(tab.key)}
              transition="all 0.18s"
              userSelect="none"
              _hover={{ color: activeTab === tab.key ? "#009EDB" : "gray.600" }}
              _dark={{
                color: activeTab === tab.key ? "#009EDB" : "gray.500",
                _hover: { color: activeTab === tab.key ? "#009EDB" : "gray.300" },
              }}
            >
              {tab.label}
            </Box>
          ))}
        </Flex>

        {/* Scrollable Content */}
        <Box px={6} py={5} overflowY="auto" flex="1" dir="rtl">
          {loadingContent ? (
            <Flex justify="center" align="center" h="120px">
              <Text color="gray.400" fontSize="sm" _dark={{ color: "gray.500" }}>
                جاري التحميل...
              </Text>
            </Flex>
          ) : !content[activeTab] ? (
            <Flex justify="center" align="center" h="120px">
              <Text color="gray.400" fontSize="sm" textAlign="center" _dark={{ color: "gray.500" }}>
                المحتوى غير متاح حالياً
              </Text>
            </Flex>
          ) : (
            <Box>
              {/* Title */}
              <Text fontWeight="bold" fontSize="md" color="#009EDB" mb={1}>
                {content[activeTab].title}
              </Text>

              {/* Last Updated */}
              <Text fontSize="xs" color="gray.400" mb={4} _dark={{ color: "gray.500" }}>
                آخر تحديث: {content[activeTab].lastUpdated}
              </Text>

              {/* Intro paragraph */}
              <Text
                fontSize="sm"
                color="gray.600"
                mb={6}
                lineHeight="1.9"
                _dark={{ color: "gray.400" }}
              >
                {content[activeTab].intro}
              </Text>

              {/* Numbered Sections */}
              {Object.entries(content[activeTab].sections)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([num, section]) => (
                  <Box key={num} mb={6}>
                    {/* Section Header */}
                    <Flex align="center" mb={2} gap={2}>
                      <Box
                        bg="#009EDB"
                        color="white"
                        fontSize="xs"
                        fontWeight="bold"
                        rounded="md"
                        px={2}
                        py={0.5}
                        flexShrink={0}
                      >
                        {num}
                      </Box>
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="#000"
                        _dark={{ color: "white" }}
                      >
                        {section.title}
                      </Text>
                    </Flex>

                    {/* Section Content */}
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      whiteSpace="pre-wrap"
                      lineHeight="2"
                      pr={6}
                      _dark={{ color: "gray.400" }}
                    >
                      {section.content}
                    </Text>

                    {/* Divider */}
                    <Box mt={4} h="1px" bg="gray.100" _dark={{ bg: "gray.700" }} />
                  </Box>
                ))}

              {/* Footer */}
              <Text
                fontSize="xs"
                color="gray.400"
                mt={2}
                mb={2}
                textAlign="center"
                _dark={{ color: "gray.500" }}
              >
                {content[activeTab].footer}
              </Text>
            </Box>
          )}
        </Box>

        {/* Footer Button */}
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
            إغلاق
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
// MAIN SIGNUP PAGE
// ─────────────────────────────────────────────
export default function Signup1() {
  const router = useRouter()

  const [fullName,            setFullName]            = useState("")
  const [email,               setEmail]               = useState("")
  const [governorate,         setGovernorate]         = useState("")
  const [city,                setCity]                = useState("")
  const [birthDate,           setBirthDate]           = useState("")
  const [countryCode,         setCountryCode]         = useState("+20")
  const [phone,               setPhone]               = useState("")
  const [password,            setPassword]            = useState("")
  const [confirmPassword,     setConfirmPassword]     = useState("")
  const [showPassword,        setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms,        setAgreeToTerms]        = useState(false)
  const [showTerms,           setShowTerms]           = useState(false)

  // Google auth states
  const [isGoogleAuth,   setIsGoogleAuth]   = useState(false)
  const [googleUserData, setGoogleUserData] = useState(null)

  const [loading,      setLoading]      = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const availableCities = governorate ? egyptData[governorate] || [] : []

  const governorateOptions = Object.keys(egyptData).map(gov => ({
    value: gov,
    label: gov,
  }))

  const cityOptions = availableCities.map(c => ({
    value: c,
    label: c,
  }))

  const countryCodeOptions = countryCodes.map(c => ({
    value: c.code,
    label: `${c.flag} ${c.code}`,
  }))

  // Check for Google auth data from login page on mount
  useEffect(() => {
    const googleData = sessionStorage.getItem("googleAuthData")
    if (googleData) {
      const parsed = JSON.parse(googleData)
      setEmail(parsed.email)
      setIsGoogleAuth(true)
      setGoogleUserData({ uid: parsed.uid, email: parsed.email })
      sessionStorage.removeItem("googleAuthData")
    }
  }, [])

  const handleGovernorateChange = (value) => {
    setGovernorate(value)
    setCity("")
  }

  const saveUserToDatabase = async (userData) => {
    try {
      const db = getDatabase()
      const userRef = ref(db, "users/" + userData.uid)
      await set(userRef, {
        ...userData,
        role:       "pending",
        createdAt:  new Date().toISOString(),
        signupStep: 1,
      })
      return { success: true }
    } catch (error) {
      console.error("Database error:", error)
      throw new Error("Failed to save user data")
    }
  }

  const sendOTP = async (emailAddress) => {
    try {
      const response = await fetch("https://backend-dolphin.vercel.app/send-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: emailAddress, expiresIn: 600 }),
      })
      if (!response.ok) throw new Error("Failed to send OTP")
      return await response.json()
    } catch (error) {
      console.error("OTP error:", error)
      throw error
    }
  }

  const handleSignup = async () => {
    if (!fullName || !email || !governorate || !city || !birthDate || !phone) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    const nameParts = fullName.trim().split(/\s+/).filter(p => p.length > 0)
    if (nameParts.length !== 4) {
      setErrorMessage("الرجاء إدخال الاسم الرباعي بالكامل (مثال: محمد أحمد عبدالله محمود)")
      return
    }

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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        firebaseUser = userCredential.user
      } else {
        firebaseUser = googleUserData
      }

      const userData = {
        uid:           firebaseUser.uid,
        fullName,
        email,
        governorate,
        city,
        birthDate,
        phone:         `${phone}`,
        code:          countryCode,
        authMethod:    isGoogleAuth ? "google" : "email",
        emailVerified: isGoogleAuth ? true : false,
      }

      await saveUserToDatabase(userData)

      sessionStorage.setItem("signupData", JSON.stringify({
        uid:          firebaseUser.uid,
        email:        email,
        fullName:     fullName,
        isGoogleAuth: isGoogleAuth,
        authMethod:   isGoogleAuth ? "google" : "email",
      }))

      if (isGoogleAuth) {
        router.push("/Onboarding/signup2")
      } else {
        await sendOTP(email)
        router.push("/Onboarding/otp-verification")
      }

    } catch (error) {
      console.error("Signup error:", error)
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("البريد الإلكتروني مستخدم بالفعل")
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("كلمة المرور ضعيفة، يجب أن تكون أقوى")
      } else if (error.code === "auth/invalid-email") {
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
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })

      const result = await signInWithPopup(auth, provider)
      const user   = result.user

      setEmail(user.email)
      setIsGoogleAuth(true)
      setGoogleUserData(user)

      const db       = getDatabase()
      const userRef  = ref(db, "users/" + user.uid)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        const existingUser = snapshot.val()
        if (existingUser.role !== "pending") {
          router.push("/dashboard")
          return
        }
      }

      setErrorMessage("تم استيراد بياناتك من جوجل. يرجى إكمال باقي الحقول.")

    } catch (error) {
      console.error("Google signup error:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setErrorMessage("تم إغلاق نافذة تسجيل الدخول")
      } else if (error.code === "auth/popup-blocked") {
        setErrorMessage("تم حظر النافذة المنبثقة، يرجى السماح بالنوافذ المنبثقة لهذا الموقع")
      } else {
        setErrorMessage("فشل إنشاء الحساب بواسطة جوجل")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex direction="column" minH="100vh" bg="#f7f9fc" _dark={{ bg: "gray.950" }}>
      <Flex direction="column" align="center" mt={6} px={4} pb={10}>

        <Image src="/Union.svg" alt="Union Logo" maxW="260px" mb={2} />

        <Box w="100%" maxW="600px">
          <Text color="#00A3E0" fontSize="lg" mb={8} textAlign="left">
            دايمًا في ضهرك خطوة بخطوة
          </Text>
        </Box>

        <Box bg="white" p={8} rounded="2xl" shadow="lg" w="100%" maxW="600px" _dark={{ bg: "gray.900" }}>
          <VStack spacing={6} align="stretch">

            {/* ERROR / SUCCESS MESSAGE */}
            {errorMessage && (
              <Box
                bg={errorMessage.includes("تم استيراد") ? "green.50" : "red.50"}
                color={errorMessage.includes("تم استيراد") ? "green.500" : "red.500"}
                p={3} rounded="md" fontSize="sm"
              >
                {errorMessage}
              </Box>
            )}

            {/* FULL NAME */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{ color: "white" }}>
                <MdPerson color="currentColor" size={20} style={{ marginRight: 8 }} />
                <Text fontWeight="medium" fontSize="sm">الاسم رباعي</Text>
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
                _placeholder={{ color: "#a0aec0" }}
                _dark={{ bg: "gray.800", color: "white", borderColor: "gray.700", _placeholder: { color: "gray.400" } }}
              />
            </Box>

            {/* EMAIL */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{ color: "white" }}>
                <MdEmail color="currentColor" size={20} style={{ marginRight: 8 }} />
                <Text fontWeight="medium" fontSize="sm">البريد الإلكتروني</Text>
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
                _placeholder={{ color: "#a0aec0" }}
                disabled={isGoogleAuth}
                readOnly={isGoogleAuth}
                _dark={{
                  bg: isGoogleAuth ? "gray.700" : "gray.800",
                  color: "white",
                  borderColor: "gray.700",
                  _placeholder: { color: "gray.400" },
                }}
              />
            </Box>

            {/* GOVERNORATE */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{ color: "white" }}>
                <MdLocationOn color="currentColor" size={20} style={{ marginRight: 8 }} />
                <Text fontWeight="medium" fontSize="sm">المحافظة</Text>
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
              <Flex align="center" mb={2} color="#000" _dark={{ color: "white" }}>
                <MdLocationOn color="currentColor" size={20} style={{ marginRight: 8 }} />
                <Text fontWeight="medium" fontSize="sm">المدينة</Text>
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
              <Flex align="center" mb={2} color="#000" _dark={{ color: "white" }}>
                <MdCalendarToday color="currentColor" size={20} style={{ marginRight: 8 }} />
                <Text fontWeight="medium" fontSize="sm">تاريخ الميلاد</Text>
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
                _dark={{ bg: "gray.800", color: "white", borderColor: "gray.700" }}
              />
            </Box>

            {/* PHONE */}
            <Box>
              <Flex align="center" mb={2} color="#000" _dark={{ color: "white" }}>
                <MdPhone color="currentColor" size={20} style={{ marginRight: 8 }} />
                <Text fontWeight="medium" fontSize="sm">رقم الهاتف</Text>
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
                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 15)
                    setPhone(digitsOnly)
                  }}
                  placeholder="1123456789"
                  color="#535353"
                  fontSize="sm"
                  borderColor="#e2e8f0"
                  _placeholder={{ color: "#a0aec0" }}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  _dark={{ bg: "gray.800", color: "white", borderColor: "gray.700", _placeholder: { color: "gray.400" } }}
                />
              </Flex>
            </Box>

            {/* PASSWORD - Hidden if Google Auth */}
            {!isGoogleAuth && (
              <>
                <Box>
                  <Flex align="center" mb={2} color="#000" _dark={{ color: "white" }}>
                    <MdLock color="currentColor" size={20} style={{ marginRight: 8 }} />
                    <Text fontWeight="medium" fontSize="sm">كلمة المرور</Text>
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
                      _placeholder={{ color: "#a0aec0" }}
                      _dark={{ bg: "gray.800", color: "white", borderColor: "gray.700", _placeholder: { color: "gray.400" } }}
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      left="12px"
                      transform="translateY(-50%)"
                      cursor="pointer"
                    >
                      {showPassword ? (
                        <MdVisibilityOff size={18} color="#718096" onClick={() => setShowPassword(false)} />
                      ) : (
                        <MdVisibility size={18} color="#718096" onClick={() => setShowPassword(true)} />
                      )}
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Flex align="center" mb={2} color="#000" _dark={{ color: "white" }}>
                    <MdLock color="currentColor" size={20} style={{ marginRight: 8 }} />
                    <Text fontWeight="medium" fontSize="sm">تأكيد كلمة المرور</Text>
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
                      _placeholder={{ color: "#a0aec0" }}
                      _dark={{ bg: "gray.800", color: "white", borderColor: "gray.700", _placeholder: { color: "gray.400" } }}
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      left="12px"
                      transform="translateY(-50%)"
                      cursor="pointer"
                    >
                      {showConfirmPassword ? (
                        <MdVisibilityOff size={18} color="#718096" onClick={() => setShowConfirmPassword(false)} />
                      ) : (
                        <MdVisibility size={18} color="#718096" onClick={() => setShowConfirmPassword(true)} />
                      )}
                    </Box>
                  </Box>
                </Box>
              </>
            )}

            {/* TERMS CHECKBOX */}
            <Box>
              <Flex alignItems="center" gap={2}>
                <Checkbox.Root
                  checked={agreeToTerms}
                  onCheckedChange={(e) => setAgreeToTerms(e.checked)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label color="#000" mr={2} _dark={{ color: "white" }}>
                    أوافق على الشروط والأحكام وسياسة الخصوصية
                    <Text
                      as="span"
                      color="#009EDB"
                      textDecoration="underline"
                      cursor="pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowTerms(true)
                      }}
                      _hover={{ color: "#0085bb" }}
                      fontSize="sm"
                      marginRight="10px"
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
              _hover={{ bg: "#0085bb" }}
              onClick={handleSignup}
              loading={loading}
              fontSize="md"
              fontWeight="bold"
              disabled={loading}
            >
              إنشاء حساب
            </Button>

            {/* DIVIDER */}
            {!isGoogleAuth && (
              <Flex align="center" justify="center" gap={4}>
                <Box flex="1" h="1px" bg="#e2e8f0" _dark={{ bg: "gray.700" }} />
                <Text color="#666" fontSize="sm" whiteSpace="nowrap" _dark={{ color: "gray.400" }}>
                  أو
                </Text>
                <Box flex="1" h="1px" bg="#e2e8f0" _dark={{ bg: "gray.700" }} />
              </Flex>
            )}

            {/* GOOGLE SIGNUP */}
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
                _hover={{ bg: "#f9f9f9" }}
                _active={{ bg: "#f1f1f1" }}
                transition="all 0.2s"
                onClick={handleGoogleSignup}
                cursor="pointer"
                disabled={loading}
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  _hover: { bg: "gray.700" },
                  _active: { bg: "gray.600" },
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <Text color="#333" fontWeight="medium" fontSize="sm" _dark={{ color: "white" }}>
                  التسجيل باستخدام جوجل
                </Text>
              </Flex>
            )}

          </VStack>
        </Box>

        {/* LOGIN LINK */}
        <Flex mt={8} justify="center" align="center" gap={2} fontSize="lg" fontWeight="bold">
          <Text color="#333" _dark={{ color: "gray.300" }}>عندك حساب بالفعل؟</Text>
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
        {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      </Flex>
    </Flex>
  )
}
