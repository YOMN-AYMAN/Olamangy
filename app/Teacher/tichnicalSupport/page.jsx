

"use client"
import {Box, VStack, Text, Flex, Icon, Collapsible, HStack} from "@chakra-ui/react";
import {MdKeyboardArrowUp, MdKeyboardArrowDown, MdSupportAgent, MdOutlineShield, MdGavel} from "react-icons/md";
import {FaWhatsapp, FaEnvelope} from "react-icons/fa";

export default function TechnicalSupport() {
  return (
    <>
      <Box p={6} maxW="900px" mx="auto" dir="rtl">

        {/* 1. كولابس تواصل معنا - يضم الواتساب والايميل */}
        <Collapsible.Root defaultOpen>
          <Box borderRadius="xl" overflow="hidden" border="1px solid #E2E8F0" bg="white" shadow="sm" mb={4}>
            <Collapsible.Trigger asChild>
              <Flex
                bg="gray.600"
                p={4}
                color="white"
                justify="space-between" // ده اللي بيخلي الكلام يمين والسهم شمال
                align="center"
                cursor="pointer"
              >
                <HStack gap={3}>
                  <Icon as={MdSupportAgent} fontSize="xl" />
                  <Text fontWeight="bold">تواصل معنا</Text>
                </HStack>
                <Collapsible.Context>
                  {(context) => (
                    <Icon as={context.open ? MdKeyboardArrowUp : MdKeyboardArrowDown} fontSize="24px" />
                  )}
                </Collapsible.Context>
              </Flex>
            </Collapsible.Trigger>

            <Collapsible.Content>
              <Box p={4} bg="gray.50">
                {/* زرار واتساب */}
                <Box
                  borderRadius="xl"
                  dir="ltr"
                  p={4}
                  bg="#25D366"
                  mb={3}
                  cursor="pointer"
                  shadow="sm"
                  _hover={{opacity: 0.9}}
                >
                  <HStack justify="space-between" color="white">
                    <HStack gap={3}>
                      <Icon as={FaWhatsapp} fontSize="xl" />
                      <Text fontWeight="bold">Whatsapp</Text>
                    </HStack>
                  </HStack>
                </Box>

                {/* زرار الإيميل */}
                <Box
                  borderRadius="xl"
                  dir="ltr"
                  p={4}
                  border="1px solid #E2E8F0"
                  bg="white"
                  cursor="pointer"
                  shadow="sm"
                  _hover={{bg: "gray.50"}}
                >
                  <HStack gap={3}>
                    <Icon as={FaEnvelope} fontSize="xl" color="orange.500" />
                    <Text fontWeight="bold" color="#E53E3E">Email</Text>
                  </HStack>
                </Box>
              </Box>
            </Collapsible.Content>
          </Box>
        </Collapsible.Root>

        {/* 2. كولابس سياسة الخصوصية */}
        <Collapsible.Root>
          <Box borderRadius="xl" overflow="hidden" border="1px solid #E2E8F0" bg="white" shadow="sm" mb={4}>
            <Collapsible.Trigger asChild>
              <Flex
                bg="gray.50"
                p={4}
                color="gray.700"
                justify="space-between"
                align="center"
                cursor="pointer"
                borderBottom="1px solid #E2E8F0"
              >
                <HStack gap={3}>
                  <Icon as={MdOutlineShield} color="gray.600" fontSize="xl" />
                  <Text fontWeight="bold">سياسة الخصوصية</Text>
                </HStack>
                <Collapsible.Context>
                  {(context) => (
                    <Icon as={context.open ? MdKeyboardArrowUp : MdKeyboardArrowDown} fontSize="24px" color="gray.400" />
                  )}
                </Collapsible.Context>
              </Flex>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Box p={4} bg="white">
                <Text fontSize="sm" color="gray.600" lineHeight="tall">
                  سياسة الخصوصية..
                </Text>
              </Box>
            </Collapsible.Content>
          </Box>
        </Collapsible.Root>

        {/* 3. كولابس شروط الخدمة */}
        <Collapsible.Root>
          <Box borderRadius="xl" overflow="hidden" border="1px solid #E2E8F0" bg="white" shadow="sm">
            <Collapsible.Trigger asChild>
              <Flex
                bg="gray.50"
                p={4}
                color="gray.700"
                justify="space-between"
                align="center"
                cursor="pointer"
                borderBottom="1px solid #E2E8F0"
              >
                <HStack gap={3}>
                  <Icon as={MdGavel} color="gray.600" fontSize="xl" />
                  <Text fontWeight="bold">شروط الخدمة</Text>
                </HStack>
                <Collapsible.Context>
                  {(context) => (
                    <Icon as={context.open ? MdKeyboardArrowUp : MdKeyboardArrowDown} fontSize="24px" color="gray.400" />
                  )}
                </Collapsible.Context>
              </Flex>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Box p={4} bg="white">
                <Text fontSize="sm" color="gray.600" lineHeight="tall">
                  شروط الخدمة..
                </Text>
              </Box>
            </Collapsible.Content>
          </Box>
        </Collapsible.Root>

      </Box>
    </>
  );
}