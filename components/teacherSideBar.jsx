
"use client"
import { Box, VStack, Text, Stack, HStack, Avatar, Icon } from "@chakra-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation" 
import { motion } from "framer-motion" 
import { 
    MdDashboard, 
    MdPlayCircleOutline, 
    MdCardMembership, 
    MdHowToReg, 
    MdPeopleOutline, 
    MdForum, 
    MdSupportAgent, 
    MdSettings ,
    MdLogout
} from "react-icons/md";

const MotionBox = motion(Box)

function TeacherSideBar() {
    const pathname = usePathname()
    const imagePath = "/30175cee-8911-4d80-937d-9c90cc5e9f94.jpg"
    
    const users = [
        {
            id: "1",
            name: "محمود على",
            avatar: "https://i.pravatar.cc/300?u=iu",
        },
    ]

const navLinks = [
    { name: "الرئيسية", href: "/Teacher/home", icon: MdDashboard },
    { name: "الفيديوهات", href: "/Teacher/videos", icon: MdPlayCircleOutline },
    { name: "الاشتراكات", href: "/Teacher/subscription", icon: MdCardMembership },
    { name: "الحضور و الغياب", href: "/Teacher/attendanceAndAbsence", icon: MdHowToReg },
    { name: "الطلاب", href: "/Teacher/students", icon: MdPeopleOutline },
    { name: "المجتمع", href: "/Teacher/community", icon: MdForum },
    { name: "الدعم الفنى", href: "/Teacher/tichnicalSupport", icon: MdSupportAgent },
    { name: "الاعدادات", href: "/Teacher/settings", icon: MdSettings },
];

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
            <VStack h="100%" py={5} justify="space-between" align="stretch">
                
                <Box px={5} mt={5}>
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

                <VStack align="stretch" mt={5} position="relative">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                <Box position="relative" pr={8} pl={0} py={2}>
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

                {/* 3. زر الخروج السفلي */}
                <Box px={5}>
                    <HStack 
                        as="button"
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
                        <Link href="/Onboarding/login">
                            <Text fontWeight="bold">خروج</Text>
                        </Link>
                    </HStack>
                </Box>

            </VStack>
        </Box>
    )
}

export default TeacherSideBar