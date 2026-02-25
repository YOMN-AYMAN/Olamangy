"use client";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Button,
  Container,
  Image,
  Spinner,
  Center,
  Separator
} from "@chakra-ui/react";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {ref, get, onValue} from "firebase/database";
import {rtdb} from "@/auth/firebase";
import {
  MdArrowForward,
  MdCalendarToday,
  MdSchool,
  MdClass,
  MdVisibility,
  MdCalendarMonth,
  MdExpandMore,
  MdVideoLibrary,
  MdInsertDriveFile,
  MdQuiz,
  MdAdd
} from "react-icons/md";
import {FaYoutube} from "react-icons/fa";
import {useTeacher} from "@/providers/teacherProvider";
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "@/components/ui/accordion";
import VideoCompent from "./VideoCompent";

export default function LessonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const {teacherProfile} = useTeacher();
  const [lesson, setLesson] = useState(null);
  const [limit, setLimit] = useState(1);
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState(1);
  const [activeSection, setActiveSection] = useState(["video"]);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return;
      try {
        const lessonRef = ref(rtdb, `teachers/${teacherProfile?.id}/arrLessons/${id}`);
        const data = await get(lessonRef);
        if (data.exists()) {
          onValue(ref(rtdb, `teachers/${teacherProfile?.id}/lessons/${data.val()}`), (snapshot) => {
            if (snapshot.exists()) {
              const categoryLessons = snapshot.val();
              setLesson(categoryLessons[id]);
            }
          })
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id, teacherProfile]);

  useEffect(() => {
    setLimit(lesson?.limit || 1);
  }, [lesson]);

  if (loading) {
    return (
      <Center height="80vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  if (!lesson) {
    return (
      <Center height="80vh" flexDirection="column" gap={4}>
        <Text fontSize="xl" fontWeight="bold" color="gray.500">الدرس غير موجود</Text>
        <Button onClick={() => router.push("/Teacher/videos")} colorScheme="blue">العودة للدروس</Button>
      </Center>
    );
  }

  // Helper to extract YouTube ID
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(lesson.videoUrl);

  const stageLabels = {
    primary: "الابتدائية",
    preparatory: "الإعدادية",
    secondary: "الثانوية"
  };

  const academicYearLabels = {
    "1": "الأول",
    "2": "الثاني",
    "3": "الثالث",
    "4": "الرابع",
    "5": "الخامس",
    "6": "السادس"
  };

  return (
    <Box dir="rtl" p={{base: 4, md: 8}} bg="bg.canvas" minH="100vh">
      <Container maxW="container.lg">
        {/* Top Navigation / Parts Header */}
        <Box width="100%" overflow="hidden" overflowX="scroll" bg="bg.panel" p={4} borderRadius="2xl" shadow="sm" mb={6} border="1px solid" borderColor="border.subtle">
          <HStack gap={4} justify="start">

            {Array.from({length: limit}, (_, i) => i + 1).map((num) => (
              <Box key={num}>
                <Button
                  onClick={() => setParts(num)}
                  variant="outline"
                  bg={parts === num ? "rgb(255, 68, 102)" : "transparent"}
                  borderRadius="15px"
                  size="lg"
                  boxSize="50px"
                  fontSize="xl"
                  _hover={{bg: "rgb(255, 68, 102)", _dark: {bg: "whiteAlpha.100"}}}
                >
                  {num}
                </Button>
              </Box>
            ))}
            <Button
              onClick={() => {setLimit(limit + 1), setParts(limit + 1)}}
              variant="solid"
              bg="rgb(255, 68, 102)"
              color="white"
              borderRadius="full"
              size="lg"
              boxSize="50px"
              _hover={{bg: "rgb(255, 68, 102)"}}
            >
              <Icon as={MdAdd} boxSize={6} />
            </Button>
          </HStack>
        </Box>

        {/* Content Sections Accordion */}
        <AccordionRoot
          variant="plain"
          collapsible
          value={activeSection}
          onValueChange={(details) => setActiveSection(details.value)}
        >
          <VStack gap={4} align="stretch">
            {/* Video Section */}
            <Box bg="bg.panel" borderRadius="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="border.subtle">
              <AccordionItem value="video" border="none">
                <AccordionItemTrigger px={6} py={4} _hover={{bg: "whiteAlpha.100"}}>
                  <HStack width="100%" justify="space-between">
                    <HStack>
                      <Icon as={MdExpandMore} boxSize={5} color="fg.subtle" />
                    </HStack>
                    <HStack gap={3}>
                      <Text fontWeight="bold">فيديو</Text>
                      <Icon as={MdVideoLibrary} boxSize={5} color="fg.muted" />
                    </HStack>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent px={6} pb={6}>
              <VideoCompent/>
                </AccordionItemContent>
              </AccordionItem>
            </Box>

            {/* File Section */}
            <Box bg="bg.panel" borderRadius="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="border.subtle">
              <AccordionItem value="file" border="none">
                <AccordionItemTrigger px={6} py={4} _hover={{bg: "whiteAlpha.100"}}>
                  <HStack width="100%" justify="space-between">
                    <HStack>
                      <Icon as={MdExpandMore} boxSize={5} color="fg.subtle" />
                    </HStack>
                    <HStack gap={3}>
                      <Text fontWeight="bold">ملف</Text>
                      <Icon as={MdInsertDriveFile} boxSize={5} color="fg.muted" />
                    </HStack>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent px={6} pb={6}>
                  <Center py={10} color="fg.subtle">
                    <Text>لا توجد ملفات مرفقة حالياً</Text>
                  </Center>
                </AccordionItemContent>
              </AccordionItem>
            </Box>

            {/* Exam Section */}
            <Box bg="bg.panel" borderRadius="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="border.subtle">
              <AccordionItem value="exam" border="none">
                <AccordionItemTrigger px={6} py={4} _hover={{bg: "whiteAlpha.100"}}>
                  <HStack width="100%" justify="space-between">
                    <HStack>
                      <Icon as={MdExpandMore} boxSize={5} color="fg.subtle" />
                    </HStack>
                    <HStack gap={3}>
                      <Text fontWeight="bold">امتحان</Text>
                      <Icon as={MdQuiz} boxSize={5} color="fg.muted" />
                    </HStack>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent px={6} pb={6}>
                  <Center py={10} color="fg.subtle">
                    <Text>لا يوجد امتحان لهذا الجزء</Text>
                  </Center>
                </AccordionItemContent>
              </AccordionItem>
            </Box>
          </VStack>
        </AccordionRoot>
      </Container>
    </Box>
  );
}
