
import TeacherSideBar from "@/components/teacherSideBar"
import { Box, Flex } from "@chakra-ui/react"

export default function TeacherLayout({ children }) {
    return (
        <Flex dir="rtl">
            <TeacherSideBar />

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