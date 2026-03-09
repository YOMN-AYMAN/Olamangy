"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/auth/firebase"
import { sendPasswordResetEmail } from "firebase/auth"

import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"

import { MdEmail, MdArrowBack } from "react-icons/md"
import Navbar from "@/components/ui/Navbar"

export default function ForgotPasswordPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني")
      return
    }

    setLoading(true)
    setErrorMessage("")
    setMessage("")

    try {
      await sendPasswordResetEmail(auth, email)
      
      setEmailSent(true)
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني")
      
    } catch (error) {
      console.error("Password reset error:", error)
      
      if (error.code === 'auth/user-not-found') {
        setErrorMessage("لا يوجد حساب مرتبط بهذا البريد الإلكتروني")
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage("البريد الإلكتروني غير صالح")
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage("تم إرسال طلبات كثيرة، يرجى المحاولة لاحقاً")
      } else {
        setErrorMessage("حدث خطأ أثناء إرسال رابط إعادة التعيين")
      }
    } finally {
      setLoading(false)
    }
  }
   return (
    <Flex direction="column" minH="100vh" bg="#f7f9fc" _dark={{bg: "gray.950"}}>

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
        <Box bg="white" p={10} rounded="2xl" shadow="lg" w="100%" maxW="600px" _dark={{bg: "gray.900"}}>
          <VStack spacing={6} align="stretch">

            {/* Back Button */}
            <Flex justify="flex-start">
              <Button
                variant="ghost"
                leftIcon={<MdArrowBack />}
                onClick={() => router.push("/Onboarding/login")}
                color="gray.600"
                _hover={{ color: "#009EDB" }}
                _dark={{color: "gray.400", _hover: {color: "#009EDB"}}}
              >
                العودة لتسجيل الدخول
              </Button>
            </Flex>

            {/* Title */}
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="#000" _dark={{color: "white"}}>
              استعادة كلمة المرور
            </Text>

            {/* Description */}
            <Text textAlign="center" color="gray.600" fontSize="sm" _dark={{color: "gray.400"}}>
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
            </Text>

            {/* Success Message */}
            {emailSent && (
              <Box bg="green.50" color="green.600" p={4} rounded="md" textAlign="center" _dark={{bg: "green.900", color: "green.200"}}>
                <Text fontWeight="medium">{message}</Text>
                <Text fontSize="sm" mt={2}>
                  يرجى التحقق من بريدك الإلكتروني (بما في ذلك مجلد الرسائل غير المرغوب فيها)
                </Text>
              </Box>
            )}

            {/* Error Message */}
            {errorMessage && (
              <Box bg="red.50" color="red.500" p={3} rounded="md" _dark={{bg: "red.900", color: "red.200"}}>
                {errorMessage}
              </Box>
            )}

            {/* Email Input - Hidden if email already sent */}
            {!emailSent && (
              <Box>
                <Flex align="center" mb={1} color="#000" _dark={{color: "white"}}>
                  <MdEmail color="currentColor" size={24} style={{ marginRight: 6 }} />
                  <Text fontWeight="medium">البريد الإلكتروني</Text>
                </Flex>
                <Input
                  bg="white"
                  rounded="lg"
                  px={4}
                  py={3}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  color="#535353"
                  _dark={{
                    bg: "gray.800",
                    color: "white",
                    borderColor: "gray.700",
                    _placeholder: {color: "gray.400"}
                  }}
                />
              </Box>
            )}

            {/* Submit Button */}
            {!emailSent ? (
              <Button
                bg="#009EDB"
                color="white"
                size="lg"
                rounded="xl"
                _hover={{ bg: "#0085bb" }}
                onClick={handleResetPassword}
                loading={loading}
                disabled={loading}
              >
                إرسال رابط إعادة التعيين
              </Button>
            ) : (
              <Button
                bg="#009EDB"
                color="white"
                size="lg"
                rounded="xl"
                _hover={{ bg: "#0085bb" }}
                onClick={() => router.push("/Onboarding/login")}
              >
                العودة لتسجيل الدخول
              </Button>
            )}

            {/* Resend Option */}
            {emailSent && (
              <Text textAlign="center" fontSize="sm" color="gray.600" _dark={{color: "gray.400"}}>
                لم تستلم البريد؟{" "}
                <Text
                  as="span"
                  color="#009EDB"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => {
                    setEmailSent(false)
                    setMessage("")
                    setErrorMessage("")
                  }}
                  _hover={{ color: "#0085bb" }}
                >
                  إعادة المحاولة
                </Text>
              </Text>
            )}

          </VStack>
        </Box>

      </Flex>
    </Flex>
  )
}