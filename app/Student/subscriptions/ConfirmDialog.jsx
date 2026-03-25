"use client"
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, message, loading }) {
    if (!isOpen) return null;
    return (
        <>
            <Box
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="bg.panel"
                rounded="2xl"
                shadow="2xl"
                w="92%"
                maxW="420px"
                zIndex={1000}
                border="1px solid"
                borderColor="border.DEFAULT"
                overflow="hidden"
            >
                {/* Header */}
                <Flex
                    justify="space-between"
                    align="center"
                    px={6}
                    py={4}
                    borderBottom="1px solid"
                    borderColor="border.subtle"
                >
                    <Text fontWeight="bold" fontSize="md" color="fg.DEFAULT">
                        تأكيد الاشتراك
                    </Text>
                    <Box
                        as="button"
                        w="28px"
                        h="28px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        rounded="full"
                        bg="bg.muted"
                        color="fg.muted"
                        fontSize="lg"
                        fontWeight="bold"
                        cursor="pointer"
                        _hover={{ bg: "bg.subtle" }}
                        onClick={onClose}
                    >
                        <MdClose size={18} />
                    </Box>
                </Flex>

                {/* Body */}
                <Box px={6} py={6} dir="rtl">
                    <Text fontSize="md" color="fg.muted" lineHeight="1.8" textAlign="right">
                        {message}
                    </Text>
                </Box>

                {/* Footer */}
                <Flex
                    px={6}
                    pb={5}
                    pt={2}
                    gap={3}
                    justify="flex-end"
                    borderTop="1px solid"
                    borderColor="border.subtle"
                >
                    <Button
                        variant="outline"
                        rounded="xl"
                        onClick={onClose}
                        disabled={loading}
                        color="fg.muted"
                        borderColor="border.DEFAULT"
                        _hover={{ bg: "bg.subtle" }}
                    >
                        إلغاء
                    </Button>
                    <Button
                        bg="fg.blue"
                        color="white"
                        rounded="xl"
                        onClick={onConfirm}
                        loading={loading}
                        _hover={{ opacity: 0.88 }}
                        fontWeight="bold"
                    >
                        تأكيد
                    </Button>
                </Flex>
            </Box>

            {/* Backdrop */}
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.600"
                zIndex={999}
                onClick={onClose}
            />
        </>
    );
}