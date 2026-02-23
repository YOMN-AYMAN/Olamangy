<<<<<<< HEAD


"use client"
import { 
    Box, Heading, HStack, Icon, Input, Flex, Card, Avatar, SimpleGrid, Text , VStack
=======
"use client";
import {
  Box,
  Heading,
  HStack,
  Icon,
  Input,
  Flex,
  Card,
  Avatar,
  SimpleGrid,
  Text,
  VStack,
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
} from "@chakra-ui/react";
import { MdVideoLibrary, MdSearch } from "react-icons/md";

export default function AllLessons() {
<<<<<<< HEAD
  const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png";

  return (
    <>
      <Box 
        p={{ base: 4, md: 8 }} 
        dir="rtl" 
        mr={{ base: "10px", md: "10px" }}
        transition="margin 0.3s"
      >
        <Flex 
            justify="space-between" 
            align={{ base: "stretch", md: "center" }} 
            mb={10} 
            direction={{ base: "column", md: "row" }} 
            gap={6}
=======
  const lessonImage =
    "/Science,_Technology,_Engineering_and_Mathematics.svg.png";

  return (
    <>
      <Box
        p={{ base: 4, md: 8 }}
        dir="rtl"
        mr={{ base: "10px", md: "10px" }}
        transition="margin 0.3s"
      >
        <Flex
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          mb={10}
          direction={{ base: "column", md: "row" }}
          gap={6}
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
        >
          <HStack gap={3}>
            <Icon as={MdVideoLibrary} boxSize={8} color="blue.500" />
            <Heading size={{ base: "lg", md: "xl" }}>الدروس المتاحة</Heading>
          </HStack>

          <Box position="relative" w={{ base: "100%", md: "350px" }}>
<<<<<<< HEAD
            <Input 
                placeholder="بحث عن درس..." 
                borderRadius="2xl" 
                pr={11} 
                bg="white" 
                size="lg"
                shadow="sm"
                _focus={{ borderColor: "blue.400", shadow: "md" }}
            />
            <Icon 
                as={MdSearch} 
                position="absolute" 
                right={4} 
                top="50%" 
                transform="translateY(-50%)" 
                color="gray.400" 
                boxSize={5}
=======
            <Input
              placeholder="بحث عن درس..."
              borderRadius="2xl"
              pr={11}
              bg="bg.panel"
              size="lg"
              shadow="sm"
              _focus={{ borderColor: "blue.400", shadow: "md" }}
            />
            <Icon
              as={MdSearch}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
              boxSize={5}
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
            />
          </Box>
        </Flex>

        <Box width="100%">
          <HStack mb={6} gap={2}>
            <Icon as={MdVideoLibrary} color="blue.500" boxSize={5} />
<<<<<<< HEAD
            <Text fontWeight="bold" fontSize="lg">جميع الفيديوهات</Text>
=======
            <Text fontWeight="bold" fontSize="lg">
              جميع الفيديوهات
            </Text>
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
          </HStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
<<<<<<< HEAD
              <Card.Root 
                key={item} 
                overflow="hidden" 
                shadow="sm" 
                border="1px solid #E2E8F0"
                _hover={{ shadow: "xl", transform: "translateY(-5px)" }} 
=======
              <Card.Root
                key={item}
                overflow="hidden"
                shadow="sm"
                border="1px solid"
                borderColor="border.subtle"
                _hover={{ shadow: "xl", transform: "translateY(-5px)" }}
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
                transition="all 0.3s"
              >
                <Card.Body p={3}>
                  <VStack gap={4} align="stretch">
                    <Avatar.Root shape="rounded" size="full" h="160px">
<<<<<<< HEAD
                      <Avatar.Image src={lessonImage} style={{ objectFit: 'cover' }} />
                    </Avatar.Root>
                    <Box textAlign="right" px={2} pb={2}>
                      <Card.Title mb={1} fontSize="md">درس العلوم المتكاملة #{item}</Card.Title>
=======
                      <Avatar.Image
                        src={lessonImage}
                        style={{ objectFit: "cover" }}
                      />
                    </Avatar.Root>
                    <Box textAlign="right" px={2} pb={2}>
                      <Card.Title mb={1} fontSize="md">
                        درس العلوم المتكاملة #{item}
                      </Card.Title>
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
                      <Card.Description fontSize="sm">
                        هذا النص هو مثال لوصف الدرس ومحتوياته التعليمية.
                      </Card.Description>
                    </Box>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
