

"use client"

import { useState, useEffect } from "react";
import { Table, Badge, Box, Flex, Text, Icon, Spinner, Center, Menu, HStack, VStack} from "@chakra-ui/react";
import { 
    DialogRoot, DialogContent, DialogHeader, DialogBody, DialogTitle, DialogCloseTrigger, DialogTrigger 
} from "@/components/ui/dialog";
import { MdPeople, MdInfoOutline } from "react-icons/md";
import { rtdb } from "@/auth/firebase";
import { ref, get, update } from "firebase/database";
import { useBreakpointValue } from "@chakra-ui/react";

const STATUS_CONFIG = {
    active: { label: "مفعل", color: "blue" },
    inactive: { label: "مغلق", color: "red" }
};

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const usersRef = ref(rtdb, 'users');
                const usersSnapshot = await get(usersRef);
                if (usersSnapshot.exists()) {
                    const studentsData = [];
                    usersSnapshot.forEach((childSnapshot) => {
                        const user = childSnapshot.val();
                        if (user.role === 'student') {
                            studentsData.push({
                                id: childSnapshot.key,
                                name: user.fullName || user.name || "غير معروف",
                                phone: user.phone || "غير متوفر",
                                email: user.email || "غير متوفر",
                                lectures: user.totalLectures || user.lecturesCount || 0,
                                status: user.status || 'active',
                            });
                        }
                    });
                    setStudents(studentsData);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleStatusChange = async (studentId, newStatus) => {
        try {
            const userRef = ref(rtdb, `users/${studentId}`);
            await update(userRef, { status: newStatus });
            setStudents(prev => prev.map(st => 
                st.id === studentId ? { ...st, status: newStatus } : st
            ));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) {
        return (
            <>
                <Center py={20}><Spinner size="xl" color="#00A3E0" /></Center>
            </>
        );
    }

    return (
        <>
            <Box 
                bg="bg.subtle" 
                p={{ base: "4", md: "6" }} 
                borderRadius="2xl" 
                shadow="sm" 
                dir="rtl" 
                mt={10}
                mr={{ base: "auto", md: "auto" }} 
                ml={{ base: "auto", md: "auto" }}
                width={{ base: "90%", md: "calc(80% - 20px)" }}
            >
                <Flex align="center" gap="2" mb="6">
                    <Icon as={MdPeople} fontSize="24px" color="gray.500" />
                    <Text fontWeight="bold" fontSize="lg" color="fg.subtle">الطلاب المسجلين</Text>
                    <Badge colorPalette="gray" variant="subtle" ml={2} p={1}>
                        {students.length} طالب
                    </Badge>
                </Flex>

                {students.length === 0 ? (
                    <Center py={10}><Text color="fg.subtle">لا يوجد طلاب مسجلين</Text></Center>
                ) : (
                    <Table.Root size="md" variant="line" interactive>
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader textAlign="center" p={2}>اسم الطالب</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center"  p={2}hideBelow="md">عدد المحاضرات</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center"  p={2}hideBelow="md">رقم الهاتف</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" p={2} hideBelow="md">الايميل</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" p={2}>حالة الاكونت</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {students.map((st) => {
                                const statusConfig = STATUS_CONFIG[st.status] || STATUS_CONFIG.active;
                                return (
                                    <Table.Row key={st.id} _hover={{ bg: "gray.50" }}>
                                        <Table.Cell textAlign="center" p={4}>
                                            {isMobile ? (
                                                <DialogRoot scrollBehavior="inside" size="xs">
                                                    <DialogTrigger asChild>
                                                        <HStack justify="center" cursor="pointer" color="blue.600" _hover={{ textDecoration: "underline" }}>
                                                            <Text fontWeight="bold">{st.name}</Text>
                                                            <Icon as={MdInfoOutline} boxSize={3} />
                                                        </HStack>
                                                    </DialogTrigger>
                                                    <DialogContent borderRadius="2xl" dir="rtl"  m={isMobile?"50% 5%":"15% auto"} p={3}>
                                                        <DialogHeader>
                                                            <DialogTitle>بيانات الطالب</DialogTitle>
                                                        </DialogHeader>
                                                        <DialogBody pb={6}>
                                                            <VStack align="stretch" gap={4}>
                                                                <HStack p={2} bg="gray.50" borderRadius="lg">
                                                                    <Text fontWeight="bold">الاسم:</Text>
                                                                    <Text>{st.name}</Text>
                                                                </HStack>
                                                                <HStack p={2} bg="gray.50" borderRadius="lg">
                                                                    <Text fontWeight="bold">المحاضرات:</Text>
                                                                    <Badge colorPalette="green">{st.lectures}</Badge>
                                                                </HStack>
                                                                <HStack p={2} bg="gray.50" borderRadius="lg">
                                                                    <Text fontWeight="bold">الهاتف:</Text>
                                                                    <Text dir="ltr">{st.phone}</Text>
                                                                </HStack>
                                                                <VStack align="stretch" p={2} bg="gray.50" borderRadius="lg" gap={1}>
                                                                    <Text fontWeight="bold">الإيميل:</Text>
                                                                    <Text fontSize="sm" color="gray.600">{st.email}</Text>
                                                                </VStack>
                                                            </VStack>
                                                        </DialogBody>
                                                        <DialogCloseTrigger />
                                                    </DialogContent>
                                                </DialogRoot>
                                            ) : (
                                                <Text fontWeight="bold" color="gray.700">
                                                    {st.name}
                                                </Text>
                                            )}
                                        </Table.Cell>

                                        <Table.Cell textAlign="center" hideBelow="md" color="fg.subtle">{st.lectures}</Table.Cell>
                                        <Table.Cell textAlign="center" hideBelow="md" dir="ltr" color="fg.subtle">{st.phone}</Table.Cell>
                                        <Table.Cell textAlign="center" hideBelow="md" color="fg.subtle" fontSize="sm">{st.email}</Table.Cell>

                                        <Table.Cell textAlign="center">
                                            <Menu.Root>
                                                <Menu.Trigger asChild>
                                                    <Badge 
                                                        colorPalette={statusConfig.color} 
                                                        variant="subtle" 
                                                        px="4" py="1" 
                                                        borderRadius="full"
                                                        cursor="pointer"
                                                    >
                                                        {statusConfig.label}
                                                    </Badge>
                                                </Menu.Trigger>
                                                    <Menu.Positioner>
                                                        <Menu.Content>
                                                            <Menu.Item value="active" onClick={() => handleStatusChange(st.id, 'active')} color="blue.600">مفعل</Menu.Item>
                                                            <Menu.Item value="inactive" onClick={() => handleStatusChange(st.id, 'inactive')} color="red.600">مغلق</Menu.Item>
                                                        </Menu.Content>
                                                    </Menu.Positioner>
                                            </Menu.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table.Root>
                )}
            </Box>
        </>
    );
}
