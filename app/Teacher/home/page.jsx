
"use client"
import Navbar from "@/components/ui/Navbar";
import { MdVideoLibrary, MdPeopleAlt, MdAnalytics, MdInfoOutline } from "react-icons/md";
import { 
    Box, Text, Heading, Icon, HStack, VStack, Card, Avatar, Table, Badge, SimpleGrid 
} from "@chakra-ui/react";
import { 
    DialogRoot, DialogContent, DialogHeader, DialogBody, DialogTitle, DialogCloseTrigger, DialogTrigger 
} from "@/components/ui/dialog";
import { 
    Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip 
} from "recharts";
import { useBreakpointValue } from "@chakra-ui/react";

export default function MainDashboard() {
    const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png";
    const isMobile = useBreakpointValue({ base: true, md: false });

    const students = [
        { name: "سالم علي", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "انتظار", color: "orange" },
        { name: "ليلي خالد", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "انتظار", color: "orange" },
        { name: "عمر حسين", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "انتظار", color: "orange" },
        { name: "فاطمة محمود", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "انتظار", color: "orange" },
        { name: "يوسف احمد", lectures: 24, phone: "01012345678", email: "blabla@gmail.com", status: "انتظار", color: "orange" },
    ];

    const chartData = [
        { name: "درس 1", views: 400 },
        { name: "درس 2", views: 700 },
        { name: "درس 3", views: 200 },
        { name: "درس 4", views: 900 },
        { name: "درس 5", views: 500 },
    ];

    return (
        <>
            <Navbar />
            <Box 
                p={{ base: 4, md: 8 }} 
                bg="#f8fafc" 
                minH="100vh" 
                dir="rtl" 
                mt={4}
                mr={{ base: "10px", md: "10px" }}
                transition="margin 0.3s"
            >
                <VStack align="stretch" gap={10}>
                    
                    <Box>
                        <HStack mb={4} gap={2}>
                            <Icon as={MdVideoLibrary} color="blue.500" boxSize={6} />
                            <Heading size="md">آخر الفيديوهات مشاهدة</Heading>
                        </HStack>

                        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
                            {[1, 2, 3].map((item) => (
                                <Card.Root key={item} overflow="hidden" shadow="sm" _hover={{ shadow: "md" }} transition="all 0.2s">
                                    <Card.Body p={4}>
                                        <VStack gap={3}>
                                            <Avatar.Root shape="rounded" size="2xl" w="full" h="140px">
                                                <Avatar.Image src={lessonImage} style={{ objectFit: 'cover' }} />
                                            </Avatar.Root>
                                            <Box textAlign="center">
                                                <Card.Title>درس العلوم المتكاملة #{item}</Card.Title>
                                                <Card.Description>تمت المشاهدة بواسطة 150 طالب</Card.Description>
                                            </Box>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </SimpleGrid>
                    </Box>

                    <Box bg="#fff" p={{ base: 4, md: 6 }} borderRadius="2xl" shadow="sm" overflow="hidden">
                        <HStack mb={6} gap={2}>
                            <Icon as={MdPeopleAlt} color="blue.500" boxSize={6} />
                            <Heading size="md">أحدث الطلاب نشاطاً</Heading>
                        </HStack>
                        
                        <Table.Root size="md" variant="line" interactive>
                            <Table.Header>
                                <Table.Row bg="gray.50">
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


                    <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="2xl" border="1px solid #E2E8F0" shadow="sm">
                        <HStack mb={6} gap={2}>
                            <Icon as={MdAnalytics} color="blue.500" boxSize={6} />
                            <Heading size="md">نسب مشاهدة الدروس</Heading>
                        </HStack>

                        <Box h={{ base: "250px", md: "350px" }} w="100%">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 2, left: -50, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12}} />
                                    <RechartsTooltip cursor={{ fill: '#f7fafc' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="views" fill="#3182ce" radius={[6, 6, 0, 0]} barSize={isMobile ? 15 : 45} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>

                    </Box>

                </VStack>
            </Box>
    </>
    );
}

