<<<<<<< HEAD


"use client"
import { 
    Box, Heading, HStack, Icon, Input, Flex, Card, Avatar, SimpleGrid, Text , VStack,
    Badge
} from "@chakra-ui/react";
import { Bold } from "lucide-react";
import { MdVideoLibrary, MdSearch } from "react-icons/md";

export default function AllLessons() {
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
            >
            <HStack gap={3}>
                <Icon as={MdVideoLibrary} boxSize={8} color="blue.500" />
                <Heading size={{ base: "lg", md: "xl" }}>الدروس المتاحة 
                    <Badge p={2} mr={2} fontSize="18px">6</Badge>
                </Heading>
            </HStack>
            </Flex>

            <Box width="100%">

            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card.Root 
                    key={item} 
                    overflow="hidden" 
                    shadow="sm" 
                    border="1px solid #E2E8F0"
                    _hover={{ shadow: "xl", transform: "translateY(-5px)" }} 
                    transition="all 0.3s"
                >
                    <Card.Body p={3}>
                    <VStack gap={4} align="stretch">
                        <Avatar.Root shape="rounded" size="full" h="160px">
                        <Avatar.Image src={lessonImage} style={{ objectFit: 'cover' }} />
                        </Avatar.Root>
                        <Box textAlign="right" px={2} pb={2}>
                        <Card.Title mb={1} fontSize="md">درس العلوم المتكاملة #{item}</Card.Title>
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
}
=======
import React from 'react'

function LatestViews() {
    return (
        <div>LatestViews</div>
    )
}

export default LatestViews
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
