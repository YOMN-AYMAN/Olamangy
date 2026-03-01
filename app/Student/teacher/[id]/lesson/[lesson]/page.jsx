"use client"

import { useState, useEffect } from "react";
import { Box, Container, Text, Flex, Badge, Button, VStack, HStack, Heading, Checkbox, Icon } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
    MdArrowCircleRight, 
    MdPlayCircle, 
    MdInsertDriveFile, 
    MdHelpOutline,
    MdAccessTime,
    MdHelp,
    MdLogout
} from "react-icons/md";

// Mock data for the lesson materials
const lessonMaterials = [
    {
        id: "1",
        title: "شرح | علامات الإعراب - الأسماء الخمسة - المعرب والمبني من الأسماء",
        type: "video",
        duration: "25 دقيقة",
        completed: true
    },
    {
        id: "2",
        title: "ملخص الحصة التأسيسية الأولى",
        type: "file",
        completed: false
    },
    {
        id: "3",
        title: "واجب الحصة التأسيسية الأولى",
        type: "exercise",
        duration: "30 دقيقة",
        questions: "12 سؤال",
        completed: true
    }
];

// Filter types
const filters = [
    { id: "all", label: "الكل", color: "#FF5A7E" },
    { id: "videos", label: "فيديوهات", color: "#E0E0E0" },
    { id: "files", label: "ملفات", color: "#E0E0E0" },
    { id: "exercises", label: "تمارين", color: "#E0E0E0" }
];

const MaterialItem = ({ material, onToggleComplete, teacherId, lessonId }) => {
    const cardBg = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const metaColor = useColorModeValue("gray.500", "gray.400");
    
    const handleCheckboxClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleComplete(material.id);
    };
    const getIcon = () => {
        switch (material.type) {
            case "video":
                return (
                    <Box bg="#00BCD4" borderRadius="3xl" p={1}>
                        <Icon as={MdPlayCircle} boxSize={5} color="white" />
                    </Box>
                );
            case "file":
                return (
                    <Box bg="#00BCD4" borderRadius="md" p={1}>
                        <Icon as={MdInsertDriveFile} boxSize={5} color="white" />
                    </Box>
                );
            case "exercise":
                return (
                    <Box bg="#00BCD4" borderRadius="lg" p={1}>
                        <Icon as={MdHelp} boxSize={5} color="white" />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
           <Link 
            href={`/Student/teacher/${teacherId}/lesson/${lessonId}/details/${material.id}`}
            style={{ textDecoration: 'none', display: 'block' }}
        >
        <Flex 
            align="center" 
            gap={4} 
            bg={cardBg}
            p={6} 
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow={useColorModeValue("0 2px 4px rgba(0,0,0,0.1)", "0 2px 4px rgba(0,0,0,0.3)")}
            _hover={{ shadow: useColorModeValue("0 6px 8px rgba(255, 90, 126, 0.24)", "0 6px 8px rgba(255, 90, 126, 0.15)"), transform: "translateY(-2px)" }}
            transition="all 0.2s"
            flexWrap={{ base: "wrap", md: "nowrap" }}
        >
            {/* Type Icon */}
            {getIcon()}

            {/* Title */}
            <Text 
                flex="1" 
                fontSize={{ base: "sm", md: "md" }}
                color={textColor}
                textAlign="right"
                fontWeight="medium"
            >
                {material.title}
            </Text>

            {/* Meta Info */}
            <HStack gap={{ base: 1, md: 2 }} color={metaColor} fontSize={{ base: "xs", md: "sm" }} flexWrap="wrap" justify={{ base: "flex-start", md: "flex-end" }}>
                {material.duration && (
                    <Flex align="center" gap={1}>
                        <Icon as={MdAccessTime} boxSize={3.5} />
                        <Text>{material.duration}</Text>
                    </Flex>
                )}
                {material.questions && (
                    <Flex align="center" gap={1}>
                        <Icon as={MdHelpOutline} boxSize={3.5} />
                        <Text>{material.questions}</Text>
                    </Flex>
                )}
            </HStack>
            {/* Checkbox */}
           <form onClick={(e) => e.preventDefault()}>
                        <label>
                            <input
                                type="checkbox"
                                onChange={handleCheckboxClick}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    accentColor: "#FF5A7E",
                                    transform: 'scale(1.2)',
                                    cursor: 'pointer'
                                }}
                            />
                        </label>
                    </form>
            
        </Flex>
        </Link>
    );
};


