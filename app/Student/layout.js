

import StudentSideBar from "@/components/studentSideBar"
import Navbar from "@/components/ui/Navbar"
import { Box, Flex } from "@chakra-ui/react"

export default function StudentLayout({ children }) {
    return (
        <Flex flexDirection="row">
            <StudentSideBar />
            <Flex dir="rtl" flexDirection="column" minW="calc(100vw - 250px)" minH="100vh">
                <Navbar/>
                <Box 
                    as="main"
                    flex="1" 
                    minH="100vh"
                >
                    {children}
                </Box>
            </Flex>
        </Flex>
    )
}