

"use client"
import {Box, VStack, Text, Stack, HStack, Avatar, Icon} from "@chakra-ui/react"
import Link from "next/link"
import {usePathname, useRouter} from "next/navigation"
import {motion} from "framer-motion"
import {MdOutlinePeople, MdOutlineSettings, MdLogout, MdSchool} from "react-icons/md"
import {auth} from "@/auth/firebase"
import {signOut} from "firebase/auth"
import {Tooltip} from "@/components/ui/tooltip"
import {useBreakpointValue} from "@chakra-ui/react"
import {ColorModeButton} from "@/components/ui/color-mode"

const MotionBox = motion(Box)

function DeveSideBar() {
  const pathname = usePathname()
  const router = useRouter()
  const imagePath = "/30175cee-8911-4d80-937d-9c90cc5e9f94.jpg"
  const isMini = useBreakpointValue({base: true, md: false})

  const users = [
    {
      id: "1",
      name: "محمود على",
      avatar: "https://i.pravatar.cc/300?u=iu",
    },
  ]

  const navLinks = [
    {name: "المدرسين", href: "/developer/teacher", icon: MdSchool},
    {name: "الطلاب", href: "/developer/students", icon: MdOutlinePeople},
    {name: "الاعدادات", href: "/developer/settings", icon: MdOutlineSettings},
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/Onboarding/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <Box
      as="aside"
      w={{base: "85px", md: "20%"}}
      h="100vh"
      position="fixed"
      right="0"
      top="0"
      zIndex="10"
      backgroundImage={`linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${imagePath})`}
      backgroundSize="cover"
      backgroundPosition="center"
      color="white"
      borderRadius="30px 0 0 30px"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <VStack h="100%" py={10} justify="space-between" align="stretch">

        <Box px={{base: 2, md: 5}}>
          <Stack
            background="white"
            borderRadius="15px"
            p={3}
            color="black"
            w="100%"
            align="center"
          >
            {users.map((user) => (
              <HStack key={user.id} gap="3" justify="center">
                <Avatar.Root size={isMini ? "sm" : "md"}>
                  <Avatar.Image src={user.avatar} />
                </Avatar.Root>

                {!isMini && (
                  <Stack gap="0" align="flex-start">
                    <Text fontSize="xs">أهلا</Text>
                    <Text fontWeight="bold" fontSize="sm" color="fg.muted" whiteSpace="nowrap">
                      {user.name}
                    </Text>
                  </Stack>
                )}
              </HStack>
            ))}
          </Stack>
        </Box>

        <VStack gap={6} align="stretch" mt={10} position="relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Tooltip
                key={link.href}
                content={link.name}
                side="left"
                disabled={!isMini}
              >
                <Link href={link.href} style={{textDecoration: 'none'}}>
                  <Box position="relative" pr={{base: 0, md: 8}} py={4} display="flex" justifyContent="center">
                    {isActive && (
                      <MotionBox
                        layoutId="activeNav"
                        position="absolute"
                        insetY={0}
                        left={0}
                        right={0}
                        bg="#ffffff"
                        borderRadius={{base: "0 15px 15px 0", md: "0 50px 50px 0"}}
                        zIndex={0}
                        transition={{type: "spring", stiffness: 300, damping: 30}}
                      />
                    )}

                    <HStack
                      position="relative"
                      zIndex={1}
                      color={isActive ? "black" : "white"}
                      justify={{base: "center", md: "flex-start"}}
                      gap={4}
                      w="100%"
                    >
                      <Icon as={link.icon} boxSize={6} />
                      {!isMini && (
                        <Text fontWeight={isActive ? "bold" : "medium"} fontSize="lg" whiteSpace="nowrap">
                          {link.name}
                        </Text>
                      )}
                    </HStack>
                  </Box>
                </Link>
              </Tooltip>
            )
          })}
        </VStack>

        <Box px={{base: 2, md: 5}}>
          <HStack justify="center" mb={4}>
            <ColorModeButton bg="white" color="black" _hover={{bg: "gray.100"}} borderRadius="full" />
          </HStack>
          <Tooltip content="خروج" side="left" disabled={!isMini}>
            <HStack
              as="button"
              onClick={handleLogout}
              w="100%"
              bg="white"
              color="black"
              p={4}
              borderRadius="20px"
              justify="center"
              gap={3}
              _hover={{bg: "gray.100", transform: "scale(1.05)"}}
              transition="all 0.2s"
            >
              <Icon as={MdLogout} boxSize={5} />
              {!isMini && <Text fontWeight="bold">خروج</Text>}
            </HStack>
          </Tooltip>
        </Box>

      </VStack>
    </Box>
  )
}

export default DeveSideBar