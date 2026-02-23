<<<<<<< HEAD


"use client"
import { Box, HStack, VStack, Text, Input, Avatar, Flex, Icon, IconButton } from "@chakra-ui/react";
import { MdSend, MdAttachFile } from "react-icons/md";
=======
// "use client"
// import Navbar from "@/components/ui/Navbar";
// import { Box, HStack, VStack, Text, Input, Avatar, Circle, Flex } from "@chakra-ui/react";

// export default function StudentChat() {
//   return (
//     <>
//     <Navbar/>
//     <Flex h="85vh" dir="rtl" gap={4} p={4}>
//       {/* قائمة الطلاب */}
//       <VStack w="300px" bg="white" borderRadius="2xl" border="1px solid #E2E8F0" overflowY="auto" align="stretch" p={2}>
//         {[1, 2, 3, 4].map((i) => (
//           <HStack key={i} p={3} _hover={{ bg: "blue.50" }} cursor="pointer" borderRadius="xl">
//             <Avatar.Root size="sm">
//               <Avatar.Image src={`https://i.pravatar.cc/150?u=${i}`} />
//               <Avatar.Fallback />
//             </Avatar.Root>
//             <VStack align="flex-start" gap={0}>
//               <Text fontSize="sm" fontWeight="bold">أحمد محمد</Text>
//               <Text fontSize="xs" color="gray.500" truncate maxW="150px">مستر عندي سؤال في النحو...</Text>
//             </VStack>
//           </HStack>
//         ))}
//       </VStack>

//       {/* منطقة الرسائل */}
//       <Flex flex={1} bg="white" borderRadius="2xl" border="1px solid #E2E8F0" direction="column">
//         <Box p={4} borderBottom="1px solid #E2E8F0">
//           <Text fontWeight="bold">أحمد محمد</Text>
//         </Box>
//         <VStack flex={1} p={4} overflowY="auto" align="stretch" gap={4}>
//           <Box bg="gray.100" p={3} borderRadius="lg" alignSelf="flex-start">يا مستر هو الدرس ده ملغي؟</Box>
//           <Box bg="blue.500" color="white" p={3} borderRadius="lg" alignSelf="flex-end">لا يا حبيبي، ده أهم درس في المنهج</Box>
//         </VStack>
//         <Box p={4} borderTop="1px solid #E2E8F0">
//           <Input placeholder="اكتب رسالتك..." borderRadius="full" bg="gray.50" />
//         </Box>
//       </Flex>
//     </Flex>
//     </>
//   );
// }




"use client"
import {Box, HStack, VStack, Text, Input, Avatar, Flex, Icon, IconButton} from "@chakra-ui/react";
import {MdSend, MdAttachFile} from "react-icons/md";
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f

export default function StudentChat() {
  return (
    <>
<<<<<<< HEAD
      <Flex 
        h="88vh" 
        dir="rtl" 
        gap={4} 
        p={{ base: 2, md: 4 }}
        mt={2}
        mr={{ base: "10px", md: "10px" }} 
        transition="margin 0.3s"
        direction={{ base: "column", md: "row" }} 
      >
        
        <VStack 
          w={{ base: "100%", md: "40%" }} 
          h={{ base: "auto", md: "full" }}
          bg="white" 
          borderRadius="2xl" 
          border="1px solid #E2E8F0" 
          align="stretch" 
=======
      
      <Flex
        h="88vh"
        dir="rtl"
        gap={4}
        p={{base: 2, md: 4}}
        mt={2}
        mr={{base: "10px", md: "10px"}}
        transition="margin 0.3s"
        direction={{base: "column", md: "row"}}
      >

        <VStack
          w={{base: "100%", md: "40%"}}
          h={{base: "auto", md: "full"}}
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border.subtle"
          align="stretch"
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
          p={2}
          shadow="sm"
          ml={-40}
        >
<<<<<<< HEAD
          <Flex 
            direction={{ base: "row", md: "column" }} 
            gap={2}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <HStack 
                key={i} 
                p={3} 
                _hover={{ bg: "blue.50" }} 
                cursor="pointer" 
                borderRadius="xl"
                minW={{ base: "60px", md: "full" }}
                justify={{ base: "center", md: "flex-start" }}
=======
          <Flex
            direction={{base: "row", md: "column"}}
            gap={2}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <HStack
                key={i}
                p={3}
                _hover={{bg: "bg.subtle"}}
                cursor="pointer"
                borderRadius="xl"
                minW={{base: "60px", md: "full"}}
                justify={{base: "center", md: "flex-start"}}
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
              >
                <Avatar.Root size="sm" border={i === 1 ? "2px solid #3182ce" : "none"}>
                  <Avatar.Image src={`https://i.pravatar.cc/150?u=${i}`} />
                  <Avatar.Fallback />
                </Avatar.Root>
<<<<<<< HEAD
                
                <VStack align="flex-start" gap={0} display={{ base: "none", md: "flex" }}>
=======

                <VStack align="flex-start" gap={0} display={{base: "none", md: "flex"}}>
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
                  <Text fontSize="sm" fontWeight="bold">أحمد محمد</Text>
                  <Text fontSize="xs" color="gray.500" truncate maxW="150px">مستر عندي سؤال...</Text>
                </VStack>
              </HStack>
            ))}
          </Flex>
        </VStack>

        {/* منطقة الرسائل */}
