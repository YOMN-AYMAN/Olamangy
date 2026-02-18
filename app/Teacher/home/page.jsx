
"use client"
import Navbar from "@/components/ui/Navbar";
import { MdVideoLibrary, MdPeopleAlt, MdAnalytics } from "react-icons/md";

import { Box, Flex, Heading, Icon, HStack , VStack , Card , Avatar , Table , Badge } from "@chakra-ui/react";

import { Bar, BarChart, XAxis, YAxis , CartesianGrid , ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

export default function MainDashboard() {
    const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png"

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
    <Navbar/>
    <Box p={6} bg="#f8fafc" minH="100vh" dir="rtl" mt={4}>
      <VStack align="stretch" gap={8}>
        
        <Box width="100%">
          <HStack mb={4} gap={2}>
            <Icon as={MdVideoLibrary} color="blue.500" />
            <Heading size="md">آخر الفيديوهات مشاهدة</Heading>
          </HStack>

          <Flex justify="space-between" width="95%" m="auto" >

            <Card.Root width="30%" p={1} textAlign="center">
              <Card.Body>
                <Avatar.Root shape="rounded" size="2x1" >
                  <Avatar.Image src={lessonImage}/>
                </Avatar.Root>
                <Card.Title mt="2">Nue Camp</Card.Title>
                <Card.Description>
                  This is the card body
                </Card.Description>
              </Card.Body>
            </Card.Root>

            <Card.Root width="30%"  p={1} textAlign="center">
              <Card.Body>
                <Avatar.Root shape="rounded" size="2x1" >
                  <Avatar.Image src={lessonImage}/>
                </Avatar.Root>
                <Card.Title mt="2">Nue Camp</Card.Title>
                <Card.Description>
                  This is the card body
                </Card.Description>
              </Card.Body>
            </Card.Root>

            <Card.Root width="30%"  p={1} textAlign="center">
              <Card.Body>
                <Avatar.Root shape="rounded" size="2x1" >
                  <Avatar.Image src={lessonImage}/>
                </Avatar.Root>
                <Card.Title mt="2">Nue Camp</Card.Title>
                <Card.Description>
                  This is the card body
                </Card.Description>
              </Card.Body>
            </Card.Root>

          </Flex>
        </Box>

        <Box bg="#fff" p="6" borderRadius="2xl" shadow="sm" dir="rtl" w="full" >
            <HStack mb={4} gap={2}>
              <Icon as={MdPeopleAlt} color="blue.500" />
              <Heading size="md">أحدث الطلاب نشاطاً</Heading>
            </HStack>
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

          

          <Box bg="white" p={6} borderRadius="2xl" border="1px solid #E2E8F0" shadow="sm">
            <HStack mb={6} gap={2}>
                <Icon as={MdAnalytics} color="blue.500" />
                <Heading size="md">نسب مشاهدة الدروس</Heading>
            </HStack>

            <Box h="300px" w="100%">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#718096', fontSize: 12 }} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#718096', fontSize: 12 }} 
                        />
                        <RechartsTooltip 
                            cursor={{ fill: '#f7fafc' }}
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        />
                        <Bar 
                            dataKey="views" 
                            fill="#3182ce" 
                            radius={[6, 6, 0, 0]} 
                            barSize={40} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>

      </VStack>
    </Box>
    </>
  );
}
