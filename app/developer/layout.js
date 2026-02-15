
import DeveSideBar from "@/components/developerSideBar"
import { Box, Flex } from "@chakra-ui/react"

export default function DeveloperLayout({ children }) {
    return (
        <Flex dir="rtl">
            <DeveSideBar />

            <Box 
                as="main"
                flex="1" 
                mr="20%" 
                minH="100vh"
            >
                {children}
            </Box>
        </Flex>
    )
}