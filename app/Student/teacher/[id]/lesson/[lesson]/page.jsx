"use client"

import { useState, useEffect } from "react";
import { Box, Container, Text, Flex, Button, VStack, HStack, Heading, Icon, Spinner, Center } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
    MdArrowCircleRight, 
    MdPlayCircle, 
    MdInsertDriveFile, 
    MdHelpOutline,
    MdHelp,
    MdVideocam,
    MdQuiz
} from "react-icons/md";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/auth/firebase";

// Component to render part content
const PartViewer = ({ part }) => {
    const bgColor = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("gray.800", "white");

    if (!part) return null;

    if (part.type === "video") {
        return (
            <VStack gap={4} w="100%" align="stretch">
                <Box borderRadius="2xl" overflow="hidden" shadow="lg" aspectRatio={16/9} bg="black" position="relative">
                    {part.videoUrl ? (
                        <iframe
                            src={`https://iframe.mediadelivery.net/embed/595363/${part.videoUrl}?autoplay=false&loop=false&muted=false&preload=true`}
                            width="100%"
                            height="100%"
                            style={{ position: "absolute", top: 0, left: 0, border: "none" }}
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <Center w="100%" h="100%" color="white">لا يوجد فيديو</Center>
                    )}
                </Box>
                <VStack align="flex-start" p={2}>
                    <Heading size="md" color={textColor}>{part.title || "فيديو"}</Heading>
                    {part.description && <Text color="gray.500">{part.description}</Text>}
                </VStack>
            </VStack>
        );
    }

    if (part.type === "file") {
        return (
            <VStack gap={4} w="100%" align="stretch">
                <Box bg={bgColor} p={6} borderRadius="xl" border="1px solid" borderColor={useColorModeValue("gray.200", "gray.700")} textAlign="center">
                    <Icon as={MdInsertDriveFile} boxSize={16} color="blue.500" mb={4} />
                    <Heading size="md" color={textColor} mb={2}>{part.title || "ملف"}</Heading>
                    {part.description && <Text color="gray.500" mb={4}>{part.description}</Text>}
                    {part.fileUrl && (
                        <Button as="a" href={part.fileUrl} target="_blank" rel="noopener noreferrer" bg="blue.500" color="white" _hover={{bg: "blue.600"}}>
                            تحميل أو عرض الملف
                        </Button>
                    )}
                </Box>
            </VStack>
        );
    }

    if (part.type === "exam") {
        return (
            <VStack gap={4} w="100%" align="stretch">
                <Box bg={bgColor} p={6} borderRadius="xl" border="1px solid" borderColor={useColorModeValue("gray.200", "gray.700")} textAlign="center">
                    <Icon as={MdQuiz} boxSize={16} color="purple.500" mb={4} />
                    <Heading size="md" color={textColor} mb={2}>{part.title || "تمرين / امتحان"}</Heading>
                    {part.description && <Text color="gray.500" mb={4}>{part.description}</Text>}
                    <Button bg="purple.500" color="white" size="lg" _hover={{bg: "purple.600"}}>
                        بدء التمرين
                    </Button>
                </Box>
            </VStack>
        );
    }

    return <Center p={10}>محتوى غير مدعوم</Center>;
};

