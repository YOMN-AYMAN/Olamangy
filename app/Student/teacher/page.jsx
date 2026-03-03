"use client"

import { useState, useEffect } from "react";
import { Box, SimpleGrid, Text, Flex, Badge, Button, Wrap, WrapItem, Center, Spinner, Avatar, Icon } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import Link from "next/link";
import { getDatabase, ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/auth/firebase";
import { MdPerson } from "react-icons/md";

// teacher example for testing
const mockTeacherExample = {
    id: "1",
    userId: "example-user-1",
    name: "أحمد محمد",
    subjectId: "math",
    subject: "الرياضيات",
    studentCount: 45,
    photoURL: "", 
};

const TeacherCard = ({ teacher }) => {
    const cardBg = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("#00A3E0", "#00BCD4");
    const borderColor = useColorModeValue("#00A3E0", "#0088C0");
    const hoverBorderColor = useColorModeValue("#0088C0", "#00ACC1");
    
    return (
        <Link href={`/Student/teacher/${teacher.id}`} style={{ textDecoration: 'none', width: '100%' }}>
            <Box 
                bg={cardBg}
                p={{ base: 3, sm: 4, md: 5 }}
                borderRadius="3xl" 
                border="2px solid"
                borderColor={borderColor}
                cursor="pointer" 
                _hover={{ shadow: "lg", transform: "translateY(-4px)", borderColor: hoverBorderColor }}
                transition="all 0.3s" 
                dir="rtl"
                mx={{ base: 1, sm: 2, md: 4, lg: 8 }}
                position="relative"
            >
                <Flex align="center" gap={{ base: 3, md: 4 }} justify="space-between">
                    {/* Right Side - Profile Image with fallback */}
                    <Avatar.Root 
                        size="xl"
                        bg={!teacher.photoURL ? "gray.200" : undefined}
                        color={!teacher.photoURL ? "gray.500" : undefined}
                    >
                        {teacher.photoURL ? (
                            <Avatar.Image src={teacher.photoURL} />
                        ) : (
                            <Avatar.Fallback>
                                <Icon as={MdPerson} boxSize={8} />
                            </Avatar.Fallback>
                        )}
                    </Avatar.Root>
                    
                    {/* Left Side - Text Content */}
                    <Flex direction="column" gap={2} flex="1" minW={0}>
                        {/* Teacher Name */}
                        <Text 
                            fontWeight="bold" 
                            fontSize={{ base: "md", md: "lg", lg: "xl" }}
                            color={textColor}
                            noOfLines={1}
                        >
                            م/ {teacher.name}
                        </Text>
                        
                        <Flex 
                            direction={{ base: "column", sm: "row" }}
                            gap={{ base: 2, sm: 4 }}
                            align={{ base: "flex-start", sm: "center" }}
                            justify="space-between"
                            mt={{ base: 1, md: 2 }}
                            flexWrap="wrap"
                        >
                            {/* Subject Badge */}
                            <Badge 
                                bg="#00A3E0" 
                                color="white" 
                                px={{ base: 3, md: 4 }}
                                py={1} 
                                borderRadius="full"
                                fontSize={{ base: "2xs", md: "xs" }}
                                fontWeight="semibold"
                                width="fit-content"
                                flexShrink={0}
                            >
                                مدرس {teacher.subject}
                            </Badge>
                            
                            {/* Student Count */}
                            <Text 
                                fontSize={{ base: "xs", md: "sm" }}
                                color={textColor}
                                fontWeight="semibold"
                                flexShrink={0}
                            >
                                {teacher.studentCount} طالب
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Link>
    );
};

// Subject ID to Arabic name mapping
const subjectNames = {
    arabic: "اللغة العربية",
    english: "اللغة الإنجليزية",
    math: "الرياضيات",
    physics: "الفيزياء",
    chemistry: "الكيمياء",
    biology: "الأحياء",
    geography: "الجغرافيا",
    history: "التاريخ",
    philosophy: "الفلسفة",
    psychology: "علم النفس",
    economics: "الاقتصاد",
    french: "اللغة الفرنسية",
    german: "اللغة الألمانية",
    italian: "اللغة الإيطالية",
    spanish: "اللغة الإسبانية",
    science: "العلوم",
    social: "الدراسات الاجتماعية",
    religion: "التربية الدينية",
    art: "التربية الفنية",
    music: "التربية الموسيقية",
    sports: "التربية البدنية",
    technology: "التكنولوجيا",
    computers: "الحاسب الآلي",
};

const allSubjects = [
    { id: "all", label: "الكل", color: "#FF5A7E" },
    { id: "arabic", label: "اللغة العربية", color: "#FF5A7E" },
    { id: "english", label: "اللغة الإنجليزية", color: "#FF5A7E" },
    { id: "math", label: "الرياضيات", color: "#FF5A7E" },
    { id: "physics", label: "الفيزياء", color: "#FF5A7E" },
    { id: "chemistry", label: "الكيمياء", color: "#FF5A7E" },
    { id: "biology", label: "الأحياء", color: "#FF5A7E" },
    { id: "geography", label: "الجغرافيا", color: "#FF5A7E" },
    { id: "history", label: "التاريخ", color: "#FF5A7E" },
    { id: "philosophy", label: "الفلسفة", color: "#FF5A7E" },
    { id: "psychology", label: "علم النفس", color: "#FF5A7E" },
    { id: "economics", label: "الاقتصاد", color: "#FF5A7E" },
    { id: "french", label: "اللغة الفرنسية", color: "#FF5A7E" },
    { id: "german", label: "اللغة الألمانية", color: "#FF5A7E" },
    { id: "italian", label: "اللغة الإيطالية", color: "#FF5A7E" },
    { id: "spanish", label: "اللغة الإسبانية", color: "#FF5A7E" },
    { id: "science", label: "العلوم", color: "#FF5A7E" },
    { id: "social", label: "الدراسات الاجتماعية", color: "#FF5A7E" },
    { id: "religion", label: "التربية الدينية", color: "#FF5A7E" },
    { id: "art", label: "التربية الفنية", color: "#FF5A7E" },
    { id: "music", label: "التربية الموسيقية", color: "#FF5A7E" },
    { id: "sports", label: "التربية البدنية", color: "#FF5A7E" },
    { id: "technology", label: "التكنولوجيا", color: "#FF5A7E" },
    { id: "computers", label: "الحاسب الآلي", color: "#FF5A7E" },
];

const VISIBLE_COUNT = 8;

export default function Teachers() {
    const [showAll, setShowAll] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const pageBg = useColorModeValue("#FAFAFA", "#0F172A");
    const buttonBg = useColorModeValue("white", "#2D3748");
    const buttonHoverBg = useColorModeValue("#F5F5F5", "#374151");
    const buttonBorderColor = useColorModeValue("#E8E8E8", "#4B5563");
    const buttonTextColor = useColorModeValue("gray.700", "white");
    const moreButtonBg = useColorModeValue("black", "#2D3748");
    const moreButtonHoverBg = useColorModeValue("gray.800", "#374151");

    // Fetch student's teachers from Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getDatabase();
                
                const studentRef = ref(db, `users/${user.uid}`);
                onValue(studentRef, (studentSnapshot) => {
                    const studentData = studentSnapshot.val();
                    
                    if (studentData && studentData.teacherIds) {
                        // Convert teacherIds to array (handles both object and array formats)
                        let teacherIdsArray = [];
                        
                        if (Array.isArray(studentData.teacherIds)) {
                            teacherIdsArray = studentData.teacherIds;
                        } else if (typeof studentData.teacherIds === 'object') {
                            teacherIdsArray = Object.values(studentData.teacherIds);
                        }
                        
                        if (teacherIdsArray.length === 0) {
                            setTeachers([]);
                            setLoading(false);
                            return;
                        }
                        
                        // Fetch each teacher's details from both teachers and users nodes
                        const teacherPromises = teacherIdsArray.map((teacherId) => {
                            return new Promise((resolve) => {
                                // First get teacher data (subject, totalStudents) from teachers node
                                const teacherRef = ref(db, `teachers/${teacherId}`);
                                onValue(teacherRef, (teacherSnapshot) => {
                                    const teacherData = teacherSnapshot.val();
                                    
                                    if (teacherData) {
                                        // Then get user data (name, avatar) from users node
                                        const userRef = ref(db, `users/${teacherId}`);
                                        onValue(userRef, (userSnapshot) => {
                                            const userData = userSnapshot.val();
                                            
                                            resolve({
                                                id: teacherId,
                                                userId: teacherId,
                                                name: userData?.fullName || "مدرس",
                                                subjectId: teacherData.subjectId || "unknown",
                                                subject: subjectNames[teacherData.subjectId] || "مادة غير محددة",
                                                studentCount: teacherData.totalStudents || 0,
                                                photoURL: userData?.avatar || "",
                                            });
                                        }, { onlyOnce: true });
                                    } else {
                                        resolve(null);
                                    }
                                }, { onlyOnce: true });
                            });
                        });
                        
                        Promise.all(teacherPromises).then((fetchedTeachers) => {
                            const validTeachers = fetchedTeachers.filter(t => t !== null);
                            // example for testing
                            setTeachers([mockTeacherExample, ...validTeachers]);
                            setLoading(false);
                        });
                    } else {
                        //  example
                        setTeachers([mockTeacherExample]);
                        setLoading(false);
                    }
                }, (error) => {
                    console.error("Error fetching student data:", error);
                    //  example on error
                    setTeachers([mockTeacherExample]);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Filter teachers by selected subject
    const filteredTeachers = selectedSubject === "all" 
        ? teachers 
        : teachers.filter(t => t.subjectId === selectedSubject);

    const visibleSubjects = showAll ? allSubjects : allSubjects.slice(0, VISIBLE_COUNT);
    const hasMore = allSubjects.length > VISIBLE_COUNT;

    if (loading) {
        return (
            <Center h="100vh" bg={pageBg}>
                <Spinner size="xl" color="#00A3E0" />
            </Center>
        );
    }

    return (
        <>
            <Box p={{ base: 4, md: 6, lg: 8 }} dir="rtl" bg={pageBg} minH="100vh" w="100%">
                {/* Subject Filter Pills */}
                <Wrap spacing={{ base: 2, md: 3 }} mb={{ base: 4, md: 6 }} justify="flex-start">
                    {visibleSubjects.map((subject) => (
                        <WrapItem key={subject.id}>
                            <Button
                                bg={selectedSubject === subject.id ? subject.color : buttonBg}
                                color={selectedSubject === subject.id ? "white" : buttonTextColor}
                                variant="solid"
                                borderRadius="xl"
                                px={{ base: 4, md: 6 }}
                                py={2}
                                h="auto"
                                fontWeight="medium"
                                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                                border={selectedSubject === subject.id ? "none" : "1px solid"}
                                borderColor={buttonBorderColor}
                                onClick={() => setSelectedSubject(subject.id)}
                                _hover={{
                                    bg: selectedSubject === subject.id ? subject.color : buttonHoverBg,
                                    transform: "translateY(-2px)"
                                }}
                                transition="all 0.2s"
                            >
                                {subject.label}
                            </Button>
                        </WrapItem>
                    ))}
                    {!showAll && hasMore && (
                        <WrapItem>
                            <Button
                                bg={moreButtonBg}
                                color="#FF7A9E"
                                borderRadius="xl"
                                px={{ base: 4, md: 6 }}
                                py={2}
                                h="auto"
                                fontWeight="medium"
                                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                                onClick={() => setShowAll(true)}
                                _hover={{ bg: moreButtonHoverBg, transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                المزيد
                            </Button>
                        </WrapItem>
                    )}
                    {showAll && hasMore && (
                        <WrapItem>
                            <Button
                                bg={moreButtonBg}
                                color="#FF7A9E"
                                borderRadius="xl"
                                px={{ base: 4, md: 6 }}
                                py={2}
                                h="auto"
                                fontWeight="medium"
                                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                                onClick={() => setShowAll(false)}
                                _hover={{ bg: moreButtonHoverBg, transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                أقل
                            </Button>
                        </WrapItem>
                    )}
                </Wrap>

                {filteredTeachers.length === 0 ? (
                    <Center py={20}>
                        <Text color="gray.500" fontSize={{ base: "md", md: "lg" }}>
                            لا يوجد مدرسين متاحين حالياً
                        </Text>
                    </Center>
                ) : (
                    <SimpleGrid 
                        columns={{ base: 1, md: 2, lg: 2, xl: 2 }} 
                        gap={{ base: 3, md: 4, lg: 6 }}
                        w="100%"
                    >
                        {filteredTeachers.map((teacher) => (
                            <TeacherCard 
                                key={teacher.id}
                                teacher={teacher}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </Box>
        </>
    );
}