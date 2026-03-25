"use client"
import {Flex, Image, Spacer, Text, HStack, Box} from "@chakra-ui/react"
import {ColorModeButton} from "./color-mode"
import Link from "next/link"
import {useAuth} from "@/providers/AuthContext"
import {useStudent} from "@/providers/studentProvider"
import {useTeacher} from "@/providers/teacherProvider"
import {useDeveloper} from "@/providers/developerProvider"

export default function Navbar() {
  const {user} = useAuth();
  const {studentProfile} = useStudent() || {};
  const {teacherProfile} = useTeacher() || {};
  const {developerProfile} = useDeveloper() || {};

  let profile = null;
  if (user?.role === "student") profile = studentProfile;
  else if (user?.role === "teacher") profile = teacherProfile;
  else if (user?.role === "admin" || user?.role === "developer") profile = developerProfile;

  return (
    <Flex
      as="nav"
      w="100%"
      h="70px"
      px={8}
      align="center"
      border="1px solid"
      borderColor="border.subtle"
      justify="space-between"
      bg="bg.panel"
      boxShadow="sm"
    >
      <Link href="/">
        <Image src="/Union.svg" alt="Logo" h="40px" />
      </Link>
      
      <Spacer />
      
      <HStack gap={4}>
        {profile && (
          <HStack gap={3}>
            <Text fontWeight="bold" display={{base: "none", md: "block"}}>
              {profile.fullName || profile.name}
            </Text>
            {profile.image || profile.profileImage ? (
              <Image 
                src={profile.image || profile.profileImage} 
                alt="Profile" 
                boxSize="40px" 
                borderRadius="full" 
                objectFit="cover" 
              />
            ) : (
              <Box 
                boxSize="40px" 
                borderRadius="full" 
                bg="blue.500" 
                color="white" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                fontWeight="bold"
              >
                {(profile.fullName || profile.name || "U")[0]}
              </Box>
            )}
          </HStack>
        )}
        <ColorModeButton />
      </HStack>
    </Flex>
  )
}