<<<<<<< HEAD
        <Flex 
          flex={1} 
          bg="white" 
          borderRadius="2xl" 
          border="1px solid #E2E8F0" 
          direction="column" 
=======
        <Flex
          flex={1}
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border.subtle"
          direction="column"
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
          shadow="sm"
          h="full"
          overflow="hidden"
        >
          {/* Header الشات */}
<<<<<<< HEAD
          <Box p={4} borderBottom="1px solid #E2E8F0" bg="white">
            <HStack>
                <Avatar.Root size="xs">
                    <Avatar.Image src="https://i.pravatar.cc/150?u=1" />
                </Avatar.Root>
                <VStack align="flex-start" gap={0}>
                    <Text fontWeight="bold" fontSize="sm">أحمد محمد</Text>
                    <Text fontSize="xs" color="green.500">متصل الآن</Text>
                </VStack>
=======
          <Box p={4} borderBottom="1px solid" borderColor="border.subtle" bg="bg.panel">
            <HStack>
              <Avatar.Root size="xs">
                <Avatar.Image src="https://i.pravatar.cc/150?u=1" />
              </Avatar.Root>
              <VStack align="flex-start" gap={0}>
                <Text fontWeight="bold" fontSize="sm">أحمد محمد</Text>
                <Text fontSize="xs" color="green.500">متصل الآن</Text>
              </VStack>
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
            </HStack>
          </Box>

          {/* منطقة الرسائل (Scrollable) */}
<<<<<<< HEAD
          <VStack 
            flex={1} 
            p={4} 
            overflowY="auto" 
            align="stretch" 
            gap={4} 
            bg="#fdfdfd"
          >
            <Box 
                bg="gray.100" 
                p={3} 
                borderRadius="2xl" 
                borderBottomRightRadius="none" 
                alignSelf="flex-start" 
                fontSize="sm" 
                maxW="80%"
            >
                يا مستر هو الدرس ده ملغي؟
            </Box>
            
            <Box 
                bg="blue.500" 
                color="white" 
                p={3} 
                borderRadius="2xl" 
                borderBottomLeftRadius="none" 
                alignSelf="flex-end" 
                fontSize="sm" 
                maxW="80%"
            >
                لا يا حبيبي، ده أهم درس في المنهج.. ركز فيه كويس.
=======
          <VStack
            flex={1}
            p={4}
            overflowY="auto"
            align="stretch"
            gap={4}
            bg="bg.canvas"
          >
            <Box
              bg="bg.subtle"
              p={3}
              borderRadius="2xl"
              borderBottomRightRadius="none"
              alignSelf="flex-start"
              fontSize="sm"
              maxW="80%"
            >
              يا مستر هو الدرس ده ملغي؟
            </Box>

            <Box
              bg="blue.500"
              color="white"
              p={3}
              borderRadius="2xl"
              borderBottomLeftRadius="none"
              alignSelf="flex-end"
              fontSize="sm"
              maxW="80%"
            >
              لا يا حبيبي، ده أهم درس في المنهج.. ركز فيه كويس.
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
            </Box>
          </VStack>

          {/* Input الرسالة */}
<<<<<<< HEAD
          <Box p={4} borderTop="1px solid #E2E8F0">
            <HStack gap={2}>
              <IconButton 
                aria-label="Attach file" 
                variant="ghost" 
                color="gray.400" 
=======
          <Box p={4} borderTop="1px solid" borderColor="border.subtle">
            <HStack gap={2}>
              <IconButton
                aria-label="Attach file"
                variant="ghost"
                color="gray.400"
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
                borderRadius="full"
              >
                <MdAttachFile size={20} />
              </IconButton>
<<<<<<< HEAD
              
              <Input 
                placeholder="اكتب رسالتك..." 
                borderRadius="xl" 
                bg="gray.50" 
                border="none" 
                _focus={{ bg: "white", shadow: "sm" }}
              />
              
              <IconButton 
                aria-label="Send message" 
                bg="blue.500" 
                color="white" 
                borderRadius="xl"
                _hover={{ bg: "blue.600" }}
              >
                <MdSend style={{ transform: "rotate(180deg)" }} />
=======

              <Input
                placeholder="اكتب رسالتك..."
                borderRadius="xl"
                bg="bg.subtle"
                border="none"
                _focus={{bg: "bg.panel", shadow: "sm"}}
              />

              <IconButton
                aria-label="Send message"
                bg="blue.500"
                color="white"
                borderRadius="xl"
                _hover={{bg: "blue.600"}}
              >
                <MdSend style={{transform: "rotate(180deg)"}} />
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
              </IconButton>
            </HStack>
          </Box>
        </Flex>

      </Flex>
    </>
  );
}