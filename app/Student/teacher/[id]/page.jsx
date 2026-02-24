"use client"

import { useState, useEffect } from "react";
import { Box, Container, Text, Flex, Badge, Button, VStack, HStack, Heading } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MdArrowCircleRight, MdBookmarks } from "react-icons/md";

// Mock teachers data (keep your existing data)
const mockTeachers = [
    {
        id: "1",
        name: "محمد محمد",
        subject: "اللغة العربية",
        weeks: [
            {
                id: "week1",
                title: "الأسبوع الأول",
                term: "term1",
                lessons: [
                    {
                        id: "lesson1",
                        title: "الحصة التأسيسية الأولى",
                        description: "علامات الإعراب - الأسماء الخمسة - المعرب والمبني من الأسماء",
                        type: "video",
                        isFree: true,
                        completed: false
                    },
                    {
                        id: "lesson2",
                        title: "الحصة التأسيسية الثانية",
                        description: "علامات الإعراب - الأسماء الخمسة - المعرب والمبني من الأسماء",
                        type: "video",
                        isFree: true,
                        completed: false
                    },
                    {
                        id: "lesson3",
                        title: "الحصة التأسيسية الثالثة",
                        description: "علامات الإعراب - الأسماء الخمسة - المعرب والمبني من الأسماء",
                        type: "pdf",
                        isFree: false,
                        completed: false
                    }
                ]
            },
            {
                id: "week2",
                title: "الأسبوع الثاني",
                term: "term1",
                lessons: [
                    {
                        id: "lesson4",
                        title: "نحو",
                        description: "علامات الإعراب - الأسماء الخمسة - المعرب والمبني من الأسماء",
                        type: "video",
                        isFree: false,
                        completed: false
                    },
                    {
                        id: "lesson5",
                        title: "بلاغة",
                        description: "علامات الإعراب - الأسماء الخمسة - المعرب والمبني من الأسماء",
                        type: "video",
                        isFree: false,
                        completed: false
                    }
                ]
            },
            {
                id: "week3",
                title: "الأسبوع الأول",
                term: "term2",
                lessons: [
                    {
                        id: "lesson6",
                        title: "الأدب العربي",
                        description: "دراسة الشعر الجاهلي والعصر الأموي",
                        type: "video",
                        isFree: true,
                        completed: false
                    },
                    {
                        id: "lesson7",
                        title: "النقد الأدبي",
                        description: "مفاهيم النقد الأدبي الحديث",
                        type: "video",
                        isFree: false,
                        completed: false
                    }
                ]
            },
            {
                id: "week4",
                title: "الأسبوع الثاني",
                term: "term2",
                lessons: [
                    {
                        id: "lesson8",
                        title: "القراءة والنصوص",
                        description: "تحليل النصوص الأدبية المقررة",
                        type: "pdf",
                        isFree: false,
                        completed: false
                    }
                ]
            }
        ]
    },
    {
        id: "2",
        name: "أحمد محمد",
        subject: "الرياضيات",
        weeks: [
            {
                id: "week1",
                title: "الأسبوع الأول",
                term: "term1",
                lessons: [
                    {
                        id: "lesson1",
                        title: "المعادلات التربيعية",
                        description: "حل المعادلات التربيعية بطرق مختلفة",
                        type: "video",
                        isFree: true,
                        completed: false
                    }
                ]
            },
            {
                id: "week2",
                title: "الأسبوع الأول",
                term: "term2",
                lessons: [
                    {
                        id: "lesson2",
                        title: "التفاضل والتكامل",
                        description: "مقدمة في التفاضل والتكامل",
                        type: "video",
                        isFree: true,
                        completed: false
                    }
                ]
            }
        ]
    }
];

