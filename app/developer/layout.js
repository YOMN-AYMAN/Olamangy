
import DeveSideBar from "@/components/developerSideBar"
import { Box, Flex } from "@chakra-ui/react"

export default function DeveloperLayout({ children }) {
    return (
        <Flex>
            <DeveSideBar />

            <Box 
                as="main"
                flex="1" 
                mr="20%" 
                minH="100vh"
                bg="bg.canvas"
                transition="background 0.3s ease"
            >
                {children}
            </Box>
        </Flex>
    )
}