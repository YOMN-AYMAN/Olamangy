
"use client"

import Navbar from "@/components/ui/Navbar";
import { Box, SimpleGrid, Image, Text, Flex, Badge, Button, HStack } from "@chakra-ui/react";
import Link from "next/link";

const TeacherCard = ({ teacherId, name }) => (
    <Link href={`/developer/teacher/${teacherId}`} style={{ textDecoration: 'none' }}>
        <Box 
        bg="white" p={4} borderRadius="2xl" border="1px solid #E2E8F0" 
        cursor="pointer" _hover={{ shadow: "md", transform: "translateY(-2px)" }}
        transition="all 0.2s" dir="rtl"
        >
            <Flex align="center" gap={4}>
                <Image src="https://i.pravatar.cc/300?u=iu" borderRadius="full" boxSize="70px" objectFit="cover" />
                <Box flex="1">
                    <Text fontWeight="bold" fontSize="lg" color="#00A3E0">{name}</Text>
                    <Badge colorPalette="blue" variant="surface" mt={1} px={3}>مدرس اللغة العربية</Badge>
                </Box>
                <Text fontSize="sm" color="blue.400" fontWeight="bold">500 طالب</Text>
            </Flex>
        </Box>
    </Link>
);

export default function Teachers () {
    return (
        <>
            <Navbar />
            <Box p={4} dir="rtl">
            {/* الفلتر العلوي */}
            <HStack spacing={4} mb={5} overflowX="auto" pb={2}>
                <Button width={20} bg="red.400" borderRadius="xl" px={8}>الكل</Button>
                <Button width={20} variant="outline" borderRadius="xl">اللغة العربية</Button>
                <Button width={20} variant="outline" borderRadius="xl">اللغة الإنجليزية</Button>
                <Button width={20} variant="outline" borderRadius="xl">الرياضيات</Button>
                <Button width={20} bg="black.600" color="white" borderRadius="xl">المزيد</Button>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TeacherCard key={i} teacherId={i} name={`مدرس رقم ${i}`} />
                ))}
            </SimpleGrid>
            </Box>
        </>
    );
};