const LessonCard = ({ lesson, teacherId, weekId, onToggleComplete }) => {
    const cardBg = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("gray.800", "white");
    const descColor = useColorModeValue("gray.500", "gray.400");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    
    // Prevent checkbox click from triggering navigation
    const handleCheckboxClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleComplete();
    };

    return (
        <Link 
            href={`/Student/teacher/${teacherId}/lesson/${lesson.id}`}
            style={{ textDecoration: 'none', display: 'block' }}
        >
            <Box 
                bg={cardBg}
                p={5} 
                borderRadius="2xl" 
                border="1px solid"
                borderColor={borderColor}
                boxShadow={useColorModeValue("0 2px 4px rgba(0,0,0,0.1)", "0 2px 4px rgba(0,0,0,0.3)")}
                _hover={{ shadow: useColorModeValue("0 6px 8px rgba(255, 90, 126, 0.24)", "0 6px 8px rgba(255, 90, 126, 0.15)"), transform: "translateY(-2px)" }}
                transition="all 0.2s"
                cursor="pointer"
            >
                <Flex align="center" justify="space-between" gap={4}>
                    <Flex direction="column" flex="1" gap={2} mx={5}>
                        <Flex align="center" justify="flex-start" flexWrap="wrap" gap={2}>
                            <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color={textColor}>
                                {lesson.title}
                            </Text>
                            {lesson.isFree && (
                                <Badge 
                                    bg="#FF5A7E" 
                                    color="white" 
                                    px={3} 
                                    py={1} 
                                    borderRadius="full"
                                    fontSize="xs"
                                >
                                    حصة مجانية
                                </Badge>
                            )}
                        </Flex>
                        <Text fontSize={{ base: "xs", md: "sm" }} color={descColor}>
                            {lesson.description}
                        </Text>
                    </Flex>
                    <form onClick={(e) => e.preventDefault()}>
                        <label>
                            <input
                                type="checkbox"
                                checked={lesson.completed}
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
            </Box>
        </Link>
    );
};

