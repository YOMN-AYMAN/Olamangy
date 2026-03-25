"use client"
import { 
    Box, Heading, HStack, Icon, Input, Flex, Card, Avatar, SimpleGrid, Text , VStack,
    Badge, Spinner, Center, Button
} from "@chakra-ui/react";
import { MdVideoLibrary, MdSearch } from "react-icons/md";
import { useAuth } from "@/providers/AuthContext";
import { useStudent } from "@/providers/studentProvider";
import { useState, useEffect } from "react";
import { rtdb } from "@/auth/firebase";
import { ref, get } from "firebase/database";
import Link from "next/link";

export default function AllLessons() {
    const { user } = useAuth();
    const { studentProfile, subscriptions } = useStudent();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png";

    useEffect(() => {
        if (!studentProfile || !subscriptions.length) {
            setLoading(false);
            return;
        }

        const fetchAllLessons = async () => {
            const subbedTeachers = subscriptions.filter(s => s.type === "teacher" && s.status === "approved");
            const stage = studentProfile.academicStage;
            const year = studentProfile.academicYear;
            
            let allFetched = [];

            for (const sub of subbedTeachers) {
                // Fetch basic teacher name for display
                const teacherId = sub.teacherId;
                const lessonsRef = ref(rtdb, `teachers/${teacherId}/lessons/${stage}/${year}`);
                
                try {
                    const snap = await get(lessonsRef);
                    if (snap.exists()) {
                        const semesters = snap.val();
                        Object.keys(semesters).forEach(sem => {
                            const semLessons = semesters[sem];
                            if (typeof semLessons === 'object') {
                                Object.keys(semLessons).forEach(lId => {
                                    allFetched.push({
                                        id: lId,
                                        teacherId,
                                        teacherName: sub.teacherName,
                                        semester: sem,
                                        ...semLessons[lId]
                                    });
                                });
                            }
                        });
                    }
                } catch (e) {
                    console.error("Error fetching lessons for teacher", teacherId, e);
                }
            }
            
            setLessons(allFetched.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
            setLoading(false);
        };

        fetchAllLessons();
    }, [studentProfile, subscriptions]);

    if (loading) return <Center h="80vh"><Spinner size="xl" color="blue.500" /></Center>;
    if (!studentProfile) return <Center h="80vh"><Text color="fg.muted">يرجى تسجيل الدخول أولاً</Text></Center>;

    return (
        <>
        <Box 
            p={{ base: 4, md: 8 }} 
            dir="rtl" 
            mr={{ base: "10px", md: "10px" }}
            transition="margin 0.3s"
        >
            <Flex 
                justify="space-between" 
                align={{ base: "stretch", md: "center" }} 
                mb={10} 
                direction={{ base: "column", md: "row" }} 
                gap={6}
            >
            <HStack gap={3}>
                <Icon as={MdVideoLibrary} boxSize={8} color="blue.500" />
                <Heading size={{ base: "lg", md: "xl" }} color="fg.muted">الدروس المتاحة 
                    <Badge variant="subtle" colorPalette="blue" ml={2} fontSize="md" borderRadius="full" px={3}>{lessons.length}</Badge>
                </Heading>
            </HStack>
            </Flex>

            <Box width="100%">

            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6}>
                {lessons.map((lesson) => (
                <Link key={lesson.id} href={`/Student/lesson/${lesson.id}?teacherId=${lesson.teacherId}&stage=${studentProfile.academicStage}&year=${studentProfile.academicYear}&semester=${lesson.semester}`} style={{ textDecoration: 'none' }}>
                    <Card.Root 
                        overflow="hidden" 
                        shadow="sm" 
                        border="1px solid"
                        borderColor="border.subtle"
                        _hover={{ shadow: "xl", transform: "translateY(-5px)", borderColor: "blue.300" }} 
                        transition="all 0.3s"
                        h="full"
                    >
                        <Card.Body p={3}>
                        <VStack gap={4} align="stretch">
                            <Box position="relative">
                                <Avatar.Root shape="rounded" size="full" h="160px">
                                    <Avatar.Image src={lesson.thumbnail || lessonImage} style={{ objectFit: 'cover' }} />
                                </Avatar.Root>
                                <Badge position="absolute" top={2} right={2} variant="solid" colorPalette="blue" borderRadius="lg">
                                    {lesson.teacherName}
                                </Badge>
                            </Box>
                            <Box textAlign="right" px={2} pb={2}>
                            <Card.Title mb={1} fontSize="md" color="fg.muted" noOfLines={1}>{lesson.title}</Card.Title>
                            <Card.Description fontSize="sm" noOfLines={2}>
                                {lesson.description || "لا يوجد وصف متاح لهذا الدرس حالياً."}
                            </Card.Description>
                            </Box>
                        </VStack>
                        </Card.Body>
                    </Card.Root>
                </Link>
                ))}
            </SimpleGrid>
            {lessons.length === 0 && (
                <Center py={20} flexDirection="column" gap={4}>
                    <Text color="gray.500">لا يوجد دروس متاحة لك حالياً.</Text>
                    <Button asChild variant="outline" colorPalette="blue" borderRadius="xl">
                        <Link href="/Student/subscriptions">استكشف المدرسين</Link>
                    </Button>
                </Center>
            )}
            </Box>
        </Box>
        </>
    );
}
