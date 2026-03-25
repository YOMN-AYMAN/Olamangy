"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthContext"
import { Box, Spinner, Center, Text } from "@chakra-ui/react"

export default function NotFound() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in -> go to landing/main page
        router.replace("/")
      } else {
        // Logged in -> go to respective home based on role
        if (user.role === "teacher") {
          router.replace("/Teacher/home")
        } else if (user.role === "student") {
          router.replace("/Student/home")
        } else if (user.role === "admin" || user.role === "developer") {
          router.replace("/developer/teacher")
        } else {
          router.replace("/")
        }
      }
    }
  }, [user, loading, router])

  return (
    <Center h="100vh" bg="bg.canvas">
      <Box textAlign="center">
        <Spinner size="xl" color="blue.500" mb={4} />
        <Text fontSize="lg" fontWeight="medium">جاري توجيهك للمكان الصحيح...</Text>
      </Box>
    </Center>
  )
}
