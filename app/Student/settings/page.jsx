// "use client"
// import { Box, Input, VStack, SimpleGrid, Text, Button, Avatar, Flex, Icon, HStack, NativeSelect } from "@chakra-ui/react";
// import { useState } from "react";
// import { MdEdit, MdSave } from "react-icons/md";

// export default function StudentSettings() {
//     const [isEditing, setIsEditing] = useState(false);
//     const [studentData, setStudentData] = useState({
//         name: "عبد الرحمن محمد",
//         phone: "101010101",
//         email: "hirata@gmail.com",
//         level: "الثانوي",
//         stage: "الصف الثانى"
//     });

//     const inputStyle = {
//         borderRadius: "xl",
//         h: "50px",
//         bg: "white",
//         border: "1px solid #E2E8F0",
//         textAlign: "right",
//         _focus: { borderColor: "#009EDB" }
//     };

//     return (
//         <Box dir="rtl" p={{ base: 4, md: 8 }} maxW="900px" mx="auto">
//         <Box bg="white" p={{ base: 6, md: 10 }} borderRadius="3xl" shadow="sm" border="1px solid #F0F0F0">
            
//             {/* Header */}
//             <Flex justify="space-between" align="flex-start" mb={8}>
//             <HStack color="gray.600">
//                 <Icon as={MdEdit} />
//                 <Text fontWeight="bold">عدل بياناتك</Text>
//             </HStack>
//             <VStack align="flex-end">
//                 <Avatar.Root size="2xl" shape="rounded">
//                 <Avatar.Image src="https://i.pravatar.cc/300?u=student" />
//                 </Avatar.Root>
//                 <Button size="sm" bg="black" color="white" borderRadius="lg" mt={2}>تغير الصوره</Button>
//             </VStack>
//             </Flex>

//             {/* Form Fields */}
//             <SimpleGrid columns={{ base: 1, md: 2 }} gapX={6} gapY={6}>
//             <VStack align="flex-start" gap={1}>
//                 <Text fontSize="sm" color="gray.400">الاسم</Text>
//                 <Input {...inputStyle} readOnly={!isEditing} defaultValue={studentData.name} />
//             </VStack>

//             <VStack align="flex-start" gap={1}>
//                 <Text fontSize="sm" color="gray.400">رقم الهاتف</Text>
//                 <Input {...inputStyle} border="1px solid #FFBDD2" readOnly={!isEditing} defaultValue={studentData.phone} />
//             </VStack>

//             <VStack align="flex-start" gap={1} gridColumn={{ md: "span 2" }}>
//                 <Text fontSize="sm" color="gray.400">الايميل</Text>
//                 <Input {...inputStyle} border="1px solid #FFBDD2" value={studentData.email} readOnly color="gray.500" />
//             </VStack>

//             <VStack align="flex-start" gap={1}>
//                 <Text fontSize="sm" color="gray.400">المراحلة= الدراسية</Text>
//                 <Input {...inputStyle} readOnly={!isEditing} defaultValue={studentData.level} />
//             </VStack>


//             <VStack align="flex-start" gap={1} gridColumn={{ md: "span 2" }}>
//                 <Text fontSize="sm" color="gray.400">المستوى</Text>
//                 <Input {...inputStyle} readOnly={!isEditing} defaultValue={studentData.stage} />
//             </VStack>
//             </SimpleGrid>

//             <Button 
//             w="100%" mt={10} h="55px" borderRadius="xl"
//             bg={isEditing ? "#28a745" : "#009EDB"} color="white"
//             onClick={() => setIsEditing(!isEditing)}
//             _hover={{ opacity: 0.9 }}
//             >
//             {isEditing ? "حفظ التغييرات" : "تعديل البيانات"}
//             </Button>

//         </Box>
//         </Box>
//     );
// }



"use client"
import { 
  Box, Input, VStack, SimpleGrid, Text, Button, 
  Avatar, Flex, Icon, HStack, Textarea 
} from "@chakra-ui/react";
import { useState } from "react";
import { MdEdit, MdCheckCircle } from "react-icons/md";

