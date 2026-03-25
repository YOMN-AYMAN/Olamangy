"use client"
import { useState, useEffect } from "react";
import { Box, Text, Flex, Button, VStack, Heading, Input } from "@chakra-ui/react";
import { rtdb } from "@/auth/firebase";
import { ref, get } from "firebase/database";
import { MdSearch, MdStar } from "react-icons/md";
import Link from "next/link";

const subjectLabels = {
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

export default function TeacherPackagesTab({ onSubscribe }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoadingTeachers(true);
            try {
                const teachersSnap = await get(ref(rtdb, "teachers"));
                const usersSnap = await get(ref(rtdb, "users"));

                if (!teachersSnap.exists()) { setLoadingTeachers(false); return; }

                const teachersData = teachersSnap.val();
                const usersData = usersSnap.exists() ? usersSnap.val() : {};

                const approvedTeachers = Object.entries(teachersData)
                    .filter(([, t]) => t.status === "approved")
                    .map(([id, t]) => {
                        const user = usersData[id] || {};
                        return {
                            id,
                            name: user.fullName || "مدرس",
                            subject: subjectLabels[t.subjectId] || t.subjectId || "—",
                            subjectId: t.subjectId,
                            image: user.avatar || t.profileImage || null,
                            rating: t.rating || 0,
                            students: t.totalStudents || 0,
                            language: t.language || "",
                        };
                    });

                setTeachers(approvedTeachers);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingTeachers(false);
            }
        };
        fetchTeachers();
    }, []);

    const filtered = teachers.filter((t) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            t.name.toLowerCase().includes(q) ||
            t.subject.toLowerCase().includes(q) ||
            (t.subjectId || "").toLowerCase().includes(q)
        );
    });

    return (
        <VStack gap={8} align="stretch" w="100%">
            {/* Description Banner */}
            <Box
                border="2px solid fg.blue"
                p={{ base: 4, md: 8 }}
                mx={{ base: 2, sm: 4, md: 12 }}
                borderRadius="2xl"
                textAlign="right"
                overflow="hidden"
                boxShadow="0 2px 8px rgba(0,163,224,0.4)"
                bg="bg.panel"
            >
                <Text color="fg.blue" fontSize={{ base: "sm", md: "lg" }} fontWeight="medium">
                    هذه الباقة تتيح لك الاشتراك مع مدرس معين أو أكثر حسب شروط يحددها المدرس
                </Text>
            </Box>

            {/* Search Bar */}
            <Flex
                maxW="600px"
                mx="auto"
                w="100%"
                bg="bg.panel"
                borderRadius="2xl"
                px={{ base: 3, md: 6 }}
                py={2}
                align="center"
                gap={3}
                boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                border="2px solid"
                borderColor="border.subtle"
            >
                <MdSearch size={24} color="rgb(0, 158, 222)" />
                <Input
                    placeholder="ابحث عن المدرس بالاسم أو التخصص..."
                    bg="transparent"
                    border="none"
                    textAlign="right"
                    fontSize={{ base: "sm", md: "md" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    _placeholder={{ color: "fg.subtle" }}
                    _focus={{ outline: "none" }}
                    color="fg.DEFAULT"
                    flex="1"
                />
            </Flex>

            {/* Section Title */}
            <Flex align="center" gap={3} mt={2}>
                <Box bg="bg.subtle" borderRadius="full" p={2}>
                    <MdStar size={24} color="rgb(0, 158, 222)" />
                </Box>
                <Heading size="lg" color="fg.DEFAULT">
                    المدرسون المتاحون
                </Heading>
            </Flex>

            {/* Teachers Grid */}
            {loadingTeachers ? (
                <Text textAlign="center" color="fg.muted" py={10}>جاري التحميل...</Text>
            ) : filtered.length === 0 ? (
                <Text textAlign="center" color="fg.muted" py={10}>لا يوجد مدرسون مطابقون للبحث</Text>
            ) : (
                <Flex
                    gap={{ base: 4, md: 6 }}
                    justify="center"
                    flexWrap="wrap"
                    px={{ base: 2, md: 0 }}
                >
                    {filtered.map((teacher) => (
                        <Link key={teacher.id} href={`/Student/teacher/${teacher.id}`}>
                            <Box
                                bg="bg.panel"
                                borderRadius="3xl"
                                p={6}
                                minW={{ base: "100%", sm: "240px" }}
                                maxW="300px"
                                border="2px solid"
                                borderColor="border.DEFAULT"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={4}
                                boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                                _hover={{
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 12px 40px rgba(0,163,224,0.2)",
                                    borderColor: "fg.blue"
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                position="relative"
                                overflow="hidden"
                            >
                                {/* Decorative circle */}
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

                                {/* Avatar */}
                                <Box
                                    w="120px"
                                    h="120px"
                                    borderRadius="full"
                                    overflow="hidden"
                                    border="4px solid"
                                    borderColor="fg.blue"
                                    boxShadow="0 8px 24px rgba(0,163,224,0.3)"
                                    bg="bg.muted"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {teacher.image && !teacher.image.startsWith("data:") ? (
                                        <img
                                            src={teacher.image}
                                            alt={teacher.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <Text fontSize="3xl" color="fg.blue" fontWeight="bold">
                                            {teacher.name?.charAt(0) || "م"}
                                        </Text>
                                    )}
                                </Box>

                                {/* Info */}
                                <VStack gap={1} align="center" w="100%">
                                    <Text fontSize="xl" fontWeight="bold" color="fg.blue" textAlign="center">
                                        م/ {teacher.name}
                                    </Text>
                                    <Text fontSize="sm" color="fg.muted" textAlign="center">
                                        {teacher.subject}
                                    </Text>
                                    {teacher.language && (
                                        <Text fontSize="xs" color="fg.subtle" textAlign="center">
                                            لغة الشرح: {teacher.language}
                                        </Text>
                                    )}
                                </VStack>

                                {/* Stats */}
                                <Flex gap={4} w="100%" justify="center" flexWrap="wrap">
                                    <Flex
                                        align="center"
                                        gap={1}
                                        bg="bg.subtle"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                    >
                                        <Text fontSize="sm" fontWeight="bold" color="#FF9800">
                                            {teacher.rating > 0 ? teacher.rating : "—"}
                                        </Text>
                                        <MdStar size={16} color="#FF9800" />
                                    </Flex>
                                    <Flex
                                        align="center"
                                        gap={1}
                                        bg="bg.subtle"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                    >
                                        <Text fontSize="sm" fontWeight="bold" color="fg.blue">
                                            {teacher.students}
                                        </Text>
                                        <Text fontSize="xs" color="fg.muted">طالب</Text>
                                    </Flex>
                                </Flex>

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
                                    _active={{ transform: "translateY(0)" }}
                                    transition="all 0.2s"
                                    onClick={(e) => { e.preventDefault(); onSubscribe({ type: "teacher", teacher }); }}
                                >
                                    اشترك الآن
                                </Button>
                            </Box>
                        </Link>
                    ))}
                </Flex>
            )}
        </VStack>
    );
}
