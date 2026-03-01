"use client"

import { useState } from "react";
import { Box, Container, Text, Flex, Button, VStack, HStack, Heading, Input, Badge } from "@chakra-ui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
    MdCheck,
    MdSearch,
    MdStar,
    MdLocalOffer,
    MdArrowCircleRight
} from "react-icons/md";

// Mock data for general packages
const generalPackages = [
    {
        id: "basic",
        name: "عادية",
        price: "500",
        period: "شهر",
        features: [
            "الوصول إلى 3 مدرسين",
            "حصص مسجلة فقط",
            "دعم عبر البريد الإلكتروني",
            "شهادة إتمام الدورة"
        ],
        buttonColor: "gray.800",
        buttonTextColor: "white",
        isPopular: false,
        borderColor: "gray.200"
    },
    {
        id: "premium",
        name: "بريميم",
        price: "1500",
        period: "شهر",
        features: [
            "الوصول لجميع المدرسين",
            "حصص مباشرة + مسجلة",
            "دعم فني 24/7",
            "مواد تعليمية إضافية",
            "شهادة معتمدة"
        ],
        buttonColor: "white",
        buttonTextColor: "#00A3E0",
        isPopular: true,
        bgColor: "#00A3E0",
        borderColor: "#00A3E0"
    },
    {
        id: "distinctive",
        name: "مميزة",
        price: "1000",
        period: "شهر",
        features: [
            "الوصول إلى 7 مدرسين",
            "حصص مسجلة + مباشرة",
            "دعم فني سريع",
            "تحميل المواد PDF"
        ],
        buttonColor: "#00A3E0",
        buttonTextColor: "white",
        isPopular: false,
        borderColor: "#00A3E0"
    }
];

// Mock data for teacher-based packages
const teacherPackages = [
    {
        id: "teacher1",
        name: "محمد أحمد",
        subject: "مدرس التاريخ",
        image: "https://i.pravatar.cc/300?img=12",
        rating: 4.8,
        students: 245,
        price: "300"
    },
    {
        id: "teacher2",
        name: "فاطمة علي",
        subject: "مدرس العلوم المتكاملة",
        image: "https://i.pravatar.cc/300?img=5",
        rating: 4.9,
        students: 320,
        price: "350"
    },
    {
        id: "teacher3",
        name: "خالد محمود",
        subject: "مدرس اللغة العربية",
        image: "https://i.pravatar.cc/300?img=33",
        rating: 4.7,
        students: 189,
        price: "280"
    }
];

