"use client"

import { useState } from "react";
import { Box, Container, Text, Flex, Button, VStack, HStack, Heading, Icon } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
    MdPlayCircle, 
    MdInsertDriveFile, 
    MdHelpOutline,
    MdAccessTime,
    MdEdit,
    MdArrowCircleRight,
    MdArrowForward,
    MdArrowBack
} from "react-icons/md";

// Mock data for the lesson
const lessonData = {
    id: "lesson1",
    title: "الحصة التأسيسية الأولى",
    subtitle: "ملخص الحصة التأسيسية الأولى",
    
    // Video data (Image 2)
    video: {
        thumbnail: "/api/placeholder/800/450",
        title: "شرح | علامات الإعراب - الأسماء الخمسة - المعرب والمبني من الأسماء",
        duration: "25 دقيقة"
    },
    
    // File/PDF data (Image 3)
    file: {
        title: "ملخص الحصة التأسيسية الأولى",
        pdfUrl: "/path-to-pdf.pdf"
    },
    
    // Questions/Exercise data (Image 1)
    exercise: {
        title: "واجب الحصة التأسيسية الأولى",
        duration: "30 دقيقة",
        questionsCount: 12
    }
};

// Define tabs order for navigation
const tabsOrder = ["video", "file", "questions"];

const NavigationButtons = ({ currentTab, onNavigate }) => {
    const currentIndex = tabsOrder.indexOf(currentTab);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < tabsOrder.length - 1;

    const handleNext = () => {
        if (hasNext) {
            onNavigate(tabsOrder[currentIndex + 1]);
        }
    };

    const handlePrevious = () => {
        if (hasPrevious) {
            onNavigate(tabsOrder[currentIndex - 1]);
        }
    };

    return (
        <Flex gap={4} justify="flex-start" mt={4}>
            {hasNext && (
                <Button
                    bg="#00BCD4"
                    color="white"
                    borderRadius="xl"
                    px={6}
                    onClick={handleNext}
                    _hover={{ bg: "#00ACC1" }}
                >
                    التالي
                </Button>
            )}
            {hasPrevious && (
                <Button
                    variant="outline"
                    color="#00BCD4"
                    borderColor="#00BCD4"
                    borderRadius="xl"
                    px={6}
                    onClick={handlePrevious}
                    _hover={{ bg: "cyan.50" }}
                >
                    السابق
                </Button>
            )}
        </Flex>
    );
};

const VideoTab = ({ data, currentTab, onNavigate }) => {
    const textColor = useColorModeValue("gray.600", "gray.300");
    const videoBg = useColorModeValue("gray.200", "gray.700");
    
    return (
    <VStack gap={6} align="stretch" w="100%">
        {/* Video Player Container */}
        <Box 
            bg={videoBg}
            borderRadius="2xl" 
            overflow="hidden"
            position="relative"
            aspectRatio={16/9}
        >
            <img 
                src={data.thumbnail} 
                alt="Video thumbnail" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Play Button Overlay */}
            <Box 
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="#00BCD4"
                borderRadius="full"
                p={4}
                cursor="pointer"
                _hover={{ transform: "translate(-50%, -50%) scale(1.1)" }}
                transition="all 0.2s"
            >
                <MdPlayCircle size={40} color="white" />
            </Box>
        </Box>
        
        {/* Video Title */}
        <Text fontSize="lg" color={textColor} textAlign="center">
            {data.title}
        </Text>
        
        {/* Navigation Buttons */}
        <NavigationButtons currentTab={currentTab} onNavigate={onNavigate} />
    </VStack>
    );
};

const FileTab = ({ data, currentTab, onNavigate }) => {
    const textColor = useColorModeValue("gray.500", "gray.400");
    const fileBg = useColorModeValue("#E3F2FD", "#1E293B");
    const fileBorderColor = useColorModeValue("#BBDEFB", "#334155");
    
    return (
    <VStack gap={6} align="stretch" w="100%">
        {/* Subtitle */}
        <Text fontSize="md" color={textColor} textAlign="right">
            {data.title}
        </Text>
        
        {/* PDF Viewer Container */}
        <Box 
            bg={fileBg}
            borderRadius="2xl" 
            p={12}
            display="flex"
            alignItems="center"
            justifyContent="center"
            minH="400px"
            border="2px dashed"
            borderColor={fileBorderColor}
        >
            <VStack gap={4}>
                {/* PDF Icon */}
                <Box 
                    bg="#FF5252" 
                    p={6} 
                    borderRadius="2xl"
                    boxShadow="0 4px 12px rgba(255,82,82,0.3)"
                >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                </Box>
            </VStack>
        </Box>
        
        {/* Navigation Buttons */}
        <NavigationButtons currentTab={currentTab} onNavigate={onNavigate} />
    </VStack>
    );
};

