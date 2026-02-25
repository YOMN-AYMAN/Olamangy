
import TeacherSideBar from "@/components/teacherSideBar"
import Navbar from "@/components/ui/Navbar"
import {Box, Flex} from "@chakra-ui/react"

export default function TeacherLayout({children}) {
  return (
    <Box width={"100%"} display={"flex"} bg={"bg.canvas"} >
      <Box position={"relative"} w={{base: "85px", md: "20%"}}>
        <TeacherSideBar />

      </Box>
      <Box width={"100%"} overflow="hidden" display={"flex"} flexDirection={"column"}>
        <Box mr={-5}>
          <Navbar />
        </Box>
        <Box
          as="main"
          flex="1"
          minH="100vh"
          bg="bg.canvas"
          transition="background 0.3s ease"
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}