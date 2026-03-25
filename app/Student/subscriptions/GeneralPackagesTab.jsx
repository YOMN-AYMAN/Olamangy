"use client"
import { Box, Text, Flex, Button, VStack, Heading, Badge } from "@chakra-ui/react";
import { MdCheck } from "react-icons/md";

export default function GeneralPackagesTab({ plans, onSubscribe }) {
    return (
        <VStack gap={8} align="stretch" w="100%">
            {/* Description Banner */}
            <Flex
                gap={{ base: 4, md: 6 }}
                justify="center"
                flexWrap="wrap"
                align="stretch"
                mt={{ base: 6, md: 10 }}
                px={{ base: 2, md: 0 }}
            >
                {plans.map((pkg) => (
                    <Box
                        key={pkg.id}
                        bg={pkg.isPopular ? pkg.bgColor : "bg.panel"}
                        color={pkg.isPopular ? "white" : "fg.DEFAULT"}
                        borderRadius="3xl"
                        p={{ base: 4, md: 8 }}
                        minW={{ base: "100%", sm: "280px", md: "300px" }}
                        w={{ base: "100%", sm: "calc(50% - 8px)", lg: "auto" }}
                        flex={{ base: "none", lg: "1" }}
                        maxW={{ base: "100%", md: "360px" }}
                        border="2px solid"
                        borderColor={pkg.isPopular ? pkg.borderColor : "border.DEFAULT"}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={6}
                        position="relative"
                        boxShadow={pkg.isPopular
                            ? "0 20px 40px rgba(0,163,224,0.3)"
                            : "0 4px 20px rgba(0,0,0,0.08)"
                        }
                        transform={pkg.isPopular ? { base: "scale(1)", lg: "scale(1.05)" } : "scale(1)"}
                        _hover={{
                            transform: pkg.isPopular
                                ? { base: "scale(1.02)", lg: "scale(1.08)" }
                                : { base: "scale(1.01)", lg: "scale(1.03)" },
                            boxShadow: pkg.isPopular
                                ? "0 24px 48px rgba(0,163,224,0.4)"
                                : "0 8px 30px rgba(0,0,0,0.12)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                        {pkg.isPopular && (
                            <Badge
                                position="absolute"
                                top="-12px"
                                bg="fg.pink"
                                color="white"
                                px={4}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="bold"
                                boxShadow="0 4px 12px rgba(255,90,126,0.4)"
                            >
                                الأكثر شعبية ⭐
                            </Badge>
                        )}

                        <Heading
                            size="xl"
                            color={pkg.isPopular ? "white" : "fg.DEFAULT"}
                            mt={pkg.isPopular ? 4 : 0}
                        >
                            {pkg.name}
                        </Heading>

                        <Box textAlign="center">
                            <Flex align="baseline" justify="center" gap={1}>
                                <Text
                                    fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                                    fontWeight="black"
                                    color={pkg.isPopular ? "white" : "fg.blue"}
                                    lineHeight="1"
                                >
                                    {pkg.price}
                                </Text>
                                <Text
                                    fontSize={{ base: "sm", md: "xl" }}
                                    color={pkg.isPopular ? "rgba(255,255,255,0.9)" : "fg.muted"}
                                >
                                    ج
                                </Text>
                            </Flex>
                            <Text
                                fontSize="md"
                                color={pkg.isPopular ? "rgba(255,255,255,0.8)" : "fg.subtle"}
                                mt={1}
                            >
                                لكل {pkg.period}
                            </Text>
                        </Box>

                        <Box
                            w="100%"
                            h="1px"
                            bg={pkg.isPopular ? "rgba(255,255,255,0.3)" : "border.subtle"}
                        />

                        <VStack gap={4} align="stretch" w="100%">
                            {Object.values(pkg.features ?? {}).map((feature, index) => (
                                <Flex
                                    key={index}
                                    align="center"
                                    justify="space-between"
                                    gap={3}
                                >
                                    <Text
                                        fontSize="sm"
                                        textAlign="right"
                                        color={pkg.isPopular ? "white" : "fg.DEFAULT"}
                                    >
                                        {feature}
                                    </Text>
                                    <Box
                                        bg={pkg.isPopular ? "rgba(255,255,255,0.2)" : "bg.subtle"}
                                        borderRadius="full"
                                        p={1}
                                    >
                                        <MdCheck
                                            size={20}
                                            color={pkg.isPopular ? "white" : "rgb(0, 158, 222)"}
                                        />
                                    </Box>
                                </Flex>
                            ))}
                        </VStack>

                        <Button
                            mt="auto"
                            w="100%"
                            bg={pkg.buttonColor}
                            color={pkg.buttonTextColor}
                            borderRadius="xl"
                            py={7}
                            fontSize="lg"
                            fontWeight="bold"
                            _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: pkg.isPopular
                                    ? "0 12px 24px rgba(255,255,255,0.3)"
                                    : "0 8px 20px rgba(0,163,224,0.4)"
                            }}
                            _active={{ transform: "translateY(-2px)" }}
                            transition="all 0.3s"
                            border={pkg.isPopular ? "2px solid white" : "none"}
                            onClick={() => onSubscribe({ type: "general", plan: pkg })}
                        >
                            اشترك الآن
                        </Button>
                    </Box>
                ))}
            </Flex>
        </VStack>
    );
}