const QuestionsTab = ({ data, currentTab, onNavigate }) => {
    const headingColor = useColorModeValue("gray.800", "white");
    const infoBg = useColorModeValue("#E1F5FE", "#1E293B");
    const infoTextColor = useColorModeValue("gray.700", "gray.300");
    
    return (
    <VStack gap={6} align="center" w="100%">
        {/* Title */}
        <Heading size="lg" color={headingColor} mb={4}>
            {data.title}
        </Heading>
        
        {/* Info Card */}
        <Flex 
            bg={infoBg}
            borderRadius="2xl" 
            p={6}
            w="100%"
            maxW="600px"
            justify="space-between"
            align="center"
        >
            {/* Duration */}
            <Flex align="center" gap={2} color="#FF5A7E">
                <MdAccessTime size={20} />
                <Text fontWeight="bold">{data.duration}</Text>
            </Flex>
            
            {/* Questions Count */}
            <Flex align="center" gap={2} color={infoTextColor}>
                <Text>{data.questionsCount} سؤال</Text>
                <MdEdit size={20} />
            </Flex>
        </Flex>
        
        {/* Start Button */}
        <Button
            bg="#00BCD4"
            color="white"
            size="lg"
            borderRadius="xl"
            px={12}
            py={6}
            fontSize="lg"
            _hover={{ bg: "#00ACC1", transform: "translateY(-2px)" }}
            transition="all 0.2s"
            mt={8}
        >
            ابدأ التمرين
        </Button>
        
        {/* Navigation Buttons */}
        <NavigationButtons currentTab={currentTab} onNavigate={onNavigate} />
    </VStack>
    );
};

// Carousel Dots Component
const CarouselDots = ({ currentTab, total, onDotClick, onNext, onPrev }) => {
        const currentIndex = tabsOrder.indexOf(currentTab);
    const activeColor = "#00BCD4";
    const inactiveColor = useColorModeValue("#CBD5E0", "#4A5568");
    
    return (
        <Flex 
            align="center" 
            justify="center" 
            gap={4} 
            mt={8}
            direction="row"
        >
            
            {/* Dots */}
            <HStack gap={3}>
                {Array.from({ length: total }).map((_, index) => (
                    <Box
                        key={index}
                        w={index === currentIndex ? "32px" : "12px"}
                        h="12px"
                        borderRadius="full"
                        bg={index === currentIndex ? activeColor : inactiveColor}
                        cursor="pointer"
                        onClick={() => onDotClick(index)}
                        transition="all 0.3s ease"
                        _hover={{ 
                            transform: "scale(1.2)",
                            bg: index === currentIndex ? activeColor : "#00BCD4"
                        }}
                    />
                ))}
            </HStack>
        </Flex>
    );
};
export default function LessonContentPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState("video");
    const pageBg = useColorModeValue("white", "#0F172A");
    const bgColor = useColorModeValue("white", "#1A202C");
    const buttonBg = useColorModeValue("white", "#2D3748");
    const buttonHoverBg = useColorModeValue("gray.100", "#374151");
    const buttonBorderColor = useColorModeValue("gray.200", "#4B5563");
    const headingColor = useColorModeValue("gray.800", "white");
    

    const handleNavigate = (tabId) => {
        setActiveTab(tabId);
    };

    // Carousel / dots handlers
    const handleDotClick = (index) => {
        setActiveTab(tabsOrder[index]);
    };

    const handleNext = () => {
        const idx = tabsOrder.indexOf(activeTab);
        if (idx < tabsOrder.length - 1) setActiveTab(tabsOrder[idx + 1]);
    };

    const handlePrev = () => {
        const idx = tabsOrder.indexOf(activeTab);
        if (idx > 0) setActiveTab(tabsOrder[idx - 1]);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "video":
                return <VideoTab data={lessonData.video} currentTab={activeTab} onNavigate={handleNavigate} />;
            case "file":
                return <FileTab data={lessonData.file} currentTab={activeTab} onNavigate={handleNavigate} />;
            case "questions":
                return <QuestionsTab data={lessonData.exercise} currentTab={activeTab} onNavigate={handleNavigate} />;
            default:
                return <VideoTab data={lessonData.video} currentTab={activeTab} onNavigate={handleNavigate} />;
        }
    };

    return (
        <Box minH="100vh" dir="rtl" bg={pageBg}>
            {/* Main Content Area */}
            <Box mx={{ base: 0, sm: 1, md: 3, lg: 5 }} minH="100vh">
                {/* Page Content */}
                <Container maxW="container.lg" py={{ base: 4, sm: 5, md: 8 }} px={{ base: 2, sm: 3, md: 4, lg: 6 }}>
                    {/* Lesson Header with Back Button */}
                    <Flex align="center" gap={3} mb={8} flexWrap="wrap">
                        <Link href={`/Student/teacher/${params.id}/lesson/${params.lesson}`}>
                            <Box 
                                bg={useColorModeValue("black", "#2D3748")} 
                                borderRadius="lg" 
                                p={2}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                _hover={{ bg: useColorModeValue("gray.800", "#374151") }}
                                transition="all 0.2s"
                            >
                                <MdArrowCircleRight size={24} color="white" />
                            </Box>
                        </Link>
                        <Heading size={{ base: "md", md: "lg" }} color={headingColor}>
                            {lessonData.title}
                        </Heading>
                    </Flex>

                    <CarouselDots 
                            currentTab={activeTab}
                            total={tabsOrder.length}
                            onNext={handleNext}
                            onPrev={handlePrev}
                        />
                    {/* Content Area */}
                    <Box bg={bgColor} borderRadius="2xl" mt={5} p={{ base: 3, md: 6 }} minH={{ base: "300px", md: "500px" }}>
                        {renderContent()}
                    </Box>
                    
                </Container>
            </Box>
        </Box>
    );
}