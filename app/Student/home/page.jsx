<<<<<<< HEAD
"use client"
import { Box, SimpleGrid, Image, Text, VStack, HStack, Avatar, Badge, Container, Heading , Flex} from "@chakra-ui/react";

export default function StudentHome() {
    const courses = [1, 2]; 
    const teachers = [1, 2];  
    const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png";


    return (
        <Box dir="rtl" minH="100vh" p={{ base: 4, md: 8 }}>
        <Container>
            
            <Heading size="md" mb={6} color="gray.700">تحب تكمل؟</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6} mb={10}>
            {courses.map((i) => (
                <Box key={i} bg="white" borderRadius="2xl" overflow="hidden" shadow="sm" border="1px solid #E2E8F0">
                <Box position="relative">
                    <Image src={lessonImage} alt="كيمياء" w="100%" />
                    <Badge position="absolute" top={3} left={3} bg="white/80" borderRadius="full" px={2}>
                    350 مشاهدة
                    </Badge>
                </Box>
                <VStack align="flex-start" p={4} gap={1}>
                    <Text fontWeight="bold" fontSize="sm" lineHeight="tall">
                    الكيمياء العضوية | الدرس الأول: الكحولات - ثانوية عامة
                    </Text>
                </VStack>
                </Box>
            ))}
            </SimpleGrid>

            <Heading size="md" mb={6} color="gray.700">مدرس جديد</Heading>
            <Box bg="white" p={4} borderRadius="2xl" border="1px solid #009EDB" mb={10}>
            <Flex justify="space-between" align="center" direction={{ base: "column", sm: "row" }} gap={4}>
                <HStack gap={4}>
                    <Avatar.Root size="2xl">
                        <Avatar.Image src="https://i.pravatar.cc/300?u=2" />
                    </Avatar.Root>
                    <VStack align="flex-end" gap={0}>
                        <Text fontWeight="bold" color="#009EDB" fontSize="xl">م/ فؤاد حسن</Text>
                        <Badge bg="#009EDB" color="white" borderRadius="md" px={4}>مدرس  الكيمياء</Badge>
                    </VStack>
                </HStack>
                <Text color="#009EDB" fontWeight="bold">500 طالب</Text>
            </Flex>
            </Box>

            <Heading size="md" mb={6} color="gray.700">مدرسينك</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {teachers.map((i) => (
                <Box key={i} bg="white" p={4} borderRadius="2xl" border="1px solid #009EDB">
                <Flex justify="space-between" align="center">
                    <HStack gap={4}>
                        <Avatar.Root size="xl">
                            <Avatar.Image src="https://i.pravatar.cc/300?u=2" />
                        </Avatar.Root>
                        <VStack align="flex-end" gap={0}>
                            <Text fontWeight="bold" color="#009EDB" fontSize="lg">م/ محمد على</Text>
                            <Badge bg="#009EDB" color="white" borderRadius="md" px={3}>مدرس اللغة العربية</Badge>
                        </VStack>
                    </HStack>
                    <Text color="#009EDB" fontWeight="bold">500 طالب</Text>
                </Flex>
                </Box>
            ))}
            </SimpleGrid>

        </Container>
        </Box>
    );
}
=======
import React from 'react'

function Home() {
    return (
        <div>Hokkkkkkkkkkkkkkkme</div>
    )
}

export default Home
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
