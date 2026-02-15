"use client"
import { use } from "react"; 
import { Box, Flex, Text, VStack, Icon, Image, Badge, Collapsible } from "@chakra-ui/react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import Navbar from "@/components/ui/Navbar";

const ActivityItem = ({ title, time, isPayment }) => (
    <Flex justify="space-between" align="center" p={4} borderBottom="1px solid #EDF2F7" >
        <Text color={isPayment ? "blue.500" : "blue.400"} fontWeight="medium">{title}</Text>
        <Text color="blue.300" fontSize="sm">{time}</Text>
    </Flex>
);

export default function TeacherDetailsPage({ params }) {
    const { id } = use(params); 

    return (
        <>
            <Navbar />
            <Box dir="rtl" p={6}>
                <Text mb={4} color="gray.400">كود المدرس: {id}</Text>

                <Box bg="white" p={4} borderRadius="2xl" mb={6} shadow="sm" border="1px solid #E2E8F0">
                    <Flex align="center" justify="space-between" direction={{ base: "column", md: "row" }} gap={4}>
                        <Flex align="end" gap={4}>
                            <Image src="https://i.pravatar.cc/300?u=iu" borderRadius="full" boxSize="60px" />
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" color="blue.600">م/ محمود على</Text>
                                <Badge colorPalette="blue" variant="surface" p={1}>مدرس اللغة العربية</Badge>
                            </Box>
                            <Text fontSize="sm" color="blue.600">01023456789</Text>
                        </Flex>
                        <VStack align="flex-start" gap={0} fontSize="sm">
                            <Text color="gray">المراحل: <Text as="span" color="black">الثانوي، الإعدادي</Text></Text>
                            <Text color="gray">الايميل: <Text as="span" color="black">mahmoudali@gmail.com</Text></Text>
                        </VStack>
                    </Flex>
                </Box>

                <Collapsible.Root defaultOpen>
                    <Box borderRadius="xl" overflow="hidden" border="1px solid #E2E8F0" bg="white" shadow="sm">
                        
                        <Collapsible.Trigger asChild  dir="rtl">
                            <Flex 
                                bg="blue.500" 
                                p={4} 
                                color="white" 
                                justify="space-between" 
                                align="center" 
                                cursor="pointer"
                            >
                                <Text fontWeight="bold">سجل النشاطات - 10 / 2 / 2026</Text>
                                <Collapsible.Context>
                                    {(context) => (
                                        <Icon as={context.open ? MdKeyboardArrowUp : MdKeyboardArrowDown} fontSize="24px" />
                                    )}
                                </Collapsible.Context>
                            </Flex>
                        </Collapsible.Trigger>
                        
                        <Collapsible.Content>
                            <VStack align="stretch" gap={0} dir="rtl" > 
                                <ActivityItem fontWeight="bold" title="اشترك الطالب (أحمد محمد عبد الحميد)" time="20:25" />
                                <ActivityItem title="تم دفع 1500 جنيه" time="11:15" isPayment />
                            </VStack>
                        </Collapsible.Content>
                    </Box>
                </Collapsible.Root>
            </Box>
        </>
    );
}