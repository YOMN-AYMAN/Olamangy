

"use client"
import { useState, useEffect } from "react";
import { Box, VStack, Text, Flex, Icon, Collapsible, HStack, Spinner } from "@chakra-ui/react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdSupportAgent, MdOutlineShield, MdGavel } from "react-icons/md";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { getDatabase, ref, get } from "firebase/database";

const LegalContent = ({ data, loading }) => {
    if (loading) return (
        <Flex justify="center" align="center" py={10}>
            <Spinner size="sm" color="#009EDB" mr={2} />
            <Text color="gray.400" fontSize="sm">جاري التحميل...</Text>
        </Flex>
    );

    if (!data) return (
        <Flex justify="center" align="center" py={10}>
            <Text color="gray.400" fontSize="sm">المحتوى غير متاح حالياً</Text>
        </Flex>
    );

    return (
        <Box dir="rtl">
            <Text fontWeight="bold" fontSize="md" color="#009EDB" mb={1}>
                {data.title}
            </Text>
            <Text fontSize="xs" color="gray.400" mb={4}>
                آخر تحديث: {data.lastUpdated}
            </Text>

            <Text fontSize="sm" color="gray.600" mb={6} lineHeight="1.9" _dark={{ color: "gray.400" }}>
                {data.intro}
            </Text>

            {data.sections && Object.entries(data.sections)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([num, section]) => (
                    <Box key={num} mb={6}>
                        <Flex align="center" mb={2} gap={2}>
                            <Box
                                bg="#009EDB"
                                color="white"
                                fontSize="xs"
                                fontWeight="bold"
                                rounded="md"
                                px={2}
                                py={0.5}
                                flexShrink={0}
                            >
                                {num}
                            </Box>
                            <Text fontWeight="bold" fontSize="sm" color="#000" _dark={{ color: "white" }}>
                                {section.title}
                            </Text>
                        </Flex>

                        <Text
                            fontSize="sm"
                            color="gray.600"
                            whiteSpace="pre-wrap"
                            lineHeight="2"
                            pr={6}
                            _dark={{ color: "gray.400" }}
                        >
                            {section.content}
                        </Text>
                        <Box mt={4} h="1px" bg="gray.100" _dark={{ bg: "gray.700" }} />
                    </Box>
                ))}

            <Text fontSize="xs" color="gray.400" mt={2} textAlign="center">
                {data.footer}
            </Text>
        </Box>
    );
};

export default function TechnicalSupport() {
    const [content, setContent] = useState({ privacy: null, terms: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getDatabase();
        Promise.all([
            get(ref(db, "legal/privacy")),
            get(ref(db, "legal/terms")),
        ])
        .then(([privacySnap, termsSnap]) => {
            setContent({
                privacy: privacySnap.exists() ? privacySnap.val() : null,
                terms: termsSnap.exists() ? termsSnap.val() : null,
            });
        })
        .catch(() => setContent({ privacy: null, terms: null }))
        .finally(() => setLoading(false));
    }, []);

    return (
        <Box p={6} maxW="900px" mx="auto" dir="rtl">
            
            <Collapsible.Root defaultOpen>
                <Box borderRadius="xl" overflow="hidden" border="1px solid" borderColor="bg.subtle" shadow="sm" mb={4}>
                    <Collapsible.Trigger asChild>
                        <Flex bg="bg.subtle" p={4} justify="space-between" align="center" cursor="pointer">
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
                            <Box borderRadius="xl" dir="ltr" p={4} bg="#25D366" mb={3} cursor="pointer" shadow="sm" _hover={{ opacity: 0.9 }}>
                                <HStack justify="space-between" color="white">
                                    <HStack gap={3}>
                                        <Icon as={FaWhatsapp} fontSize="xl" />
                                        <Text fontWeight="bold">Whatsapp</Text>
                                    </HStack>
                                </HStack>
                            </Box>
                            <Box borderRadius="xl" dir="ltr" p={4} border="1px solid #E2E8F0" bg="white" cursor="pointer" shadow="sm" _hover={{ bg: "gray.50" }}>
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
                <Box borderRadius="xl" overflow="hidden" border="1px solid" borderColor="bg.subtle" bg="bg.muted" shadow="sm" mb={4}>
                    <Collapsible.Trigger asChild>
                        <Flex bg="bg.subtle" p={4} justify="space-between" align="center" cursor="pointer">
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
                        <Box p={6} bg="white" _dark={{ bg: "gray.900" }}>
                            <LegalContent data={content.privacy} loading={loading} />
                        </Box>
                    </Collapsible.Content>
                </Box>
            </Collapsible.Root>

            <Collapsible.Root>
                <Box borderRadius="xl" overflow="hidden" border="1px solid" borderColor="bg.subtle" bg="bg.muted" shadow="sm">
                    <Collapsible.Trigger asChild>
                        <Flex bg="bg.subtle" p={4} justify="space-between" align="center" cursor="pointer">
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
                        <Box p={6} bg="white" _dark={{ bg: "gray.900" }}>
                            <LegalContent data={content.terms} loading={loading} />
                        </Box>
                    </Collapsible.Content>
                </Box>
            </Collapsible.Root>

        </Box>
    );
}