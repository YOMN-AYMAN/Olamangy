"use client"
import {
  Box, Input, VStack, SimpleGrid, Text, Button,
  Avatar, Flex, Icon, HStack, Textarea
} from "@chakra-ui/react";
import {useState} from "react";
import {MdEdit, MdCheckCircle} from "react-icons/md";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "محمود علي فؤاد أحمد",
    phone: "01023456789",
    email: "teacher.mahmuod@gmail.com",
    governorate: "القاهرة",
    city: "مدينة نصر",
    specialization: "اللغة العربية",
    levels: "الثانوية العامة",
    grades: "الصف الأول والثاني والثالث",
    jobTitle: "خبير اللغة العربية",
    bio: "خبير في تدريس اللغة العربية بخبرة تزيد عن 10 سنوات في تبسيط النحو والبلاغة."
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData(prev => ({...prev, [name]: value}));
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
    borderColor: isEditing ? "blue.400" : "border.subtle",
    bg: isEditing ? "bg.panel" : "bg.subtle",
    _focus: {
      borderColor: "blue.500",
      boxShadow: "0 0 0 1px #3182ce"
    }
  };

  return (
    <>

      <Box p={{base: 4, md: 8}} dir="rtl" maxW="1100px" mx="auto">
        <Box bg="bg.panel" p={{base: 6, md: 10}} borderRadius="3xl" border="1px solid" borderColor="border.subtle" shadow="sm">

          {/* Header */}
          <Flex direction={{base: "column", md: "row"}} justify="space-between" align={{base: "start", md: "center"}} mb={10} gap={6}>
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

          <SimpleGrid columns={{base: 1, md: 2}} gapX={10} gapY={6}>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>الاسم الرباعي</Text>
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
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>رقم الهاتف</Text>
              <Input
                {...inputStyle}
                name="phone"
                value={userData.phone}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5} gridColumn={{base: "auto", md: "span 2"}}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>البريد الإلكتروني (أساسي)</Text>
              <Input
                value={userData.email}
                readOnly
                borderRadius="xl" border="1px solid" borderColor="red.400" bg="bg.muted" h="55px" p={4} opacity={0.8}
                cursor="not-allowed"
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المحافظة</Text>
              <Input
                {...inputStyle}
                name="governorate"
                value={userData.governorate}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المدينة</Text>
              <Input
                {...inputStyle}
                name="city"
                value={userData.city}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <Text
              gridColumn={{base: "auto", md: "span 2"}}
              fontWeight="bold" color="blue.500" fontSize="md"
              borderBottom="1px dashed" borderColor="border.subtle" mt={6} pb={2}
            >
              البيانات المهنية
            </Text>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المادة الدراسية</Text>
              <Input
                {...inputStyle}
                name="specialization"
                value={userData.specialization}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>اللقب المهني</Text>
              <Input
                {...inputStyle}
                name="jobTitle"
                value={userData.jobTitle}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المرحلة</Text>
              <Input
                {...inputStyle}
                name="city"
                value={userData.levels}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>المستويات</Text>
              <Input
                {...inputStyle}
                name="city"
                value={userData.grades}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </VStack>

            <VStack align="flex-start" gap={1.5} gridColumn={{base: "auto", md: "span 2"}}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted" pr={2}>النبذة التعريفية</Text>
              <Textarea
                {...inputStyle}
                h="auto"
                name="bio"
                value={userData.bio}
                readOnly={!isEditing}
                onChange={handleChange}
                rows={4}
              />
            </VStack>

          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}