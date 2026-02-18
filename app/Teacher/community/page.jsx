"use client"
import Navbar from "@/components/ui/Navbar";
import { Box, HStack, VStack, Text, Input, Avatar, Circle, Flex } from "@chakra-ui/react";

export default function StudentChat() {
  return (
    <>
    <Navbar/>
    <Flex h="85vh" dir="rtl" gap={4} p={4}>
      {/* قائمة الطلاب */}
      <VStack w="300px" bg="white" borderRadius="2xl" border="1px solid #E2E8F0" overflowY="auto" align="stretch" p={2}>
        {[1, 2, 3, 4].map((i) => (
          <HStack key={i} p={3} _hover={{ bg: "blue.50" }} cursor="pointer" borderRadius="xl">
            <Avatar.Root size="sm">
              <Avatar.Image src={`https://i.pravatar.cc/150?u=${i}`} />
              <Avatar.Fallback />
            </Avatar.Root>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="sm" fontWeight="bold">أحمد محمد</Text>
              <Text fontSize="xs" color="gray.500" truncate maxW="150px">مستر عندي سؤال في النحو...</Text>
            </VStack>
          </HStack>
        ))}
      </VStack>

      {/* منطقة الرسائل */}
      <Flex flex={1} bg="white" borderRadius="2xl" border="1px solid #E2E8F0" direction="column">
        <Box p={4} borderBottom="1px solid #E2E8F0">
          <Text fontWeight="bold">أحمد محمد</Text>
        </Box>
        <VStack flex={1} p={4} overflowY="auto" align="stretch" gap={4}>
          <Box bg="gray.100" p={3} borderRadius="lg" alignSelf="flex-start">يا مستر هو الدرس ده ملغي؟</Box>
          <Box bg="blue.500" color="white" p={3} borderRadius="lg" alignSelf="flex-end">لا يا حبيبي، ده أهم درس في المنهج</Box>
        </VStack>
        <Box p={4} borderTop="1px solid #E2E8F0">
          <Input placeholder="اكتب رسالتك..." borderRadius="full" bg="gray.50" />
        </Box>
      </Flex>
    </Flex>
    </>
  );
}