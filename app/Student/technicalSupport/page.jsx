

"use client"
import { Box, VStack, Text, Flex, Icon, Collapsible, HStack } from "@chakra-ui/react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdSupportAgent, MdOutlineShield, MdGavel } from "react-icons/md";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function TechnicalSupport() {
    return (
        <>
        <Box p={6} maxW="900px" mx="auto" dir="rtl" >

            <Collapsible.Root defaultOpen >
            <Box borderRadius="xl" overflow="hidden" border="1px solid bg.subtle"  shadow="sm" mb={4}>
                <Collapsible.Trigger asChild >
                <Flex
                    bg="bg.subtle"
                    p={4}
                    color="white"
                    justify="space-between" 
                    align="center"
                    cursor="pointer"
                >
                    <HStack gap={3}>
                    <Icon as={MdSupportAgent} fontSize="xl" color="fg.muted"/>
                    <Text fontWeight="bold" color="fg.muted">تواصل معنا</Text>
                    </HStack>
                    <Collapsible.Context>
                    {(context) => (
                        <Icon as={context.open ? MdKeyboardArrowUp : MdKeyboardArrowDown} fontSize="24px" color="fg.muted"/>
                    )}
                    </Collapsible.Context>
                </Flex>
                </Collapsible.Trigger>
                
                <Collapsible.Content>
                <Box p={4} bg="bg.muted">
                    <Box
                    borderRadius="xl"
                    dir="ltr"
                    p={4}
                    bg="#25D366"
                    mb={3}
                    cursor="pointer"
                    shadow="sm"
                    _hover={{ opacity: 0.9 }}
                    >
                    <HStack justify="space-between" color="white">
                        <HStack gap={3}>
                        <Icon as={FaWhatsapp} fontSize="xl" />
                        <Text fontWeight="bold">Whatsapp</Text>
                        </HStack>
                    </HStack>
                    </Box>

                    <Box
                    borderRadius="xl"
                    dir="ltr"
                    p={4}
                    border="1px solid #E2E8F0"
                    bg="white"
                    cursor="pointer"
                    shadow="sm"
                    _hover={{ bg: "gray.50" }}
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

            <Collapsible.Root>
            <Box borderRadius="xl" overflow="hidden" border="1px solid bg.subtle" bg="bg.muted" shadow="sm" mb={4}>
                <Collapsible.Trigger asChild>
                <Flex
                    bg="bg.subtle"
                    p={4}
                    color="gray.700"
                    justify="space-between"
                    align="center"
                    cursor="pointer"
                    borderBottom="1px solid bg.subtle"
                >
                    <HStack gap={3}>
                    <Icon as={MdOutlineShield} color="fg.muted" fontSize="xl" />
                    <Text fontWeight="bold" color="fg.muted">سياسة الخصوصية</Text>
                    </HStack>
                    <Collapsible.Context>
                    {(context) => (
                        <Icon as={context.open ? MdKeyboardArrowUp : MdKeyboardArrowDown} fontSize="24px" color="fg.muted" />
                    )}
                    </Collapsible.Context>
                </Flex>
                </Collapsible.Trigger>
                <Collapsible.Content>
                <Box p={4} bg="bg.muted">
                    <Text fontSize="sm" color="fg.muted" lineHeight="tall">
                    سياسة الخصوصية..
                    </Text>
                </Box>
                </Collapsible.Content>
            </Box>
            </Collapsible.Root>

            <Collapsible.Root>
            <Box borderRadius="xl" overflow="hidden" border="1px solid bg.subtle" bg="bg.muted" shadow="sm">
                <Collapsible.Trigger asChild>
                <Flex
                    bg="bg.subtle"
                    p={4}
                    color="gray.700"
                    justify="space-between"
                    align="center"
                    cursor="pointer"
                    borderBottom="1px solid bg.subtle"
                >
                    <HStack gap={3}>
                    <Icon as={MdGavel} color="fg.muted" fontSize="xl" />
                    <Text fontWeight="bold" color="fg.muted">شروط الخدمة</Text>
                    </HStack>
                    <Collapsible.Context>
                    {(context) => (
                        <Icon as={context.open ? MdKeyboardArrowUp : MdKeyboardArrowDown} fontSize="24px" color="fg.muted" />
                    )}
                    </Collapsible.Context>
                </Flex>
                </Collapsible.Trigger>
                <Collapsible.Content>
                <Box p={4} bg="bg.muted">
                    <Text fontSize="sm" color="fg.muted" lineHeight="tall">
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

