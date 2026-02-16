"use client"
import Link from "next/link";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/auth/firebase" 
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth" 
import { rtdb } from "@/auth/firebase" 
import { ref, get } from "firebase/database" 

import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  VStack,
  Separator,
} from "@chakra-ui/react"

import { 
  MdEmail, 
  MdLock, 
  MdVisibility, 
  MdVisibilityOff 
} from "react-icons/md"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Check if user exists in database and get their role/status
  const checkUserInDatabase = async (uid) => {
  try {
    const userRef = ref(rtdb, 'users/' + uid)
    const snapshot = await get(userRef)
    
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null // User not found
  } catch (error) {
    console.error('Database check error:', error)
    throw error
  }
}

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      const dbUser = await checkUserInDatabase(firebaseUser.uid)

      if (!dbUser) {
        await auth.signOut()
        setErrorMessage("الحساب غير مكتمل، يرجى إتمام التسجيل")
        router.push("/Onboarding/signup1")
        return
      }

      if (dbUser.role === 'pending') {
        await auth.signOut()
        setErrorMessage("يرجى إكمال بياناتك أولاً")
        sessionStorage.setItem('signupData', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: dbUser.fullName || ""
        }))
        router.push("/Onboarding/signup2")
        return
      }

      if (dbUser.role === 'pending' && userType === 'teacher') {
        await auth.signOut()
        setErrorMessage("حسابك قيد المراجعة، سيتم إخطارك عندما يتم تفعيله")
        return
      }

      if (dbUser.role === 'admin') {
        router.push("/developer/teacher")
        return
      }

      router.push("/Onboarding/mainPage")

    } catch (error) {
      console.error("Login error:", error)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMessage("بيانات الدخول غير صحيحة")
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage("تم حظر الحساب مؤقتاً بسبب محاولات متكررة، يرجى المحاولة لاحقاً")
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMessage("بيانات الدخول غير صحيحة")
      } else {
        setErrorMessage("حدث خطأ أثناء تسجيل الدخول")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setErrorMessage("")

    try {
      const provider = new GoogleAuthProvider();
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      const dbUser = await checkUserInDatabase(firebaseUser.uid)

      if (!dbUser) {
        sessionStorage.setItem('googleAuthData', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email
        }))
        
        router.push("/Onboarding/signup1")
        return
      }

      if (dbUser.role !== 'pending' && dbUser.signupStep === 'completed') {
        if (dbUser.role === 'admin') {
    router.push("/developer/teacher")
    return
  }
  router.push("/Onboarding/mainPage")
  return
}

      if (dbUser.role === 'pending' || dbUser.signupStep !== 'completed') {
        sessionStorage.setItem('signupData', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: dbUser.fullName || firebaseUser.displayName || ""
        }))
        
        router.push("/Onboarding/signup2")
        return
      }

      router.push("/Onboarding/mainPage")

    } catch (error) {
      console.error("Google login error:", error)
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage("تم إغلاق نافذة تسجيل الدخول")
      } else if (error.code === 'auth/popup-blocked') {
        setErrorMessage("تم حظر النافذة المنبثقة، يرجى السماح بالنوافذ المنبثقة لهذا الموقع")
      } else if (error.code === 'auth/cancelled-popup-request') {
        setErrorMessage("تم إلغاء طلب تسجيل الدخول")
      } else if (error.code === 'auth/network-request-failed') {
        setErrorMessage("خطأ في الاتصال بالشبكة")
      } else {
        setErrorMessage("فشل تسجيل الدخول بواسطة جوجل")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex direction="column" minH="100vh" bg="#f7f9fc">

      <Flex direction="column" align="center" mt={10} px={4}>

        {/* LOGO */}
        <Image src="/Union.svg" alt="Union Logo" maxW="260px" mb={2} />

        {/* Slogan */}
        <Box w="100%" maxW="600px">
          <Text color="#00A3E0" fontSize="lg" mb={6} textAlign="left">
            دايمًا في ضهرك خطوة بخطوة
          </Text>
        </Box>

        {/* CARD */}
        <Box bg="white" p={10} rounded="2xl" shadow="lg" w="100%" maxW="600px">
          <VStack spacing={6} align="stretch">

            {errorMessage && (
              <Box bg="red.50" color="red.500" p={3} rounded="md">
                {errorMessage}
              </Box>
            )}

            {/* EMAIL */}
            <Box>
              <Flex align="center" mb={1}>
                <MdEmail color="#000" size={24} style={{ marginRight: 6 }} />
                <Text fontWeight="medium" color="#000">البريد الإلكتروني</Text>
              </Flex>
              <Input
                bg="white"
                rounded="lg"
                px={4}
                py={3}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                color="#535353b4"
              />
            </Box>

            <Box>
              <Flex align="center" mb={1}>
                <MdLock color="#000" size={24} style={{ marginRight: 6 }} />
                <Text fontWeight="medium" color="#000">كلمة المرور</Text>
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
                  color="#535353b4"
                   placeholder="********"
                   _placeholder={{ color: "#a0aec0" }}
                />
                <Box
                  position="absolute"
                  top="50%"
                  left="12px"
                  transform="translateY(-50%)"
                  cursor="pointer"
                >
                  {showPassword
                    ? <MdVisibilityOff size={20} color="#aaa9a9" onClick={() => setShowPassword(false)} />
                    : <MdVisibility size={20} color="#aaa9a9" onClick={() => setShowPassword(true)} />}
                </Box>
              </Box>
            </Box>

            {/* Forgot Password with underline - Links to new page */}
            <Link href="/Onboarding/forgot-password" passHref>
              <Text 
                textAlign="right" 
                color="#009EDB" 
                fontSize="sm" 
                cursor="pointer"
                textDecoration="underline"
                textUnderlineOffset="3px"
                _hover={{ color: "#0085bb" }}
                transition="color 0.2s"
              >
                نسيت كلمة السر؟
              </Text>
            </Link>

            {/* LOGIN BUTTON */}
            <Button
              bg="#009EDB"
              color="white"
              size="lg"
              rounded="xl"
              _hover={{ bg: "#0085bb" }}
              onClick={handleLogin}
              loading={loading}
              disabled={loading}
            >
              تسجيل الدخول
            </Button>

            <Flex align="center" justify="center" gap={4}>
              <Separator flex="1" />
              <Text color="#666" fontSize="sm" whiteSpace="nowrap">
                أو
              </Text>
              <Separator flex="1" />
            </Flex>

            {/* CUSTOM GOOGLE BUTTON */}
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
              onClick={handleGoogleLogin}
              cursor="pointer"
              disabled={loading}
            >
             
              <Text color="#333" fontWeight="medium">
                تسجيل الدخول باستخدام جوجل
              </Text>
               {/* Google SVG Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Flex>

          </VStack>
        </Box>

        {/* SIGN UP */}
        <Flex mt={8} justify="center" align="center" gap={2} fontSize="lg" fontWeight="bold">
          <Text color="#333">
            لا تمتلك حساب بعد؟
          </Text>

    <Link href="/Onboarding/signup1">
  <Text
    color="#ff3b5c"
    cursor="pointer"
    borderBottom="3px solid #ff3b5c"
  >
    إنشاء حساب جديد
  </Text>
</Link>


        </Flex>

      </Flex>
    </Flex>
  )
}