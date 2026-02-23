

import StudentSideBar from "@/components/studentSideBar"
import Navbar from "@/components/ui/Navbar"
import { Box, Flex } from "@chakra-ui/react"

export default function StudentLayout({ children }) {
    return (
        <Flex flexDirection="row">
            <StudentSideBar />
            <Flex dir="rtl" flexDirection="column">
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