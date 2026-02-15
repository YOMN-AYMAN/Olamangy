
"use client"
import Navbar from "@/components/ui/Navbar";
import { Table, Badge, Box, Flex, Text, Icon } from "@chakra-ui/react";
import { MdPeople } from "react-icons/md";

export default function Students () {
    const students = [
        { name: "سالم علي", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "مفعل", color: "blue" },
        { name: "ليلي خالد", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "مغلق", color: "red" },
        { name: "عمر حسين", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "انتظار", color: "orange" },
        { name: "فاطمة محمود", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "انتظار", color: "orange" },
        { name: "يوسف احمد", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "مفعل", color: "blue" },
    ];

    return (
        <>
            <Navbar />

            <Box bg="#fff" p="6" borderRadius="2xl" shadow="sm" dir="rtl" w="full" mt={10}>
            <Flex align="center" gap="2" mb="6">
                <Icon as={MdPeople} fontSize="24px" color="gray.500" />
                <Text fontWeight="bold" fontSize="lg">الطلاب المسجلين</Text>
            </Flex>

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
                {students.map((st, index) => (
                    <Table.Row key={index} _hover={{ bg: "gray.50" }}>
                    <Table.Cell textAlign="center" p={2} fontWeight="bold" color="gray.700">{st.name}</Table.Cell>
                    <Table.Cell textAlign="center" p={2}>{st.lectures}</Table.Cell>
                    <Table.Cell textAlign="center" p={2}>{st.phone}</Table.Cell>
                    <Table.Cell textAlign="center" p={2} color="gray.500" fontSize="sm">{st.email}</Table.Cell>
                    <Table.Cell textAlign="center" p={2}>
                        <Badge 
                        colorPalette={st.color} 
                        variant="subtle" 
                        px="4" 
                        py="1" 
                        borderRadius="full"
                        >
                        {st.status}
                        </Badge>
                    </Table.Cell>
                    </Table.Row>
                ))}
                </Table.Body>
            </Table.Root>
            </Box>
        </>
    );
};