export default function SettingsPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        fullName: "احمد بدر على السيد",
        phone: "01023456789",
        email: "ahmedbadr@gmail.com",
        governorate: "الدقهليه",
        city: "ميت غمر",
        levels: "ثانوى",
        grades: "الصف الأول",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const inputStyle = {
        borderRadius: "xl",
        h: "55px",
        p: 4,
        transition: "all 0.3s ease",
        border: "1px solid",
        borderColor: isEditing ? "blue.400" : "#E2E8F0", 
        bg: isEditing ? "white" : "gray.50", 
        _focus: {
        borderColor: "blue.500",
        boxShadow: "0 0 0 1px #3182ce"
        }
    };

    return (
        <>
        <Box p={{ base: 4, md: 8 }} dir="rtl" maxW="1100px" mx="auto">
            <Box bg="white" p={{ base: 6, md: 10 }} borderRadius="3xl" border="1px solid #E2E8F0" shadow="sm">
            
            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }} mb={10} gap={6}>
                <HStack gap={6}>
                <Avatar.Root size="2xl" shape="rounded">
                    <Avatar.Image src="https://i.pravatar.cc/300?u=teacher" />
                </Avatar.Root>
                <VStack align="flex-start" gap={1}>
                    <Button size="xs" variant="surface" colorPalette="gray" borderRadius="lg" p={1}>
                    تغيير الصورة
                    </Button>
                </VStack>
                </HStack>

                <Button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                variant="outline"
                size="sm"
                colorPalette={isEditing ? "green" : "blue"}
                borderRadius="full"
                px={6}
                borderWidth="2px"
                >
                <HStack gap={2}>
                    <Text fontWeight="bold">{isEditing ? "حفظ البيانات" : "تعديل الحساب"}</Text>
                    <Icon fontSize="lg">
                        {isEditing ? <MdCheckCircle /> : <MdEdit />}
                    </Icon>
                </HStack>
                </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} gapX={10} gapY={6}>
                
                <VStack align="flex-start" gap={1.5}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" pr={2}>الاسم الرباعي</Text>
                <Input 
                    {...inputStyle}
                    name="fullName" 
                    value={userData.fullName} 
                    readOnly={!isEditing}
                    onChange={handleChange}
                    placeholder="أدخل اسمك الرباعي"
                />
                </VStack>

                <VStack align="flex-start" gap={1.5}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" pr={2}>رقم الهاتف</Text>
                <Input 
                    {...inputStyle}
                    name="phone"
                    value={userData.phone}
                    readOnly={!isEditing}
                    onChange={handleChange}
                />
                </VStack>

                <VStack align="flex-start" gap={1.5} gridColumn={{ base: "auto", md: "span 2" }}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" pr={2}>البريد الإلكتروني (أساسي)</Text>
                <Input 
                    value={userData.email} 
                    readOnly 
                    borderRadius="xl" border="1px solid #FFBDD2" bg="red.50" h="55px" p={4} opacity={0.8}
                    cursor="not-allowed"
                />
                </VStack>

                <VStack align="flex-start" gap={1.5}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" pr={2}>المحافظة</Text>
                <Input 
                    {...inputStyle}
                    name="governorate"
                    value={userData.governorate}
                    readOnly={!isEditing}
                    onChange={handleChange}
                />
                </VStack>

                <VStack align="flex-start" gap={1.5}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" pr={2}>المدينة</Text>
                <Input 
                    {...inputStyle}
                    name="city"
                    value={userData.city}
                    readOnly={!isEditing}
                    onChange={handleChange}
                />
                </VStack>


                <VStack align="flex-start" gap={1.5}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" pr={2}>المرحلة</Text>
                <Input 
                    {...inputStyle}
                    name="city"
                    value={userData.levels}
                    readOnly={!isEditing}
                    onChange={handleChange}
                />
                </VStack>

                <VStack align="flex-start" gap={1.5}>
                <Text fontSize="xs" fontWeight="bold" color="gray.500" pr={2}>المستوى</Text>
                <Input 
                    {...inputStyle}
                    name="city"
                    value={userData.grades}
                    readOnly={!isEditing}
                    onChange={handleChange}
                />
                </VStack>

            </SimpleGrid>
            </Box>
        </Box>
        </>
    );
}