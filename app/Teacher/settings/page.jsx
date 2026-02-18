"use client"
import Navbar from "@/components/ui/Navbar";
import { Box, Input, VStack, SimpleGrid, Text, Button, Avatar, Flex, Icon, NativeSelect , HStack } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";

export default function SettingsPage() {
  return (
    <>
    <Navbar/>
    <Box p={6} dir="rtl" maxW="1000px" mx="auto">
      <Box bg="white" p={8} borderRadius="3xl" border="1px solid #E2E8F0" shadow="sm">
        <Flex justify="space-between" align="center" mb={10}>
          <HStack gap={4}>
            <Avatar.Root size="2xl" shape="rounded">
              <Avatar.Image src="https://i.pravatar.cc/300?u=iu" />
            </Avatar.Root>
            <Button bg="black" color="white" borderRadius="xl" px={6} _hover={{ bg: "gray.800" }}>تغيير الصورة</Button>
          </HStack>
          <HStack color="gray.600">
            <Text fontWeight="bold" fontSize="lg">تعديل بياناتك</Text>
            <Icon as={MdEdit} />
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} gapX={10} gapY={6}>
          <VStack align="flex-start" gap={1.5}>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">الاسم</Text>
            <Input defaultValue="محمود على" borderRadius="xl" border="1px solid #E2E8F0" h="50px" />
          </VStack>

          <VStack align="flex-start" gap={1.5}>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">رقم الهاتف</Text>
            <Input defaultValue="01023456789" borderRadius="xl" border="1px solid #E2E8F0"  h="50px" />
          </VStack>

          <VStack align="flex-start" gap={1.5} gridColumn="span 2">
            <Text fontSize="sm" fontWeight="medium" color="gray.500">الايميل</Text>
            <Input defaultValue="hirata@gmail.com" readOnly borderRadius="xl" border="1px solid #FFBDD2" bg="gray.50" h="50px" />
          </VStack>

          <VStack align="flex-start" gap={1.5}>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">المراحل الدراسية</Text>
            <Input defaultValue="الثانوي" borderRadius="xl" h="50px" />
          </VStack>

          <VStack align="flex-start" gap={1.5}>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">المواد</Text>
            <Input defaultValue="اللغة العربية" borderRadius="xl" h="50px" />
          </VStack>
        </SimpleGrid>
      </Box>
    </Box>
    </>
  );
}