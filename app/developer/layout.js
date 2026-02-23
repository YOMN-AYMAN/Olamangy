
import DeveSideBar from "@/components/developerSideBar"
import { Box, Flex } from "@chakra-ui/react"

export default function DeveloperLayout({ children }) {
    return (
<<<<<<< HEAD
        <Flex dir="rtl">
=======
        <Flex>
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
            <DeveSideBar />

            <Box 
                as="main"
                flex="1" 
                mr="20%" 
                minH="100vh"
<<<<<<< HEAD
=======
                bg="bg.canvas"
                transition="background 0.3s ease"
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
            >
                {children}
            </Box>
        </Flex>
    )
}