"use client";
import {
  Box,
  Heading,
  HStack,
  Icon,
  Input,
  Flex,
  Card,
  Avatar,
  SimpleGrid,
  Text,
  VStack,
  Button,
  Dialog,
  Portal,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {MdVideoLibrary, MdSearch} from "react-icons/md";
import {FaUpload} from "react-icons/fa";
import {useEffect, useState, useRef} from "react";
import {ref, onValue, remove} from "firebase/database";
import {rtdb} from "@/auth/firebase";
import {useAuth} from "@/providers/AuthContext";
import {useRouter} from "next/navigation";
import Link from "next/link";
import UploadVideo from "./UploadVideo";
import {deleteVideo} from "@/components/ui/UploadVideo";

export default function AllLessons() {
  const router = useRouter();
  const {user} = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const pressTimer = useRef(null);
  const isPressing = useRef(false);

  const handlePointerDown = (lesson) => {
    isPressing.current = false;
    pressTimer.current = setTimeout(() => {
      isPressing.current = true;
      setLessonToDelete(lesson);
      setIsDeleteDialogOpen(true);
    }, 600);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleClick = (lessonId) => {
    if (!isPressing.current) {
      router.push(`/Teacher/lessons/${lessonId}`);
    }
  };

  const handleDeleteLesson = async () => {
    if (!user || !lessonToDelete) return;
    setDeleteLoading(true);
    try {
      const lessonRef = ref(rtdb, `teachers/${user.uid}/lessons/${lessonToDelete.category}/${lessonToDelete.id}`);
      const arrRef = ref(rtdb, `teachers/${user.uid}/arrLessons/${lessonToDelete.id}`);
      await remove(lessonRef);
      await remove(arrRef);
      await deleteVideo(lessonToDelete.videoUrl);
      setIsDeleteDialogOpen(false);
      setLessonToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const lessonImage = "/Science,_Technology,_Engineering_and_Mathematics.svg.png";

  useEffect(() => {
    if (!user) return;
    const lessonsRef = ref(rtdb, `teachers/${user.uid}/lessons`);
    const unsubscribe = onValue(lessonsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allLessons = [];
        Object.keys(data).forEach((category) => {
          const categoryData = data[category];
          if (typeof categoryData === "object") {
            Object.keys(categoryData).forEach((lessonId) => {
              allLessons.push({
                ...categoryData[lessonId],
                id: lessonId,
                category: category,
              });
            });
          }
        });
        allLessons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLessons(allLessons);
      } else {
        setLessons([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Box
        p={{base: 4, md: 8}}
        dir="rtl"
        mr={{base: "10px", md: "10px"}}
        transition="margin 0.3s"
      >
        <Flex
          justify="space-between"
          align={{base: "stretch", md: "center"}}
          mb={10}
          direction={{base: "column", md: "row"}}
          gap={6}
        >


          <Box position="relative" w={{base: "100%", md: "350px"}}>
            <Input
              placeholder="بحث عن درس..."
              borderRadius="2xl"
              pr={11}
              bg="bg.panel"
              size="lg"
              shadow="sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              _focus={{borderColor: "blue.400", shadow: "md"}}
            />
            <Icon
              as={MdSearch}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
              boxSize={5}
            />
          </Box>
        </Flex>

        <Box width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
            <HStack gap={2}>
              <Icon as={MdVideoLibrary} color="blue.500" boxSize={5} />
              <Text fontWeight="bold" fontSize="lg">
                جميع الدروس
              </Text>
            </HStack>
            <Box p={0}>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button
                    bg="blue.500"
                    p={2}
                    mb={2}
                    color="white"
                    borderRadius="2xl"
                    fontSize={12}
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                    size="lg"
                    shadow="sm"
                    _hover={{bg: "blue.600"}}
                  >
                    <Text> رفع دروس</Text>
                    <Icon as={FaUpload} boxSize={4} color="white" />
                  </Button>
                </Dialog.Trigger>

                <Portal display="flex" alignItems="center" justifyContent="center">
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content
                      width="fit-content"
                      borderRadius="15px"
                      overflow="hidden"
                      display="flex"
                      alignSelf="center"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Dialog.Body>
                        <UploadVideo />
                      </Dialog.Body>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </Box>
          </Box>

          {loading ? (
            <Center py={20}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          ) : filteredLessons.length > 0 ? (
            <SimpleGrid columns={{base: 1, sm: 2, lg: 3, xl: 4}} gap={6}>
              {filteredLessons.map((lesson) => (
                <Card.Root
                  key={lesson.id}
                  cursor="pointer"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setLessonToDelete(lesson);
                    setIsDeleteDialogOpen(true);
                  }}
                  onPointerDown={() => handlePointerDown(lesson)}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onClick={() => handleClick(lesson.id)}
                  overflow="hidden"
                  shadow="sm"
                  border="1px solid"
                  borderColor="border.subtle"
                  _hover={{shadow: "xl", transform: "translateY(-5px)"}}
                  transition="all 0.3s"
                  height="100%"
                >
                  <Card.Body p={3}>
                    <VStack gap={4} align="stretch">
                      <Avatar.Root shape="rounded" size="full" h="160px">
                        <Avatar.Image
                          src={lesson?.image}
                          style={{objectFit: "cover"}}
                        />
                      </Avatar.Root>
                      <Box textAlign="right" px={2} pb={2}>
                        <Card.Title mb={1} fontSize="md">
                          {lesson.title}
                        </Card.Title>
                        <Card.Description fontSize="sm" lineClamp={2}>
                          {lesson.description || "لا يوجد وصف لهذا الدرس."}
                        </Card.Description>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          ) : (
            <Center py={20} flexDirection="column" gap={4}>
              <Text fontSize="lg" color="gray.500">
                لا توجد دروس حالياً
              </Text>
              {searchQuery && (
                <Button variant="ghost" onClick={() => setSearchQuery("")}>
                  عرض كل الدروس
                </Button>
              )}
            </Center>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={isDeleteDialogOpen} onOpenChange={(e) => setIsDeleteDialogOpen(e.open)}>
        <Portal display="flex" alignItems="center" justifyContent="center">
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              width="90%"
              maxWidth="400px"
              borderRadius="15px"
              p={6}
              bg="bg.panel"
              dir="rtl"
            >
              <Dialog.Header mb={4}>
                <Dialog.Title fontSize="xl" fontWeight="bold" color="red.500">حذف الدرس</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body mb={6}>
                <Text>هل أنت متأكد من حذف درس &quot;{lessonToDelete?.title}&quot; بجميع محتوياته (فيديو، ملفات، وصور) من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.</Text>
              </Dialog.Body>
              <Dialog.Footer display="flex" gap={3} justifyContent="flex-end">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteLoading} borderRadius="lg">
                  إلغاء
                </Button>
                <Button colorScheme="red" bg="red.500" color="white" onClick={handleDeleteLesson} loading={deleteLoading} borderRadius="lg" _hover={{bg: "red.600"}}>
                  تأكيد الحذف
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