export default function LessonDetailPage() {
    const params = useParams();
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [materials, setMaterials] = useState(lessonMaterials);
    const pageBg = useColorModeValue("white", "#0F172A");
    const headingColor = useColorModeValue("gray.800", "white");
    const buttonBg = useColorModeValue("white", "#2D3748");
    const buttonHoverBg = useColorModeValue("gray.100", "#374151");
    const buttonBorderColor = useColorModeValue("gray.200", "#4B5563");

    const handleToggleComplete = (id) => {
        setMaterials(prev => prev.map(m => 
            m.id === id ? { ...m, completed: !m.completed } : m
        ));
    };

    const filteredMaterials = selectedFilter === "all" 
        ? materials 
        : materials.filter(m => m.type === selectedFilter.slice(0, -1)); // remove 's' from filter id

    return (
        <Box minH="100vh" dir="rtl" bg={pageBg}>
            {/* Main Content Area */}
            <Box mx={{ base: 0, sm: 1, md: 4, lg: 8 }} minH="100vh">
                {/* Page Content */}
                <Container maxW="container.lg" py={{ base: 3, sm: 4, md: 8 }} px={{ base: 2, sm: 3, md: 4, lg: 6 }}>
                    {/* Lesson Title Header */}
                    <Flex align="center" gap={3} mb={8} flexWrap="wrap">
                            <Box 
                                bg={useColorModeValue("black", "#2D3748")} 
                                borderRadius="lg" 
                                p={2}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Link href={`/Student/teacher/${params.id}`}>
                                <Icon as={MdArrowCircleRight} boxSize={6} color="white" />
                                </Link>
                            </Box>
                        <Heading size={{ base: "md", md: "lg" }} color={headingColor}>
                            الحصة التأسيسية الأولى
                        </Heading>
                    </Flex>

                    {/* Filters */}
                    <Flex justify="center" gap={{ base: 2, md: 3 }} mb={8} flexWrap="wrap">
                        {filters.map(filter => (
                            <Button
                                key={filter.id}
                                bg={selectedFilter === filter.id ? "#FF5A7E" : buttonBg}
                                color={selectedFilter === filter.id ? "white" : useColorModeValue("gray.600", "white")}
                                borderRadius="xl"
                                px={{ base: 3, md: 6 }}
                                py={{ base: 1, md: 2 }}
                                onClick={() => setSelectedFilter(filter.id)}
                                _hover={{ 
                                    bg: selectedFilter === filter.id ? "#FF5A7E" : buttonHoverBg,
                                    transform: "translateY(-1px)"
                                }}
                                transition="all 0.2s"
                                fontSize={{ base: "xs", md: "sm" }}
                                fontWeight="medium"
                                border="1px solid"
                                borderColor={selectedFilter === filter.id ? "#FF5A7E" : buttonBorderColor}
                                boxShadow={selectedFilter === filter.id ? "0 2px 8px rgba(255,90,126,0.3)" : "none"}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </Flex>

                    {/* Materials List */}
                    <VStack gap={3} align="stretch">
                        {filteredMaterials.map(material => (
                            <MaterialItem 
                                key={material.id}
                                material={material}
                                onToggleComplete={() => handleToggleComplete(material.id)}
                            />
                        ))}
                    </VStack>
                </Container>
            </Box>

           
        </Box>
    );
}