"use client"

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import { Table, Badge, Box, Flex, Text, Icon, Spinner, Center, Menu, Portal } from "@chakra-ui/react";
import { MdPeople } from "react-icons/md";
import { rtdb } from "@/auth/firebase";
import { ref, get, update } from "firebase/database";


const STATUS_CONFIG = {
    active: { 
        label: "مفعل", 
        color: "blue"
    },
    inactive: { 
        label: "مغلق", 
        color: "red"
    }
};

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all users with role "student" from database
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const usersRef = ref(rtdb, 'users');
                const usersSnapshot = await get(usersRef);
                
                if (usersSnapshot.exists()) {
                    const studentsData = [];
                    
                    usersSnapshot.forEach((childSnapshot) => {
                        const user = childSnapshot.val();
                        
                        // Only include users with role "student"
                        if (user.role === 'student') {
                            studentsData.push({
                                id: childSnapshot.key,
                                name: user.fullName || user.name || "غير معروف",
                                phone: user.phone || "غير متوفر",
                                email: user.email || "غير متوفر",
                                lectures: user.totalLectures || user.lecturesCount || 0,
                                status: user.status || 'active', // Default to active if no status
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

    // Handle status change
    const handleStatusChange = async (studentId, newStatus) => {
        try {
            const userRef = ref(rtdb, `users/${studentId}`);
            await update(userRef, { status: newStatus });
            
            // Update local state
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
                <Navbar />
                <Center py={20}>
                    <Spinner size="xl" color="#00A3E0" />
                </Center>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <Box bg="#fff" p="6" borderRadius="2xl" shadow="sm" dir="rtl" w="full" mt={10}>
                <Flex align="center" gap="2" mb="6">
                    <Icon as={MdPeople} fontSize="24px" color="gray.500" />
                    <Text fontWeight="bold" fontSize="lg" color="black">الطلاب المسجلين</Text>
                    <Badge colorPalette="gray" variant="subtle" ml={2}>
                        {students.length} طالب
                    </Badge>
                </Flex>

                {students.length === 0 ? (
                    <Center py={10}>
                        <Text color="gray.500">لا يوجد طلاب مسجلين</Text>
                    </Center>
                ) : (
                    <Table.Root size="md" variant="line" interactive>
                        <Table.Header>
                            <Table.Row bg="gray.50">
                                <Table.ColumnHeader textAlign="center" p={2}>اسم الطالب</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" p={2}>عدد المحاضرات</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" p={2}>رقم الهاتف</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" p={2}>الايميل</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" p={2}>حالة الاكونت</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {students.map((st) => {
                                const statusConfig = STATUS_CONFIG[st.status] || STATUS_CONFIG.active;
                                
                                return (
                                    <Table.Row key={st.id} _hover={{ bg: "gray.50" }}>
                                        <Table.Cell textAlign="center" p={2} fontWeight="bold" color="gray.700">
                                            {st.name}
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" p={2} color="black">{st.lectures} </Table.Cell>
                                        <Table.Cell textAlign="center" p={2} dir="ltr" color="black">{st.phone}</Table.Cell>
                                        <Table.Cell textAlign="center" p={2} color="gray.500" fontSize="sm">
                                            {st.email}
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" p={2}>
                                            <Menu.Root>
                                                <Menu.Trigger asChild>
                                                    <Badge 
                                                        colorPalette={statusConfig.color} 
                                                        variant="subtle" 
                                                        px="4" 
                                                        py="1" 
                                                        borderRadius="full"
                                                        cursor="pointer"
                                                        _hover={{ opacity: 0.8 }}
                                                    >
                                                        {statusConfig.label}
                                                    </Badge>
                                                </Menu.Trigger>
                                                <Portal>
                                                    <Menu.Positioner>
                                                        <Menu.Content>
                                                            <Menu.Item 
                                                                value="active"
                                                                onClick={() => handleStatusChange(st.id, 'active')}
                                                                color="blue.600"
                                                            >
                                                                مفعل
                                                            </Menu.Item>
                                                            <Menu.Item 
                                                                value="inactive"
                                                                onClick={() => handleStatusChange(st.id, 'inactive')}
                                                                color="red.600"
                                                            >
                                                                مغلق
                                                            </Menu.Item>
                                                        </Menu.Content>
                                                    </Menu.Positioner>
                                                </Portal>
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
