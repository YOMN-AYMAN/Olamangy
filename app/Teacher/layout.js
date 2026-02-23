
import TeacherSideBar from "@/components/teacherSideBar"
import Navbar from "@/components/ui/Navbar"
import { Box, Flex } from "@chakra-ui/react"

export default function TeacherLayout({ children }) {
    return (
        <Flex flexDirection="row">
            <TeacherSideBar />
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