const TermSection = ({ title, weeks, teacherId, onToggleComplete }) => {
    const weekHeaderBg = useColorModeValue("gray.50", "#1F2937");
    const weekHeaderColor = useColorModeValue("gray.700", "white");
    
    if (weeks.length === 0) return null;
    
    return (
        <Box mb={10}>
            <Flex align="center" gap={4} mb={3}>
                <MdBookmarks size={20} color="#FF5A7E"  />
                <Heading 
                    size={{ base: "xl", md: "3xl" }}
                    color="#FF5A7E"
                    fontWeight="bold"
                    mr={-3}
                >
                    {title}
                </Heading>
            </Flex>
            <VStack gap={8} align="stretch">
                {weeks.map((week) => (
                    <Box key={week.id}>
                        <Heading 
                            size={{ base: "sm", md: "md" }}
                            color={weekHeaderColor}
                            mb={4}
                            textAlign="right"
                            bg={weekHeaderBg}
                            p={3}
                            borderRadius="lg"
                        >
                            {week.title}
                        </Heading>
                        <VStack gap={3} align="stretch">
                            {week.lessons.map((lesson) => (
                                <LessonCard
                                    key={lesson.id}
                                    lesson={lesson}
                                    teacherId={teacherId}
                                    weekId={week.id}
                                    onToggleComplete={() => onToggleComplete(week.id, lesson.id)}
                                />
                            ))}
                        </VStack>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default function TeacherDetailPage() {
    const params = useParams();
    const teacherId = params?.id;
    
    const getInitialWeeks = () => {
        if (!teacherId) return [];
        const teacher = mockTeachers.find(t => t.id === teacherId);
        return teacher?.weeks || [];
    };
    
    const [lessonData, setLessonData] = useState(getInitialWeeks);
    const [selectedTerm, setSelectedTerm] = useState("all");

    useEffect(() => {
        if (teacherId) {
            const teacher = mockTeachers.find(t => t.id === teacherId);
            if (teacher) {
                setLessonData(teacher.weeks);
            }
        }
    }, [teacherId]);

    const teacher = mockTeachers.find(t => t.id === teacherId);

    if (!teacher) {
        return (
            <Container maxW="container.md" py={20} dir="rtl">
                <VStack gap={4}>
                    <Text fontSize="xl" color="gray.500">
                        المدرس غير موجود
                    </Text>
                    <Link href="/Student/teacher">
                        <Button bg="#00A3E0" color="white" _hover={{ bg: "#0088C0" }}>
                            العودة إلى قائمة المدرسين
                        </Button>
                    </Link>
                </VStack>
            </Container>
        );
    }

    const handleToggleComplete = (weekId, lessonId) => {
        setLessonData(prevWeeks =>
            prevWeeks.map(week =>
                week.id === weekId
                    ? {
                          ...week,
                          lessons: week.lessons.map(lesson =>
                              lesson.id === lessonId
                                  ? { ...lesson, completed: !lesson.completed }
                                  : lesson
                          )
                      }
                    : week
            )
        );
    };

    const term1Weeks = lessonData.filter(week => week.term === "term1");
    const term2Weeks = lessonData.filter(week => week.term === "term2");
    const pageBg = useColorModeValue("#FAFAFA", "#0F172A");
    const headerTextColor = useColorModeValue("gray.800", "white");
    const buttonBg = useColorModeValue("white", "#2D3748");
    const buttonHoverBg = useColorModeValue("gray.100", "#374151");
    const buttonBorderColor = useColorModeValue("gray.300", "#4B5563");
    const arrowBg = useColorModeValue("black", "#2D3748");

    return (
        <Box bg={pageBg} minH="100vh" dir="rtl">
            <Box py={6} px={{ base: 2, sm: 4, md: 8 }}>
                <Container maxW="container.xl">
                    <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
                        <Flex align="center" gap={3} flexWrap="wrap">
                            <Link href="/Student/teacher">
                                <MdArrowCircleRight size={35} color={useColorModeValue("black", "white")} style={{ cursor: 'pointer' }} />
                            </Link>
                            <VStack align="flex-start" gap={0}>
                                <Text fontWeight="bold" fontSize={{ base: "sm", sm: "md", md: "xl" }} color={headerTextColor}>
                                    {teacher.subject} | م/{teacher.name}
                                </Text>
                            </VStack>
                        </Flex>
                    </Flex>
                    
                    <HStack gap={{ base: 1, md: 3 }} mt={8} flexWrap="wrap" mb={-5} justify={{ base: "center", md: "flex-start" }}>
                        <Button
                            bg={selectedTerm === "all" ? "#FF5A7E" : buttonBg}
                            color={selectedTerm === "all" ? "white" : useColorModeValue("gray.700", "white")}
                            borderRadius="xl"
                            px={{ base: 3, md: 6 }}
                            py={{ base: 1, md: 2 }}
                            onClick={() => setSelectedTerm("all")}
                            _hover={{ bg: selectedTerm === "all" ? "#FF5A7E" : buttonHoverBg }}
                            border={selectedTerm === "all" ? "none" : "1px solid"}
                            borderColor={buttonBorderColor}
                            fontSize={{ base: "xs", md: "md" }}
                        >
                            الكل
                        </Button>
                        <Button
                            bg={selectedTerm === "term1" ? "#FF5A7E" : buttonBg}
                            color={selectedTerm === "term1" ? "white" : useColorModeValue("gray.700", "white")}
                            borderRadius="xl"
                            px={{ base: 3, md: 6 }}
                            py={{ base: 1, md: 2 }}
                            onClick={() => setSelectedTerm("term1")}
                            _hover={{ bg: selectedTerm === "term1" ? "#FF5A7E" : buttonHoverBg }}
                            border={selectedTerm === "term1" ? "none" : "1px solid"}
                            borderColor={buttonBorderColor}
                            fontSize={{ base: "xs", md: "md" }}
                        >
                            الترم الأول 
                        </Button>
                        <Button
                            bg={selectedTerm === "term2" ? "#FF5A7E" : buttonBg}
                            color={selectedTerm === "term2" ? "white" : useColorModeValue("gray.700", "white")}
                            borderRadius="xl"
                            px={{ base: 3, md: 6 }}
                            py={{ base: 1, md: 2 }}
                            onClick={() => setSelectedTerm("term2")}
                            _hover={{ bg: selectedTerm === "term2" ? "#FF5A7E" : buttonHoverBg }}
                            border={selectedTerm === "term2" ? "none" : "1px solid"}
                            borderColor={buttonBorderColor}
                            fontSize={{ base: "xs", md: "md" }}
                        >
                            الترم الثاني 
                        </Button>
                    </HStack>
                </Container>
            </Box>

            <Container maxW="container.xl" py={8} px={{ base: 2, sm: 4, md: 8 }}>
                {selectedTerm === "all" ? (
                    <VStack gap={2} align="stretch">
                        <TermSection 
                            title="الترم الأول" 
                            weeks={term1Weeks} 
                            teacherId={teacherId}
                            onToggleComplete={handleToggleComplete}
                        />
                        {term1Weeks.length > 0 && term2Weeks.length > 0 }
                        <TermSection 
                            title="الترم الثاني" 
                            weeks={term2Weeks} 
                            teacherId={teacherId}
                            onToggleComplete={handleToggleComplete}
                        />
                    </VStack>
                ) : selectedTerm === "term1" ? (
                    <TermSection 
                        title="الترم الأول"
                        weeks={term1Weeks} 
                        teacherId={teacherId}
                        onToggleComplete={handleToggleComplete}
                    />
                ) : (
                    <TermSection 
                        title="الترم الثاني"
                        weeks={term2Weeks} 
                        teacherId={teacherId}
                        onToggleComplete={handleToggleComplete}
                    />
                )}
            </Container>
        </Box>
    );
}