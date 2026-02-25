
"use client"
import {Table, Badge, Box, Flex, Text, Icon, HStack, VStack} from "@chakra-ui/react";
import {
  DialogRoot, DialogContent, DialogHeader, DialogBody, DialogTitle, DialogCloseTrigger, DialogTrigger
} from "@/components/ui/dialog";
import {MdPeople, MdInfoOutline} from "react-icons/md";
import {useBreakpointValue} from "@chakra-ui/react";

export default function Students() {
  const isMobile = useBreakpointValue({base: true, md: false});

  const students = [
    {id: 1, name: "سالم علي", lectures: 24, phone: "01012345678", email: "salim@gmail.com", status: "مفعل", color: "blue"},
    {id: 2, name: "ليلي خالد", lectures: 18, phone: "01122334455", email: "laila@gmail.com", status: "مغلق", color: "red"},
    {id: 3, name: "عمر حسين", lectures: 12, phone: "01233445566", email: "omar@gmail.com", status: "انتظار", color: "orange"},
    {id: 4, name: "فاطمة محمود", lectures: 30, phone: "01566778899", email: "fatma@gmail.com", status: "انتظار", color: "orange"},
  ];

  return (
    <>


      <Box
        bg="bg.panel"
        p={{base: "4", md: "6"}}
        borderRadius="2xl"
        shadow="sm"
        dir="rtl"
        mt={10}
        mr={{base: "20px", md: "20px"}}
        ml={{base: "10px", md: "20px"}}
        transition="all 0.3s"
      >
        <Flex align="center" gap="2" mb="6">
          <Icon as={MdPeople} fontSize="24px" color="gray.500" />
          <Text fontWeight="bold" fontSize="lg">الطلاب المسجلين</Text>
          <Badge colorPalette="gray" variant="subtle" ml={2} p={1}>{students.length}</Badge>
        </Flex>

        <Table.Root size="md" variant="line" interactive>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader textAlign="center" p={2}>اسم الطالب</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" p={2} hideBelow="md">عدد المحاضرات</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" p={2} hideBelow="md">رقم الهاتف</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" p={2} hideBelow="lg">الايميل</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" p={2}>الحالة</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {students.map((st) => (
              <Table.Row key={st.id} _hover={{bg: "bg.subtle"}}>
                <Table.Cell textAlign="center" p={2}>
                  {isMobile ? (
                    <DialogRoot scrollBehavior="inside" size="xs">
                      <DialogTrigger asChild>
                        <HStack justify="center" cursor="pointer" color="blue.600">
                          <Text fontWeight="bold" fontSize="sm">{st.name}</Text>
                          <Icon as={MdInfoOutline} boxSize={3} />
                        </HStack>
                      </DialogTrigger>
                      <DialogContent borderRadius="2xl" dir="rtl" p={3} m={isMobile ? "50% 5%" : "15% auto"}>
                        <DialogHeader>
                          <DialogTitle>تفاصيل الطالب</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                          <VStack align="stretch" gap={3}>
                            <HStack p={2} bg="bg.subtle" borderRadius="lg">
                              <Text fontWeight="bold">الاسم:</Text>
                              <Text>{st.name}</Text>
                            </HStack>
                            <HStack p={2} bg="bg.subtle" borderRadius="md">
                              <Text fontWeight="bold">المحاضرات:</Text>
                              <Text>{st.lectures}</Text>
                            </HStack>
                            <HStack p={2} bg="bg.subtle" borderRadius="md">
                              <Text fontWeight="bold">الهاتف:</Text>
                              <Text dir="ltr">{st.phone}</Text>
                            </HStack>
                            <VStack align="flex-start" p={2} bg="bg.subtle" borderRadius="md">
                              <Text fontWeight="bold">الإيميل:</Text>
                              <Text fontSize="xs">{st.email}</Text>
                            </VStack>
                          </VStack>
                        </DialogBody>
                        <DialogCloseTrigger />
                      </DialogContent>
                    </DialogRoot>
                  ) : (
                    <Text fontWeight="bold" color="fg">{st.name}</Text>
                  )}
                </Table.Cell>

                <Table.Cell textAlign="center" p={2} hideBelow="md">{st.lectures}</Table.Cell>
                <Table.Cell textAlign="center" p={2} hideBelow="md">{st.phone}</Table.Cell>
                <Table.Cell textAlign="center" p={2} hideBelow="lg" color="gray.500" fontSize="sm">{st.email}</Table.Cell>

                <Table.Cell textAlign="center" p={2}>
                  <Badge
                    colorPalette={st.color}
                    variant="subtle"
                    px={{base: 2, md: 4}}
                    py="1"
                    borderRadius="full"
                    fontSize={{base: "xs", md: "sm"}}
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
}
