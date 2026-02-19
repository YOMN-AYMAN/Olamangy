

"use client"
import { useState } from "react"
import { 
  Box, Flex, Text, VStack, HStack, Icon, 
  Input, Button, Grid, GridItem, SimpleGrid
} from "@chakra-ui/react"
import { 
  MdClass, MdLayers, MdSchool, 
  MdQrCodeScanner, MdHighlightOff, MdDeleteOutline,
  MdNotificationsNone, MdSearch, MdPeopleAlt
} from "react-icons/md"
import Navbar from "@/components/ui/Navbar"

export default function LessonManager() {
  const [view, setView] = useState("form") 
  const [type, setType] = useState("حصة")
  const [stage, setStage] = useState("الابتدائية")
  const [grade, setGrade] = useState("الأول")
  const [title, setTitle] = useState("") 
  const [studentCount, setStudentCount] = useState(20)

  const SelectionButton = ({ label, currentValue, setter }) => (
    <Button
      variant={currentValue === label ? "solid" : "outline"}
      colorPalette="blue"
      onClick={() => setter(label)}
      borderRadius="xl"
      px={{ base: 4, md: 6 }}
      size="sm"
      flex={{ base: "1", md: "initial" }}
    >
      {label}
    </Button>
  )

  return (
    <>
    <Navbar/>
    <Box 
      p={{ base: 4, md: 6 }} 
      bg="#f8fafc" 
      minH="100vh" 
      dir="rtl"
      mr={{ base: "10px", md: "10حء" }}
      transition="margin 0.3s"
    >
      <Flex mb={6} gap={4} align="center">
        <Box flex="1" position="relative">
          <Input placeholder="البحث عن" bg="white" borderRadius="xl" border="none" shadow="sm" pr="40px" />
          <Icon as={MdSearch} position="absolute" right="3" top="50%" transform="translateY(-50%)" color="gray.400" />
        </Box>
        <Button bg="white" p={2} borderRadius="xl" shadow="sm">
          <Icon as={MdNotificationsNone} fontSize="xl" color="black" />
        </Button>
      </Flex>

      <Box bg="white" p={{ base: 4, md: 8 }} borderRadius="2xl" shadow="sm" border="1px solid #E2E8F0">
        
        {view === "form" ? (
          <VStack align="stretch" gap={8}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 8, md: 10 }}>
              <GridItem>
                <HStack mb={4} gap={2}>
                  <Icon as={MdClass} color="gray.500" />
                  <Text fontWeight="bold" color="gray.600">النوع</Text>
                </HStack>
                <HStack gap={3}>
                  <SelectionButton label="حصة" currentValue={type} setter={setType} />
                  <SelectionButton label="امتحان" currentValue={type} setter={setType} />
                </HStack>
              </GridItem>

              <GridItem 
                borderRight={{ base: "none", md: "1px solid #E2E8F0" }} 
                pr={{ base: 0, md: 10 }}
                borderTop={{ base: "1px solid #E2E8F0", md: "none" }}
                pt={{ base: 8, md: 0 }}
              >
                <HStack mb={4} gap={2}>
                  <Icon as={MdLayers} color="gray.500" />
                  <Text fontWeight="bold" color="gray.600">المرحلة التعليمية</Text>
                </HStack>
                <Flex gap={3} wrap="wrap">
                  <SelectionButton label="الابتدائية" currentValue={stage} setter={setStage} />
                  <SelectionButton label="الاعدادية" currentValue={stage} setter={setStage} />
                  <SelectionButton label="الثانوية" currentValue={stage} setter={setStage} />
                </Flex>
              </GridItem>
            </Grid>

            <Box>
              <HStack mb={4} gap={2}>
                <Icon as={MdSchool} color="gray.500" />
                <Text fontWeight="bold" color="gray.600">الصف الدراسي</Text>
              </HStack>
              <Flex wrap="wrap" gap={3}>
                {["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"].map((item) => (
                  <SelectionButton key={item} label={item} currentValue={grade} setter={setGrade} />
                ))}
              </Flex>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.400" mb={2}>عنوان الموضوع</Text>
              <Input 
                placeholder="اكتب عنوان الدرس هنا..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                p={6} 
                borderRadius="xl" 
                border="1px solid #E2E8F0" 
              />
            </Box>

            <Button 
              alignSelf={{ base: "stretch", md: "flex-end" }} 
              bg="blue.500" 
              color="white" 
              px={12} 
              py={6} 
              borderRadius="xl" 
              onClick={() => setView("details")}
            >
              تم
            </Button>
          </VStack>

        ) : (
          <VStack align="stretch" gap={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <HStack gap={4}>
                <Text fontWeight="bold" color="gray.600">النوع :</Text>
                <Text fontWeight="bold">{type}</Text> 
              </HStack>
              <HStack gap={4}>
                <Text fontWeight="bold" color="gray.600">العنوان :</Text>
                <Text fontWeight="bold">{title || "لم يتم تحديد عنوان"}</Text> 
              </HStack>
              <HStack gap={4}>
                <Icon as={MdLayers} />
                <Text fontWeight="bold" color="gray.600">المرحلة :</Text>
                <Text fontWeight="bold">{stage}</Text>
              </HStack>
              <HStack gap={4}>
                <Icon as={MdSchool} />
                <Text fontWeight="bold" color="gray.600">الصف :</Text>
                <Text fontWeight="bold">{grade}</Text>
              </HStack>
            </SimpleGrid>

            <HStack gap={4} p={4} bg="blue.50" borderRadius="xl">
              <Icon as={MdPeopleAlt} color="blue.500" />
              <Text fontWeight="bold" color="gray.600">عدد الطلاب :</Text>
              <Text fontWeight="bold" color="blue.600">{studentCount} طالب</Text>
            </HStack>

            <Flex direction={{ base: "column", lg: "row" }} gap={4} justify="space-between">
              <Flex gap={4} direction={{ base: "column", sm: "row" }}>
                <Button flex="1" bg="pink.100" color="pink.600" py={6} borderRadius="xl" onClick={() => setView("form")}>
                  <Icon as={MdDeleteOutline} ml={2} />
                  حذف الحصة
                </Button>
                <Button flex="1" bg="black" color="white" py={6} borderRadius="xl">
                  <Icon as={MdHighlightOff} ml={2} />
                  إغلاق الحصة
                </Button>
              </Flex>
              <Button bg="cyan.500" color="white" py={8} px={10} borderRadius="xl" shadow="md" fontSize="lg">
                Scan QR Code
                <Icon as={MdQrCodeScanner} mr={2} fontSize="2xl" />
              </Button>
            </Flex>
          </VStack>
        )}
      </Box>
    </Box>
    </>
  )
}