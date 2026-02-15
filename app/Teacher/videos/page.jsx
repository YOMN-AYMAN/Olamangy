"use client"
import Navbar from "@/components/ui/Navbar";
import { Box, Heading, HStack, Icon, Input, Flex , Card , Avatar } from "@chakra-ui/react";
import { MdVideoLibrary, MdSearch } from "react-icons/md";

export default function AllLessons() {
  const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png"
  return (
    <>
    <Navbar/>
    <Box p={6} dir="rtl">
      <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
        <HStack gap={2}>
          <Icon as={MdVideoLibrary} boxSize={6} color="blue.500" />
          <Heading size="lg">الدروس المتاحة</Heading>
        </HStack>
        {/* شريط البحث */}
        <Box position="relative" w={{ base: "100%", md: "300px" }}>
          <Input placeholder="بحث عن درس..." borderRadius="xl" pr={10} />
          <Icon as={MdSearch} position="absolute" right={3} top="50%" transform="translateY(-50%)" color="gray.400" />
        </Box>
      </Flex>

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

        <Flex justify="space-between" width="95%" m="auto" mt={4}>

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
    </Box>
    </>
  );
}