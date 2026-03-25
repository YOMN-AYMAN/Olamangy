"use client"
import {useState, useEffect, useMemo} from "react";
import {rtdb} from "@/auth/firebase";
import {ref, get, onValue} from "firebase/database";
import Link from "next/link";
import {useAuth} from "@/providers/AuthContext";
import {useStudent} from "@/providers/studentProvider";
import {Box, SimpleGrid, Image, Spinner, Center, Text, VStack, HStack, Avatar, Badge, Container, Heading, Flex, Button} from "@chakra-ui/react";


export default function StudentHome() {
  const {user} = useAuth();
  const {studentProfile, subscriptions} = useStudent();
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentLessons, setRecentLessons] = useState([]);
  const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png";
console.log(user?.academicStage?.slice(0,3)+ user?.academicYear,"ll")
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const subTeachers = Object.keys(user?.subscriptions || {})
        onValue(ref(rtdb, "teachers"), (snap) => {
          const teachersData = snap.val();
          const teachersList = Object.keys(teachersData)
            .filter(id => teachersData[id].status === "approved")
            .map(id => ({
              id,
              ...teachersData[id]
            }));
          setAllTeachers(teachersList);
        });
        for (let i in subTeachers) {
          const item = subTeachers[i];
          setAllTeachers(() => [...allTeachers, allTeachers?.[item]])
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [user]);

  const myTeachers = useMemo(() => {
    const subbedIds = subscriptions
      .filter(sh => sh.type === "teacher" && sh.status === "approved")
      .map(sh => sh.teacherId);
    return allTeachers.filter(t => subbedIds.includes(t?.id));
  }, [allTeachers, subscriptions]);

  useEffect(() => {
    if (!studentProfile || myTeachers.length === 0) return;



    fetchRecent();
  }, [myTeachers, studentProfile]);

  if (loading) return <Center h="80vh"><Spinner size="xl" color="blue.500" /></Center>;

  return (
    <Box dir="rtl" minH="100vh" p={{base: 4, md: 8}}>
      <Container>

        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md" color="fg.muted">تحب تكمل؟</Heading>
          <Button asChild variant="ghost" colorPalette="blue" size="sm">
            <Link href="/Student/latestView">عرض الكل</Link>
          </Button>
        </Flex>
        <SimpleGrid columns={{base: 1, sm: 2, lg: 3}} gap={6} mb={10}>
          {recentLessons.map((lesson) => (
            <Box key={lesson.id} bg="bg.subtle" borderRadius="2xl" overflow="hidden" shadow="sm" border="1px solid #E2E8F0" cursor="pointer" transition="all 0.3s" _hover={{transform: "translateY(-4px)", shadow: "md"}}>
              <Box position="relative">
                <Image src={lesson.thumbnail || lessonImage} alt={lesson.title} w="100%" h="160px" objectFit="cover" />
                <Badge position="absolute" top={3} right={3} variant="solid" colorPalette="blue" borderRadius="lg">
                  {lesson.teacherName}
                </Badge>
              </Box>
              <VStack align="flex-start" p={4} gap={1}>
                <Text fontWeight="bold" fontSize="sm" lineHeight="tall" color="fg.muted" noOfLines={2}>
                  {lesson.title}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
        {recentLessons.length === 0 && (
          <Box py={10} textAlign="center" bg="bg.subtle" borderRadius="2xl" mb={10}>
            <Text color="gray.500">سوف تظهر هنا اخر الدروس المرفوعة من مدرسينك</Text>
          </Box>
        )}

        {allTeachers[0] && (
          <>
            <Heading size="md" mb={6} color="fg.muted">مدرس جديد</Heading>
            <Box bg="bg.subtle" p={4} borderRadius="2xl" border="1px solid #009EDB" mb={10}>
              <Flex justify="space-between" align="center" direction={{base: "column", sm: "row"}} gap={4}>
                <HStack gap={4}>
                  <Avatar.Root size="2xl">
                    <Avatar.Image src={allTeachers[0].avatar} />
                  </Avatar.Root>
                  <VStack align="flex-start" gap={0}>
                    <Text fontWeight="bold" color="#009EDB" fontSize="xl">م/ {allTeachers[0].fullName}</Text>
                    <Badge bg="#009EDB" color="white" borderRadius="md" px={4}>{allTeachers[0].subject || "مدرس محترف"}</Badge>
                  </VStack>
                </HStack>
                <Text color="#009EDB" fontWeight="bold">{(allTeachers[0].totalStudents || 0)} طالب</Text>
              </Flex>
            </Box>
          </>
        )}

        {myTeachers.length > 0 && (
          <>
            <Heading size="md" mb={6} color="fg.muted">مدرسينك</Heading>
            <SimpleGrid columns={{base: 1, md: 2}} gap={6}>
              {myTeachers.map((teacher) => (
                <Box key={teacher.id} bg="bg.subtle" p={4} borderRadius="2xl" border="1px solid #009EDB">
                  <Flex justify="space-between" align="center">
                    <HStack gap={4}>
                      <Avatar.Root size="xl">
                        <Avatar.Image src={teacher.avatar} />
                      </Avatar.Root>
                      <VStack align="flex-start" gap={0}>
                        <Text fontWeight="bold" color="#009EDB" fontSize="lg">م/ {teacher.fullName}</Text>
                        <Badge bg="#009EDB" color="white" borderRadius="md" px={3}>{teacher.subject || "مدرسك الخاص"}</Badge>
                      </VStack>
                    </HStack>
                    <Text color="#009EDB" fontWeight="bold">{(teacher.totalStudents || 0)} طالب</Text>
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          </>
        )}

      </Container>
    </Box>
  );
}