const GeneralPackagesTab = () => {
    const bgColor = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const boxBg = useColorModeValue("#FAFAFA", "#2D3748");
    const descBg = useColorModeValue("white", "#2D3748");
    
    return (
    <VStack gap={8} align="stretch" w="100%">
        {/* Enhanced Description Box */}
        <Box 
            border="2px solid #00A3E0"
            p={{ base: 4, md: 8 }}
            mx={{ base: 2, sm: 4, md: 12 }}
            borderRadius="2xl" 
            textAlign="right"
            position="relative"
            overflow="hidden"
            boxShadow="0 2px 8px rgba(0,163,224,0.4)"
            bg={descBg}
        >
            <Text color="#00A3E0" fontSize={{ base: "sm", md: "lg" }} fontWeight="medium" position="relative">
هذه الباقة تتيح لك الاشتراك مع  عدد من المدرسين - ايا يكن التخصص او المدرس - مقابل عدد من المال حسب الباقة اللي هتشترك فيها.             </Text>
        </Box>

        {/* Packages Grid with Enhanced Design */}
        <Flex 
            gap={{ base: 4, md: 6 }}
            justify="center" 
            flexWrap="wrap"
            align="stretch"
            mt={{ base: 6, md: 10 }}
            px={{ base: 2, md: 0 }}
        >
            {generalPackages.map((pkg) => (
                <Box
                    key={pkg.id}
                    bg={pkg.isPopular ? pkg.bgColor : bgColor}
                    color={pkg.isPopular ? "white" : textColor}
                    borderRadius="3xl"
                    p={{ base: 4, md: 8 }}
                    minW={{ base: "100%", sm: "280px", md: "300px" }}
                    w={{ base: "100%", sm: "calc(50% - 8px)", lg: "auto" }}
                    flex={{ base: "none", lg: "1" }}
                    maxW={{ base: "100%", md: "360px" }}
                    border="2px solid"
                    borderColor={pkg.isPopular ? pkg.borderColor : borderColor}
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
                        transform: pkg.isPopular ? { base: "scale(1.02)", lg: "scale(1.08)" } : { base: "scale(1.01)", lg: "scale(1.03)" },
                        boxShadow: pkg.isPopular 
                            ? "0 24px 48px rgba(0,163,224,0.4)" 
                            : "0 8px 30px rgba(0,0,0,0.12)"
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                    {/* Popular Badge */}
                    {pkg.isPopular && (
                        <Badge
                            position="absolute"
                            top="-12px"
                            bg="#FF5A7E"
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

                    {/* Package Name */}
                    <Heading 
                        size="xl" 
                        color={pkg.isPopular ? "white" : textColor}
                        mt={pkg.isPopular ? 4 : 0}
                    >
                        {pkg.name}
                    </Heading>

                    {/* Price with Animation */}
                    <Box textAlign="center">
                        <Flex align="baseline" justify="center" gap={1}>
                            <Text 
                                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                                fontWeight="black"
                                color={pkg.isPopular ? "white" : "#00A3E0"}
                                lineHeight="1"
                            >
                                {pkg.price}
                            </Text>
                            <Text 
                                fontSize={{ base: "sm", md: "xl" }}
                                color={pkg.isPopular ? "rgba(255,255,255,0.9)" : "gray.600"}
                            >
                                ج
                            </Text>
                        </Flex>
                        <Text 
                            fontSize="md" 
                            color={pkg.isPopular ? "rgba(255,255,255,0.8)" : "gray.500"}
                            mt={1}
                        >
                            لكل {pkg.period}
                        </Text>
                    </Box>

                    {/* Divider */}
                    <Box 
                        w="100%" 
                        h="1px" 
                        bg={pkg.isPopular ? "rgba(255,255,255,0.3)" : borderColor}
                    />

                    {/* Features with Enhanced Icons */}
                    <VStack gap={4} align="stretch" w="100%">
                        {pkg.features.map((feature, index) => (
                            <Flex 
                                key={index} 
                                align="center" 
                                justify="space-between"
                                gap={3}
                            >
                                <Text 
                                    fontSize="sm" 
                                    textAlign="right"
                                    color={pkg.isPopular ? "white" : textColor}
                                >
                                    {feature}
                                </Text>
                                <Box
                                    bg={pkg.isPopular ? "rgba(255,255,255,0.2)" : useColorModeValue("#E3F2FD", "#2D3748")}
                                    borderRadius="full"
                                    p={1}
                                >
                                    <MdCheck 
                                        size={20} 
                                        color={pkg.isPopular ? "white" : "#00A3E0"} 
                                    />
                                </Box>
                            </Flex>
                        ))}
                    </VStack>

                    {/* Enhanced Subscribe Button */}
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
                        _active={{
                            transform: "translateY(-2px)"
                        }}
                        transition="all 0.3s"
                        border={pkg.isPopular ? "2px solid white" : "none"}
                    >
                        اشترك الآن
                    </Button>
                </Box>
            ))}
        </Flex>
    </VStack>
);};

const TeacherPackagesTab = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const bgColor = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const descBg = useColorModeValue("white", "#2D3748");
    const pageDbg = useColorModeValue("#FAFAFA", "#1A202C");
    const searchBg = useColorModeValue("white", "#2D3748");
    const searchBorderColor = useColorModeValue("#E3F2FD", "#374151");
    const badgeBg = useColorModeValue("#E3F2FD", "#1F2937");

    return (
        <VStack gap={8} align="stretch" w="100%">
            {/* Enhanced Description Box */}
        <Box 
            border="2px solid #00A3E0"
            p={{ base: 4, md: 8 }}
            mx={{ base: 2, sm: 4, md: 12 }}
            borderRadius="2xl" 
            textAlign="right"
            position="relative"
            overflow="hidden"
            boxShadow="0 2px 8px rgba(0,163,224,0.4)"
            bg={descBg}
        >
            <Text color="#00A3E0" fontSize={{ base: "sm", md: "lg" }} fontWeight="medium" position="relative">
هذه الباقة تتيح لك الاشتراك مع مدرس معين أو أكثر حسب شروط يحددها المدرس      </Text>
        </Box>

            {/* Enhanced Search Bar */}
            <Flex 
                maxW="600px" 
                mx="auto" 
                w="100%"
                bg={searchBg}
                borderRadius="2xl"
                px={{ base: 3, md: 6 }}
                py={2}
                align="center"
                gap={3}
                boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                border="2px solid"
                borderColor={searchBorderColor}
            >
                <MdSearch size={24} color="#00A3E0" />
                <Input
                    placeholder="ابحث عن المدرس بالاسم أو التخصص..."
                    bg="transparent"
                    border="none"
                    textAlign="right"
                    fontSize={{ base: "sm", md: "md" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
                    _focus={{ outline: "none" }}
                    color={textColor}
                    flex="1"
                />
            </Flex>

            {/* Section Title with Icon */}
            <Flex align="center" gap={3} mt={2}>
                <Box
                    bg={badgeBg}
                    borderRadius="full"
                    p={2}
                >
                    <MdStar size={24} color="#00A3E0" />
                </Box>
                <Heading size="lg" color={textColor}>
                    مدرسين تفاعلت معهم مؤخراً
                </Heading>
            </Flex>

            {/* Enhanced Teachers Grid */}
            <Flex 
                gap={{ base: 4, md: 6 }}
                justify="center" 
                flexWrap="wrap"
                px={{ base: 2, md: 0 }}
            >
                {teacherPackages.map((teacher) => (
                    <Box
                        key={teacher.id}
                        bg={bgColor}
                        borderRadius="3xl"
                        p={6}
                        minW={{ base: "100%", sm: "240px" }}
                        maxW="300px"
                        border="2px solid"
                        borderColor={borderColor}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={4}
                        boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                        _hover={{
                            transform: "translateY(-8px)",
                            boxShadow: useColorModeValue("0 12px 40px rgba(0,163,224,0.2)", "0 12px 40px rgba(0,163,224,0.15)"),
                            borderColor: "#00A3E0"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        position="relative"
                        overflow="hidden"
                    >
                        {/* Decorative Element */}
                        <Box
                            position="absolute"
                            top="-20px"
                            right="-20px"
                            w="80px"
                            h="80px"
                            borderRadius="full"
                            bg="linear-gradient(135deg, #00A3E0 0%, #0088C0 100%)"
                            opacity="0.1"
                        />

                        {/* Teacher Image with Border */}
                        <Box
                            w="120px"
                            h="120px"
                            borderRadius="full"
                            overflow="hidden"
                            border="4px solid"
                            borderColor="#00A3E0"
                            boxShadow="0 8px 24px rgba(0,163,224,0.3)"
                            position="relative"
                        >
                            <img 
                                src={teacher.image} 
                                alt={teacher.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>

                        {/* Teacher Info */}
                        <VStack gap={1} align="center" w="100%">
                            <Text 
                                fontSize="xl" 
                                fontWeight="bold" 
                                color="#00A3E0"
                                textAlign="center"
                            >
                                م/ {teacher.name}
                            </Text>
                            <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")} textAlign="center">
                                {teacher.subject}
                            </Text>
                        </VStack>

                        {/* Stats */}
                        <Flex gap={4} w="100%" justify="center" flexWrap="wrap">
                            <Flex 
                                align="center" 
                                gap={1}
                                bg={useColorModeValue("#FFF3E0", "#3E3B30")}
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                <Text fontSize="sm" fontWeight="bold" color="#FF9800">
                                    {teacher.rating}
                                </Text>
                                <MdStar size={16} color="#FF9800" />
                            </Flex>
                            <Flex 
                                align="center" 
                                gap={1}
                                bg={badgeBg}
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                <Text fontSize="sm" fontWeight="bold" color="#00A3E0">
                                    {teacher.students}
                                </Text>
                                <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>طالب</Text>
                            </Flex>
                        </Flex>


                        {/* Enhanced Subscribe Button */}
                        <Button
                            w="100%"
                            bg="linear-gradient(135deg, #00A3E0 0%, #0088C0 100%)"
                            color="white"
                            borderRadius="xl"
                            py={6}
                            fontSize="md"
                            fontWeight="bold"
                            _hover={{ 
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 20px rgba(0,163,224,0.4)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            transition="all 0.2s"
                        >
                            اشترك الآن
                        </Button>
                    </Box>
                ))}
            </Flex>
        </VStack>
    );
};

export default function SubscriptionsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const pageBg = useColorModeValue("#FAFAFA", "#0F172A");
    const headingColor = useColorModeValue("black", "white");
    const descColor = useColorModeValue("gray.600", "gray.300");
    
    const tabs = [
        { id: "general", label: "باقات عامة", icon: MdLocalOffer },
        { id: "teacher", label: "باقات حسب المدرس", icon: MdStar }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "general":
                return <GeneralPackagesTab />;
            case "teacher":
                return <TeacherPackagesTab />;
            default:
                return <GeneralPackagesTab />;
        }
    };

    return (
        <Box minH="100vh" bg={pageBg} dir="rtl">
            {/* Main Content Area */}
            <Box mr={{ base: 0, md: 5 }} minH="100vh">
                {/* Page Content */}
                <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 2, md: 4 }}>
                    {/* Page Title */}
                    <VStack gap={2} mb={8} textAlign="center">
                        <Heading 
                            size={{ base: "2xl", md: "4xl" }}
                            color={headingColor}
                            bgGradient="linear-gradient(135deg, #00a4e0, #ff5a7e7e)"
                            bgClip="text"
                        >
                            اختر باقتك المثالية
                        </Heading>
                        <Text fontSize={{ base: "md", md: "lg" }} color={descColor}>
                            خطط مرنة تناسب احتياجاتك التعليمية
                        </Text>
                    </VStack>

                    {/* Enhanced Tab Buttons */}
                    <Flex justify="center" gap={{ base: 2, md: 4 }} mb={10} flexWrap="wrap">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <Button
                                    key={tab.id}
                                    bg={activeTab === tab.id ? "linear-gradient(135deg, #00A3E0 0%, #0088C0 100%)" : useColorModeValue("white", "#1A202C")}
                                    color={activeTab === tab.id ? "white" : useColorModeValue("gray.600", "white")}
                                    borderRadius="2xl"
                                    px={{ base: 4, md: 8 }}
                                    py={7}
                                    fontSize={{ base: "sm", md: "lg" }}
                                    fontWeight="bold"
                                    onClick={() => setActiveTab(tab.id)}
                                    _hover={{ 
                                        transform: "translateY(-4px)",
                                        boxShadow: activeTab === tab.id 
                                            ? "0 12px 28px rgba(0,163,224,0.4)" 
                                            : useColorModeValue("0 8px 20px rgba(0,0,0,0.1)", "0 8px 20px rgba(0,163,224,0.2)")
                                    }}
                                    _active={{
                                        transform: "translateY(-2px)"
                                    }}
                                    transition="all 0.3s"
                                    border="2px solid"
                                    borderColor={activeTab === tab.id ? "transparent" : useColorModeValue("gray.200", "gray.600")}
                                    boxShadow={activeTab === tab.id ? "0 8px 24px rgba(0,163,224,0.3)" : "none"}
                                    leftIcon={<Icon size={24} />}
                                >
                                    {tab.label}
                                </Button>
                            );
                        })}
                    </Flex>

                    {/* Content Area with Fade Animation */}
                    <Box 
                        w="100%"
                        animation="fadeIn 0.5s ease-in-out"
                    >
                        {renderContent()}
                    </Box>
                </Container>
            </Box>

            {/* CSS Animation */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Box>
    );
}