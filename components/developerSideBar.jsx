"use client"
import { Box, VStack, Text, Stack, HStack, Avatar, Icon } from "@chakra-ui/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" 
import { motion } from "framer-motion" 
import { MdOutlinePeople, MdOutlineSettings, MdLogout, MdSchool } from "react-icons/md"
import { auth } from "@/auth/firebase"
import { getAuth, signOut } from "firebase/auth"

const MotionBox = motion(Box)

function DeveSideBar() {
    const pathname = usePathname()
    const router = useRouter()
    const imagePath = "/30175cee-8911-4d80-937d-9c90cc5e9f94.jpg"
    
    const users = [
        {
            id: "1",
            name: "محمود على",
            avatar: "https://i.pravatar.cc/300?u=iu ",
        },
    ]

    const navLinks = [
        { name: "المدرسين", href: "/developer/teacher", icon: MdSchool },
        { name: "الطلاب", href: "/developer/students", icon: MdOutlinePeople },
        { name: "الاعدادات", href: "/developer/settings", icon: MdOutlineSettings },
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
            w="20%" 
            h="100vh"
            position="fixed"
            right="0"
            top="0"
            zIndex="10"
            backgroundImage={`linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${imagePath})`}
            backgroundSize="cover"
            backgroundPosition="center"
            color="white"
            dir="rtl"
            borderRadius="30px 0 0 30px"
        >
            <VStack h="100%" py={10} justify="space-between" align="stretch">
                
                <Box px={5}>
                    <Stack
                        background="white"
                        borderRadius="15px"
                        p={3}
                        color="black"
                        w="100%"
                    >
                        {users.map((user) => (
                            <HStack key={user.id} gap="3" justify="flex-start">
                                <Avatar.Root size="md">
                                    <Avatar.Image src={user.avatar} />
                                </Avatar.Root>
                                <Stack gap="0" align="flex-start">
                                    <Text fontSize="medium">أهلا</Text>
                                    <HStack gap={1}>
                                        <Text fontWeight="bold" fontSize="medium" color="fg.muted">محمود على</Text>
                                    </HStack>
                                </Stack>
                            </HStack>
                        ))}
                    </Stack>
                </Box>

                <VStack gap={6} align="stretch" mt={10} position="relative">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                <Box position="relative" pr={8} pl={0} py={4}>
                                    {isActive && (
                                        <MotionBox
                                            layoutId="activeNav"
                                            position="absolute"
                                            insetY={0}
                                            left={0}
                                            right={0}
                                            bg="#ffffff"
                                            borderRadius="0 50px 50px 0"
                                            zIndex={0}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    
                                    <HStack 
                                        position="relative" 
                                        zIndex={1} 
                                        color={isActive ? "black" : "white"}
                                        justify="flex-start"
                                        gap={4}
                                    >
                                        <Icon as={link.icon} boxSize={6} />
                                        <Text fontWeight={isActive ? "bold" : "medium"} fontSize="lg">
                                            {link.name}
                                        </Text>
                                    </HStack>
                                </Box>
                            </Link>
                        )
                    })}
                </VStack>

                {/* Sign Out Button */}
                <Box px={5}>
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
                        _hover={{ bg: "gray.100", transform: "scale(1.02)" }}
                        transition="all 0.2s"
                    >
                        <Icon as={MdLogout} boxSize={5} />
                        <Text fontWeight="bold">خروج</Text>
                    </HStack>
                </Box>

            </VStack>
        </Box>
    )
}

export default DeveSideBar