export default function LessonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const pageBg = useColorModeValue("white", "#0F172A");
    const headingColor = useColorModeValue("gray.800", "white");
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [partOrder, setPartOrder] = useState([]);
    const [activePartId, setActivePartId] = useState(null);

    useEffect(() => {
        if (!params.id || !params.lesson) return;

        const lessonPathRef = ref(rtdb, `teachers/${params.id}/arrLessons/${params.lesson}`);
        
        const unsubscribePath = onValue(lessonPathRef, (snapshot) => {
            if (snapshot.exists()) {
                const path = snapshot.val();
                const lessonRef = ref(rtdb, `teachers/${params.id}/lessons/${path}/${params.lesson}`);
                onValue(lessonRef, (lessonSnapshot) => {
                    if (lessonSnapshot.exists()) {
                        const data = lessonSnapshot.val();
                        setLesson(data);
                        // Pages array mapping (index 0 is null usually, parts start at 1)
                        const pagesData = data?.pages || data?.arr;
                        if (pagesData) {
                            const keys = Object.keys(pagesData);
                            const order = keys.map(Number).filter(i => i > 0 || pagesData === data?.arr).sort((a,b) => a-b);
                            
                            setPartOrder(order);
                            // Set to first part if not already set
                            if (order.length > 0 && activePartId === null) {
                                setActivePartId(order[0]);
                            }
                        } else {
                            setPartOrder([]);
                        }
                    }
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        return () => {
            unsubscribePath();
        };
    }, [params.id, params.lesson]);

    if (loading) {
        return (
            <Center minH="100vh" bg={pageBg}>
                <Spinner size="xl" color="#00BCD4" thickness="4px" />
            </Center>
        );
    }

    if (!lesson) {
        return (
            <Center minH="100vh" bg={pageBg} flexDir="column" gap={4}>
                <Text fontSize="xl" color="gray.500">الدرس غير موجود</Text>
                <Button colorScheme="blue" onClick={() => router.push(`/Student/teacher/${params.id}`)}>العودة</Button>
            </Center>
        );
    }

    const pagesData = lesson?.pages || lesson?.arr;
    const currentPartContent = pagesData ? pagesData[activePartId] : null;

    return (
        <Box minH="100vh" dir="rtl" bg={pageBg}>
            <Box mx={{ base: 0, sm: 1, md: 4, lg: 8 }} minH="100vh">
                <Container maxW="container.lg" py={{ base: 3, sm: 4, md: 8 }} px={{ base: 2, sm: 3, md: 4, lg: 6 }}>
                    
                    {/* Header */}
                    <Flex align="center" gap={3} mb={6} flexWrap="wrap">
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
                            {lesson?.title}
                        </Heading>
                    </Flex>

                    {/* Parts Navigation Bar */}
                    <Box
                        width="100%"
                        overflowX="auto"
                        bg={useColorModeValue("gray.50", "#1A202C")}
                        p={4}
                        borderRadius="2xl"
                        shadow="sm"
                        mb={6}
                        border="1px solid"
                        borderColor={useColorModeValue("gray.200", "gray.700")}
                    >
                        {partOrder.length > 0 ? (
                            <HStack gap={3} justify="start" wrap="nowrap">
                                {partOrder.map((pageIdx, idx) => {
                                    const isActive = activePartId === pageIdx;
                                    const partData = pagesData[pageIdx];
                                    // if part uses 0 index and it's from arr, show it as Part 1
                                    const displayNum = pagesData === lesson?.arr ? idx + 1 : idx + 1;
                                    return (
                                        <Button
                                            key={pageIdx}
                                            onClick={() => setActivePartId(pageIdx)}
                                            variant={isActive ? "solid" : "outline"}
                                            bg={isActive ? "#FF5A7E" : "transparent"}
                                            color={isActive ? "white" : useColorModeValue("gray.700", "gray.300")}
                                            borderColor={isActive ? "#FF5A7E" : useColorModeValue("gray.300", "gray.600")}
                                            borderRadius="xl"
                                            size="md"
                                            px={6}
                                            _hover={{ bg: isActive ? "#E0486D" : useColorModeValue("gray.100", "gray.700") }}
                                            transition="all 0.2s"
                                            flexShrink={0}
                                        >
                                            بارت {displayNum}
                                        </Button>
                                    );
                                })}
                            </HStack>
                        ) : (
                            <Text textAlign="center" color="gray.500">لا يوجد محتوى في هذا الدرس حالياً</Text>
                        )}
                    </Box>

                    {/* Active Part Content */}
                    <Box mt={4}>
                        {currentPartContent ? (
                            <PartViewer part={currentPartContent} />
                        ) : (
                            <Center p={10} color="gray.500">قم باختيار جزء لعرض المحتوى</Center>
                        )}
                    </Box>

                </Container>
            </Box>
        </Box>
    );
}