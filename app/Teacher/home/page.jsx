
"use client"
import { MdVideoLibrary, MdPeopleAlt, MdAnalytics, MdInfoOutline } from "react-icons/md";
import { 
    Box, Text, Heading, Icon, HStack, VStack, Card, Avatar, Table, Badge, SimpleGrid, Button,
    useBreakpointValue, Spinner, Center 
} from "@chakra-ui/react";
import { 
    DialogRoot, DialogContent, DialogHeader, DialogBody, DialogTitle, DialogCloseTrigger, DialogTrigger 
} from "@/components/ui/dialog";
import { 
    Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip 
} from "recharts";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useTeacher } from "@/providers/teacherProvider";
import { rtdb } from "@/auth/firebase";
import { ref, onValue } from "firebase/database";
import Link from "next/link";

export default function MainDashboard() {
    const { user } = useAuth();
    const { teacherProfile } = useTeacher();
    const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png";
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);

    // ── Load Lessons Data ────────────────────────────────────────────────
    useEffect(() => {
        if (!user) return;
        const lessonsRef = ref(rtdb, `teachers/${user.uid}/lessons`);
        const unsubscribe = onValue(lessonsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const allLessons = [];
                Object.keys(data).forEach((category) => {
                    const categoryData = data[category];
                    if (categoryData && typeof categoryData === "object") {
                        Object.keys(categoryData).forEach((lessonId) => {
                            const lessonItem = categoryData[lessonId];
                            // Validation: Only add if it's a valid object with a title
                            if (lessonItem && typeof lessonItem === "object" && lessonItem.title) {
                                allLessons.push({
                                    ...lessonItem,
                                    id: lessonId,
                                    views: lessonItem.views || 0,
                                    createdAt: lessonItem.createdAt || 0
                                });
                            }
                        });
                    }
                });
                setLessons(allLessons);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    // ── Update Students from Profile ─────────────────────────────────────
    useEffect(() => {
        if (teacherProfile?.subscriptions?.payed) {
            const list = Object.values(teacherProfile.subscriptions.payed).map(s => ({
                id: s.id,
                name: s.name,
                phone: s.phone || "—",
                email: s.email || "—",
                status: "مفعل",
                color: "green",
                lectures: 0 // Fetch from attendance if needed later
            }));
            setStudents(list.slice(0, 5));
        }
    }, [teacherProfile]);

    const chartData = lessons.map(l => ({
        name: l.title?.substring(0, 10) + "..",
        views: l.views || 0
    })).sort((a,b) => b.views - a.views).slice(0, 5);

    const featuredVideos = [...lessons].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

    if (loading) {
        return (
            <Center h="100vh" bg="bg.canvas">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
        );
    }

    return (
        <>
            <Box 
                p={{ base: 4, md: 8 }} 
                bg="bg.canvas" 
                minH="100vh" 
                dir="rtl" 
                mt={4}
                transition="margin 0.3s"
            >
                <VStack align="stretch" gap={10}>
                    
                    <Box>
                        <HStack mb={4} justify="space-between">
                            <HStack gap={2}>
                                <Icon as={MdVideoLibrary} color="blue.500" boxSize={6} />
                                <Heading size="md">أحدث الدروس المرفوعة</Heading>
                            </HStack>
                            <Link href="/Teacher/lessons">
                                <Button variant="ghost" size="sm" color="blue.600" fontWeight="bold">
                                    المزيد
                                </Button>
                            </Link>
                        </HStack>

                        <SimpleGrid columns={{ base: 1, sm: 2, lg: Math.min(3, featuredVideos.length || 1) }} gap={6}>
                            {featuredVideos.length > 0 ? featuredVideos.map((lesson) => (
                                <Link href={`/Teacher/lessons/${lesson.id}`} key={lesson.id}>
                                    <Card.Root overflow="hidden" shadow="sm" _hover={{ shadow: "md", transform: "translateY(-2px)" }} transition="all 0.2s">
                                        <Card.Body p={4}>
                                            <VStack gap={3}>
                                                <Avatar.Root shape="rounded" size="2xl" w="full" h="140px">
                                                    <Avatar.Image src={lesson.image || lessonImage} style={{ objectFit: 'cover' }} />
                                                </Avatar.Root>
                                                <Box textAlign="center">
                                                    <Card.Title fontSize="md" lineClamp={1}>{lesson.title}</Card.Title>
                                                    <Card.Description>تمت المشاهدة بواسطة {lesson.views} طالب</Card.Description>
                                                </Box>
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                </Link>
                            )) : (
                                <Box py={4} bg="bg.subtle" borderRadius="xl" w="full" gridColumn="span 3" textAlign="center">
                                    <Text color="fg.muted">لا توجد فيديوهات مرفوعة حالياً</Text>
                                </Box>
                            )}
                        </SimpleGrid>
                    </Box>

                    <Box bg="bg.panel" p={{ base: 4, md: 6 }} borderRadius="2xl" shadow="sm" overflow="hidden">
                        <HStack  mb={6} gap={2}>
                            <Icon as={MdPeopleAlt} color="blue.500" boxSize={6} />
                            <Heading size="md">أحدث الطلاب نشاطاً</Heading>
                        </HStack>
                        
                        <Table.Root size="md" variant="line" interactive>
                            <Table.Header>
                                <Table.Row bg="bg.subtle">
                                    <Table.ColumnHeader textAlign="center" p={2}>اسم الطالب</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="center" p={2} hideBelow="md">المحاضرات</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="center" p={2} hideBelow="md">رقم الهاتف</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="center" p={2}>حالة الاكونت</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {students.map((st, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell textAlign="center">
                                            {isMobile ? (
                                                <DialogRoot size="xs">
                                                    <DialogTrigger asChild>
                                                        <HStack justify="center" color="blue.600" cursor="pointer">
                                                            <Text fontWeight="bold" fontSize="sm">{st.name}</Text>
                                                            <Icon as={MdInfoOutline} />
                                                        </HStack>
                                                    </DialogTrigger>
                                                    <DialogContent borderRadius="2xl" dir="rtl" m={isMobile?"50% 5%":"15% auto"} p={3}>
                                                        <DialogHeader><DialogTitle>بيانات الطالب</DialogTitle></DialogHeader>
                                                        <DialogBody pb={6}>
                                                            <VStack align="stretch" gap={2}>
                                                                <Text><b>الاسم:</b> {st.name}</Text>
                                                                <Text><b>الهاتف:</b> {st.phone}</Text>
                                                                <Text><b>الإيميل:</b> {st.email}</Text>
                                                                <Text><b>المحاضرات:</b> {st.lectures}</Text>
                                                            </VStack>
                                                        </DialogBody>
                                                        <DialogCloseTrigger />
                                                    </DialogContent>
                                                </DialogRoot>
                                            ) : (
                                                <Text fontWeight="bold">{st.name}</Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" p={2} hideBelow="md">{st.lectures}</Table.Cell>
                                        <Table.Cell textAlign="center" p={2} hideBelow="md">{st.phone}</Table.Cell>
                                        <Table.Cell textAlign="center" p={2}>
                                            <Badge colorPalette={st.color} variant="subtle" borderRadius="full" px={3}>
                                                {st.status}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>


                    <Box bg="bg.panel" p={{ base: 4, md: 6 }} borderRadius="2xl" border="1px solid" borderColor="border.subtle" shadow="sm">
                        <HStack mb={6} gap={2}>
                            <Icon as={MdAnalytics} color="blue.500" boxSize={6} />
                            <Heading size="md">نسب مشاهدة الدروس</Heading>
                        </HStack>

                        <Box h={{ base: "250px", md: "350px" }} w="100%">
                            {lessons.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 2, left: -50, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chakra-colors-border-subtle)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--chakra-colors-fg-muted)', fontSize: 11 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--chakra-colors-fg-muted)', fontSize: 11 }} />
                                        <RechartsTooltip 
                                            cursor={{ fill: 'rgba(49, 130, 206, 0.1)' }} 
                                            contentStyle={{ 
                                                borderRadius: '12px', 
                                                border: '1px solid var(--chakra-colors-border-subtle)', 
                                                backgroundColor: 'var(--chakra-colors-bg-panel)',
                                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)' 
                                            }} 
                                        />
                                        <Bar dataKey="views" fill="var(--chakra-colors-fg-blue)" radius={[6, 6, 0, 0]} barSize={isMobile ? 20 : 45} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Center h="full">
                                    <Text color="fg.muted">لا توجد بيانات متاحة للعرض</Text>
                                </Center>
                            )}
                        </Box>

                    </Box>

                </VStack>
            </Box>
    </>
    );
}

