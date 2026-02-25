"use client"

import { useState, useEffect } from "react";
import { Box, SimpleGrid, Image, Text, Flex, Badge, Button, Wrap, WrapItem, Spinner, Center, Menu, Portal } from "@chakra-ui/react";
import Link from "next/link";
import { rtdb } from "@/auth/firebase";
import { ref, get, update } from "firebase/database";


// Status configuration matching Students page
const STATUS_CONFIG = {
    approved: { 
        label: "مفعل", 
        color: "blue", 
        borderColor: "blue.500",
        bg: "blue.50"
    },
    pending: { 
        label: "انتظار", 
        color: "orange", 
        borderColor: "orange.500",
        bg: "orange.50"
    },
    rejected: { 
        label: "مغلق", 
        color: "red", 
        borderColor: "red.500",
        bg: "red.50"
    }
};

const TeacherCard = ({ teacher, onStatusChange }) => {
    const status = STATUS_CONFIG[teacher.status] || STATUS_CONFIG.pending;
    
    const handleStatusClick = async (newStatus) => {
        if (newStatus === teacher.status) return;
        
        try {
            const teacherRef = ref(rtdb, `teachers/${teacher.id}`);
            await update(teacherRef, { status: newStatus });
            onStatusChange(teacher.id, newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <Box 
            bg="bg.subtle" 
            p={4} 
            borderRadius="2xl" 
            border="2px solid"
            borderColor={status.borderColor}
            cursor="pointer" 
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s" 
            dir="rtl"
        >
            <Flex align="center" gap={4}>
                <Link href={`/developer/teacher/${teacher.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                    <Flex align="center" gap={4}>
                        <Image 
                            src={teacher.photoURL || "https://i.pravatar.cc/300?u=iu"} 
                            borderRadius="full" 
                            boxSize="70px" 
                            objectFit="cover" 
                            alt={teacher.name}
                        />
                        <Box flex="1">
                            <Text fontWeight="bold" fontSize="lg" color="#00A3E0"> م/ {teacher.name}</Text>
                            <Badge colorPalette="blue" variant="surface" mt={1} px={3}>
                                مدرس {teacher.subject}
                            </Badge>
                        </Box>
                        <Text fontSize="sm" color="blue.400" fontWeight="bold">
                            {teacher.studentCount} طالب
                        </Text>
                    </Flex>
                </Link>
                
                {/* Status Dropdown */}
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Badge 
                            colorPalette={status.color} 
                            variant="subtle" 
                            px="4" 
                            py="2" 
                            borderRadius="full"
                            cursor="pointer"
                            fontSize="sm"
                            _hover={{ opacity: 0.8 }}
                        >
                            {status.label}
                        </Badge>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item 
                                    value="approved"
                                    onClick={() => handleStatusClick('approved')}
                                    color="blue.600"
                                >
                                    مفعل
                                </Menu.Item>
                                <Menu.Item 
                                    value="pending"
                                    onClick={() => handleStatusClick('pending')}
                                    color="orange.600"
                                >
                                    انتظار
                                </Menu.Item>
                                <Menu.Item 
                                    value="rejected"
                                    onClick={() => handleStatusClick('rejected')}
                                    color="red.600"
                                >
                                    مغلق
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>
        </Box>
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
    { id: "all", label: "الكل", color: "red.400" },
    { id: "arabic", label: "اللغة العربية" },
    { id: "english", label: "اللغة الإنجليزية" },
    { id: "math", label: "الرياضيات" },
    { id: "physics", label: "الفيزياء" },
    { id: "chemistry", label: "الكيمياء" },
    { id: "biology", label: "الأحياء" },
    { id: "geography", label: "الجغرافيا" },
    { id: "history", label: "التاريخ" },
    { id: "philosophy", label: "الفلسفة" },
    { id: "psychology", label: "علم النفس" },
    { id: "economics", label: "الاقتصاد" },
    { id: "french", label: "اللغة الفرنسية" },
    { id: "german", label: "اللغة الألمانية" },
    { id: "italian", label: "اللغة الإيطالية" },
    { id: "spanish", label: "اللغة الإسبانية" },
    { id: "science", label: "العلوم" },
    { id: "social", label: "الدراسات الاجتماعية" },
    { id: "religion", label: "التربية الدينية" },
    { id: "art", label: "التربية الفنية" },
    { id: "music", label: "التربية الموسيقية" },
    { id: "sports", label: "التربية البدنية" },
    { id: "technology", label: "التكنولوجيا" },
    { id: "computers", label: "الحاسب الآلي" },
];

const VISIBLE_COUNT = 4;

export default function Teachers () {
    const [showAll, setShowAll] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all teachers from database (no status filter)
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const teachersRef = ref(rtdb, 'teachers');
                const teachersSnapshot = await get(teachersRef);
                
                if (teachersSnapshot.exists()) {
                    const teachersData = [];
                    const teacherPromises = [];
                    
                    teachersSnapshot.forEach((childSnapshot) => {
                        const teacher = childSnapshot.val();
                        
                        // Fetch user data for this teacher (all statuses)
                        const userPromise = get(ref(rtdb, 'users/' + teacher.userId))
                            .then(userSnapshot => {
                                const userData = userSnapshot.exists() ? userSnapshot.val() : {};
                                
                                return {
                                    id: childSnapshot.key,
                                    userId: teacher.userId,
                                    name: userData.fullName || userData.name || "غير معروف",
                                    subjectId: teacher.subjectId,
                                    subject: subjectNames[teacher.subjectId] || teacher.subjectId,
                                    studentCount: teacher.totalStudents || 0,
                                    photoURL: teacher.profileImage || userData.profileImage,
                                    status: teacher.status || 'pending', // Default to pending if no status
                                };
                            });
                        
                        teacherPromises.push(userPromise);
                    });
                    
                    const resolvedTeachers = await Promise.all(teacherPromises);
                    setTeachers(resolvedTeachers);
                }
            } catch (error) {
                console.error("Error fetching teachers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Handle status change locally after DB update
    const handleStatusChange = (teacherId, newStatus) => {
        setTeachers(prev => prev.map(t => 
            t.id === teacherId ? { ...t, status: newStatus } : t
        ));
    };

    // Filter teachers by selected subject
    const filteredTeachers = selectedSubject === "all" 
        ? teachers 
        : teachers.filter(t => t.subjectId === selectedSubject);

    const visibleSubjects = showAll ? allSubjects : allSubjects.slice(0, VISIBLE_COUNT);
    const hasMore = allSubjects.length > VISIBLE_COUNT;

    return (
        <>
            <Box p={4} dir="rtl">
                {/* الفلتر العلوي */}
                <Wrap spacing={4} mb={5} justify="flex-start">
                    {visibleSubjects.map((subject) => (
                        <WrapItem key={subject.id}>
                            <Button
                                w="fit-content"
                                minW="max-content" 
                                whiteSpace="nowrap"
                                bg={selectedSubject === subject.id ? (subject.color || "blue.500") : "bg.subtle"}
                                color={selectedSubject === subject.id ? "white" : "fg.DEFAULT"}
                                variant={selectedSubject === subject.id ? "solid" : "outline"}
                                borderRadius="xl"
                                px={4} 
                                h="40px" 
                                fontSize="sm"
                                onClick={() => setSelectedSubject(subject.id)}
                                _hover={{
                                    bg: selectedSubject === subject.id ? (subject.color || "blue.500") : "bg.muted"
                                }}
                            >
                                {subject.label}
                            </Button>
                        </WrapItem>
                    ))}
                    {!showAll && hasMore && (
                        <WrapItem>
                            <Button
                                width={20}
                                bg="black"
                                color="white"
                                borderRadius="xl"
                                onClick={() => setShowAll(true)}
                                _hover={{ bg: "gray.800" }}
                            >
                                المزيد
                            </Button>
                        </WrapItem>
                    )}
                    {showAll && hasMore && (
                        <WrapItem>
                            <Button
                                width={20}
                                bg="black"
                                color="white"
                                borderRadius="xl"
                                onClick={() => setShowAll(false)}
                                _hover={{ bg: "gray.800" }}
                            >
                                أقل
                            </Button>
                        </WrapItem>
                    )}
                </Wrap>

                {loading ? (
                    <Flex justify="center" py={8}>
                        <Spinner size="xl" color="#00A3E0" />
                    </Flex>
                ) : filteredTeachers.length === 0 ? (
                    <Center py={10}>
                        <Text color="gray.500" fontSize="lg">
                            لا يوجد مدرسين متاحين حالياً
                        </Text>
                    </Center>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        {filteredTeachers.map((teacher) => (
                            <TeacherCard 
                                key={teacher.id}
                                teacher={teacher}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </Box>
        </>
    );
}
