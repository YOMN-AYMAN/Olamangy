"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  HStack,
  Input, // Use Input instead of PinInput for simplicity
} from "@chakra-ui/react"
import { MdEmail, MdRefresh } from "react-icons/md"
import Navbar from "@/components/ui/Navbar"

// Simple toast implementation without Chakra UI toaster
const useSimpleToast = () => {
  const [toasts, setToasts] = useState([])

  const create = ({ title, description, type = "info" }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, title, description, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const ToastComponent = () => (
    <Box position="fixed" top="20px" right="20px" zIndex={9999}>
      {toasts.map(toast => (
        <Box
          key={toast.id}
          bg={toast.type === "success" ? "green.500" : toast.type === "error" ? "red.500" : "blue.500"}
          color="white"
          p={4}
          mb={2}
          rounded="md"
          shadow="lg"
        >
          <Text fontWeight="bold">{toast.title}</Text>
          <Text fontSize="sm">{toast.description}</Text>
        </Box>
      ))}
    </Box>
  )

  return { create, ToastComponent }
}

export default function OTPVerification() {
  const router = useRouter()
  const { create: toast, ToastComponent } = useSimpleToast()
  
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [signupData, setSignupData] = useState(null)
  
  const countdownRef = useRef(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('signupData')
    if (!stored) {
      router.push("/Onboarding/signup1")
      return
    }
    
    const data = JSON.parse(stored)
    setSignupData(data)
    sendOTP(data.email)

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const sendOTP = async (email) => {
    try {
      const response = await fetch('https://backend-dolphin.vercel.app/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          expiresIn: 600
        }),
      })

      if (!response.ok) throw new Error('Failed to send OTP')
      
      toast({
        title: "تم إرسال الرمز",
        description: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال رمز التحقق",
        type: "error",
      })
    }
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال الرمز كاملاً",
        type: "error",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://backend-dolphin.vercel.app/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData.email,
          otp: otp,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Invalid OTP')
      }

      toast({
        title: "تم التحقق بنجاح",
        description: "تم التحقق من بريدك الإلكتروني بنجاح",
        type: "success",
      })

      router.push("/Onboarding/signup2")

    } catch (error) {
      toast({
        title: "رمز غير صحيح",
        description: "الرمز الذي أدخلته غير صحيح أو منتهي الصلاحية",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    
    setResendLoading(true)
    await sendOTP(signupData.email)
    setResendLoading(false)
    
    setCanResend(false)
    setCountdown(60)
    
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!signupData) return null

  return (
    <Flex direction="column" minH="100vh" bg="#f7f9fc">
      <ToastComponent />
      
      <Flex flex={1} align="center" justify="center" p={4}>
        <Box bg="white" p={8} rounded="2xl" shadow="lg" w="100%" maxW="500px">
          <VStack spacing={6} align="center">
            
            <Box bg="blue.50" p={4} rounded="full">
              <MdEmail size={48} color="#009EDB" />
            </Box>

            <Text fontSize="2xl" fontWeight="bold" color="#000">
              التحقق من البريد الإلكتروني
            </Text>

            <Text color="gray.600" textAlign="center">
              تم إرسال رمز التحقق المكون من 6 أرقام إلى
              <br />
              <Text as="span" fontWeight="bold" color="#009EDB">
                {signupData.email}
              </Text>
            </Text>

            <Box w="100%">
              <Text mb={4} textAlign="center" fontWeight="medium">
                أدخل رمز التحقق
              </Text>
              
              <Flex justify="center">
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  textAlign="center"
                  fontSize="2xl"
                  letterSpacing="8px"
                  maxLength={6}
                  w="200px"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </Flex>
            </Box>

            <Button
              w="100%"
              bg="#009EDB"
              color="white"
              size="lg"
              rounded="xl"
              _hover={{ bg: "#0085bb" }}
              onClick={handleVerify}
              loading={loading}
              disabled={otp.length !== 6 || loading}
            >
              تحقق
            </Button>

            <HStack spacing={2} color="gray.500">
              <MdRefresh />
              <Text>
                إعادة إرسال الرمز بعد {formatTime(countdown)}
              </Text>
            </HStack>

            <Button
              variant="ghost"
              color="#009EDB"
              onClick={handleResend}
              disabled={!canResend || resendLoading}
              loading={resendLoading}
            >
              إعادة إرسال الرمز الآن
            </Button>

          </VStack>
        </Box>
      </Flex>
    </Flex>
  )
}