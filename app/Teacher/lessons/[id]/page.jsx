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
  Separator,
  Input,
  Textarea,
} from "@chakra-ui/react";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState, useRef} from "react";
import {ref, get, onValue, update} from "firebase/database";
import {rtdb} from "@/auth/firebase";
import {uploadFileToB2} from "@/components/ui/UploadImg";
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
  MdAdd,
  MdEdit,
  MdCheck,
  MdClose
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
import FileComponent from "./FileComponent";
import Quiz from "./Quiz";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── SortablePartButton: زرار الجزء القابل للسحب ─────────────
function SortablePartButton({ id, num, isActive, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: "grab",
    touchAction: "none",
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Button
        onClick={onClick}
        variant="outline"
        bg={isActive ? "rgb(255, 68, 102)" : "transparent"}
        color={isActive ? "white" : "inherit"}
        borderRadius="15px"
        size="lg"
        boxSize="50px"
        fontSize="xl"
        _hover={{ bg: "rgb(255, 68, 102)", color: "white", _dark: { bg: "whiteAlpha.200" } }}
        transition="all 0.15s"
      >
        {num}
      </Button>
    </Box>
  );
}

export default function LessonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const {teacherProfile} = useTeacher();
  const [lesson, setLesson] = useState(null);
  const [limit, setLimit] = useState(1);
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState(1);
  const [currentPart, setCurrentPart] = useState(null);
  const [activeSection, setActiveSection] = useState(["video"]);
  const [path, setPath] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditing, setIsEditing]               = useState(false);
  const [isSavingInfo, setIsSavingInfo]         = useState(false);
  const [editTitle, setEditTitle]               = useState("");
  const [editDescription, setEditDescription]   = useState("");
  const [partOrder, setPartOrder]               = useState([]); // ترتيب الأجزاء
  const [activeDragId, setActiveDragId]         = useState(null);
  const imageUploadRef = useRef(null);

  // long-press sensor (300ms)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 300, tolerance: 5 } })
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadFileToB2(file, () => { });
      const lessonRef = ref(rtdb, `teachers/${teacherProfile?.id}/lessons/${path}/${id}`);
      await update(lessonRef, {image: url});
    } catch (err) {
      console.error("فشل رفع الصورة:", err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleStartEdit = () => {
    setEditTitle(lesson?.title || "");
    setEditDescription(lesson?.description || "");
    setIsEditing(true);
  };

  const handleSaveInfo = async () => {
    setIsSavingInfo(true);
    try {
      const lessonRef = ref(rtdb, `teachers/${teacherProfile?.id}/lessons/${path}/${id}`);
      await update(lessonRef, {
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("فشل الحفظ:", err);
    } finally {
      setIsSavingInfo(false);
    }
  };

  // ── Drag handlers ──────────────────────────────────────────────────
  const handleDragStart = ({ active }) => setActiveDragId(active.id);

  const handleDragEnd = async ({ active, over }) => {
    setActiveDragId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = partOrder.indexOf(active.id);
    const newIndex = partOrder.indexOf(over.id);
    const newOrder = arrayMove(partOrder, oldIndex, newIndex);
    setPartOrder(newOrder);

    // pages[0] محجوز دايمًا — نرتّب من [1] فقط
    const pagesArr = lesson?.pages || [];
    const page0 = pagesArr[0] ?? null; // المحجوز
    const reorderedParts = newOrder.map((pageId) => pagesArr[Number(pageId)]);
    const finalPages = [page0, ...reorderedParts];

    try {
      const lessonRef = ref(rtdb, `teachers/${teacherProfile?.id}/lessons/${path}/${id}`);
      await update(lessonRef, { pages: finalPages });
    } catch (err) {
      console.error("فشل ترتيب الأجزاء:", err);
      setPartOrder(partOrder); // rollback
    }
  };
  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return;
      try {
        const lessonRef = ref(rtdb, `teachers/${teacherProfile?.id}/arrLessons/${id}`);
        const data = await get(lessonRef);
        if (data.exists()) {
          setPath(data.val())
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
    setLimit(lesson?.pages?.length - 1 || 1);
    // بناء قائمة الترتيب الأولية (index من 1 للأجزاء الفعلية)
    if (lesson?.pages) {
      setPartOrder(lesson.pages.map((_, i) => i).filter((i) => i > 0));
    }
  }, [lesson]);
  ////////////////////////
  useEffect(() => {
    if (parts && lesson?.pages) {
      setCurrentPart(lesson?.pages[parts])
      setActiveSection([lesson?.pages[parts]?.type])
    }
  }, [parts, lesson]);

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
        <Box
          width="100%"
          bg="bg.panel"
          p={4}
          borderRadius="2xl"
          shadow="sm"
          mb={6}
          border="1px solid"
          borderColor={isEditing ? "pink.300" : "border.subtle"}
          transition="border-color 0.2s"
        >
          <HStack justify="space-between" align="start">
            {/* النص او حقول التعديل */}
            <Box flex={1} ml={3}>
              {isEditing ? (
                <VStack align="stretch" gap={2}>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="عنوان الدرس"
                    fontWeight="bold"
                    fontSize="lg"
                    bg="bg.panel"
                    borderRadius="lg"
                    dir="rtl"
                  />
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="وصف الدرس"
                    fontSize="sm"
                    bg="bg.panel"
                    borderRadius="lg"
                    dir="rtl"
                    rows={2}
                  />
                </VStack>
              ) : (
                <>
                  <Text fontWeight="bold" fontSize="lg">{lesson?.title}</Text>
                  <Text color="gray.500" fontSize="sm" mt={1}>{lesson?.description}</Text>
                </>
              )}
            </Box>

            {/* يمين: الصورة + زرار */}
            <VStack gap={2} align="center">
              {/* زرر التعديل/الحفظ/الإلغاء */}
              {isEditing ? (
                <HStack gap={1}>
                  <Button
                    size="xs"
                    bg="rgb(255, 68, 102)"
                    color="white"
                    borderRadius="lg"
                    loading={isSavingInfo}
                    _hover={{bg: "pink.600"}}
                    onClick={handleSaveInfo}
                  >
                    <Icon as={MdCheck} />
                    حفظ
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    borderRadius="lg"
                    onClick={() => setIsEditing(false)}
                  >
                    <Icon as={MdClose} />
                  </Button>
                </HStack>
              ) : (
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  borderRadius="lg"
                  onClick={handleStartEdit}
                  _hover={{color: "rgb(255,68,102)", bg: "pink.50", _dark: {bg: "whiteAlpha.100"}}}
                >
                  <Icon as={MdEdit} boxSize={4} />
                </Button>
              )}

              {/* الصورة */}
              <input
                type="file"
                accept="image/*"
                ref={imageUploadRef}
                style={{display: "none"}}
                onChange={handleImageUpload}
              />
              {!lesson?.image ? (
                <Button
                  size="sm"
                  bg="rgb(255, 68, 102)"
                  color="white"
                  borderRadius="xl"
                  loading={isUploadingImage}
                  _hover={{bg: "pink.600"}}
                  onClick={() => imageUploadRef.current?.click()}
                >
                  رفع صورة
                </Button>
              ) : (
                <Box
                  position="relative"
                  cursor="pointer"
                  onClick={() => imageUploadRef.current?.click()}
                  title="انقر لتغيير الصورة"
                >
                  <Image
                    src={lesson?.image}
                    alt={lesson?.title}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="lg"
                  />
                  {isUploadingImage && (
                    <Box
                      position="absolute"
                      inset={0}
                      bg="blackAlpha.600"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Spinner size="sm" color="white" />
                    </Box>
                  )}
                </Box>
              )}
            </VStack>
          </HStack>
        </Box>
        {/* Top Navigation / Parts Header */}
        <Box
          width="100%"
          overflow="hidden"
          overflowX="auto"
          bg="bg.panel"
          p={4}
          borderRadius="2xl"
          shadow="sm"
          mb={6}
          border="1px solid"
          borderColor="border.subtle"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={partOrder} strategy={horizontalListSortingStrategy}>
              <HStack gap={3} justify="start" wrap="nowrap">
                {partOrder.map((pageIdx) => (
                  <SortablePartButton
                    key={pageIdx}
                    id={pageIdx}
                    num={partOrder.indexOf(pageIdx) + 1}
                    isActive={parts === pageIdx}
                    onClick={() => setParts(pageIdx)}
                  />
                ))}

                {/* زرار إضافة جزء جديد */}
                <Button
                  onClick={() => {
                    const newIdx = (lesson?.pages?.length) ?? (limit + 1);
                    setPartOrder((prev) => [...prev, newIdx]);
                    setLimit((l) => l + 1);
                    setParts(newIdx);
                  }}
                  variant="solid"
                  bg="rgb(255, 68, 102)"
                  color="white"
                  borderRadius="full"
                  size="lg"
                  boxSize="50px"
                  flexShrink={0}
                  _hover={{bg: "pink.600"}}
                >
                  <Icon as={MdAdd} boxSize={6} />
                </Button>
              </HStack>
            </SortableContext>

            {/* عنصر السحب المرئي */}
            <DragOverlay>
              {activeDragId !== null ? (
                <Box
                  w="50px" h="50px"
                  borderRadius="15px"
                  bg="rgb(255,68,102)"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                  boxShadow="0 8px 24px rgba(255,68,102,0.5)"
                  opacity={0.95}
                >
                  {partOrder.indexOf(activeDragId) + 1}
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
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
            {(currentPart?.type === "video" || !currentPart?.type) && (
              <Box bg="bg.panel" borderRadius="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="border.subtle">
                <AccordionItem value="video" border="none">
                  <AccordionItemTrigger px={6} py={4} _hover={{bg: "whiteAlpha.100"}}>
                    <HStack width="100%" justify="space-between">
                      <HStack>
                        <Icon as={MdExpandMore} boxSize={5} color={activeSection == "video" ? "fg.pink" : "fg.subtle"} />
                      </HStack>
                      <HStack gap={3}>
                        <Text fontWeight="bold" color={activeSection == "video" ? "fg.pink" : "fg.subtle"} >فيديو {lesson?.arr?.[parts - 1]?.type === "video" && "(مطبق)"}</Text>
                        <Icon as={MdVideoLibrary} boxSize={5} color={activeSection == "video" ? "fg.pink" : "fg.subtle"} />
                      </HStack>
                    </HStack>
                  </AccordionItemTrigger>
                  <AccordionItemContent px={6} pb={6}>
                    <VStack align="stretch" gap={4}>
                      {lesson?.arr?.[parts - 1]?.type === "video" && (
                        <Box p={4} bg="bg.muted" borderRadius="lg">
                          <Text fontWeight="bold">{lesson.arr[parts - 1].title}</Text>
                          <Text fontSize="sm">{lesson.arr[parts - 1].description}</Text>
                          <Text fontSize="xs" color="blue.500" mt={2}>ID: {lesson.arr[parts - 1].videoUrl}</Text>
                        </Box>
                      )}
                      <Separator />
                      <VideoCompent
                        lesson={lesson}
                        path={path}
                        currentPart={currentPart}
                        teacherId={teacherProfile?.id}
                        partIndex={parts}
                      />
                    </VStack>
                  </AccordionItemContent>
                </AccordionItem>
              </Box>
            )}
            {/* File Section */}
            {(currentPart?.type === "file" || !currentPart?.type) && (
              <Box bg="bg.panel" borderRadius="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="border.subtle">
                <AccordionItem value="file" border="none">
                  <AccordionItemTrigger px={6} py={4} _hover={{bg: "whiteAlpha.100"}}>
                    <HStack width="100%" justify="space-between">
                      <HStack>
                        <Icon as={MdExpandMore} boxSize={5} color={activeSection == "file" ? "fg.pink" : "fg.subtle"} />
                      </HStack>
                      <HStack gap={3}>
                        <Text fontWeight="bold" color={activeSection == "file" ? "fg.pink" : "fg.subtle"}>ملف {lesson?.arr?.[parts - 1]?.type === "file" && "(مطبق)"}</Text>
                        <Icon as={MdInsertDriveFile} boxSize={5} color={activeSection == "file" ? "fg.pink" : "fg.subtle"} />
                      </HStack>
                    </HStack>
                  </AccordionItemTrigger>
                  <AccordionItemContent px={6} pb={6}>
                    <VStack align="stretch" gap={4}>
                      {lesson?.arr?.[parts - 1]?.type === "file" && (
                        <Box p={4} bg="bg.muted" borderRadius="lg">
                          <Text fontWeight="bold">{lesson.arr[parts - 1].title}</Text>
                          <Text fontSize="sm">{lesson.arr[parts - 1].description}</Text>
                          <Text fontSize="xs" color="blue.500" mt={2}>ID: {lesson.arr[parts - 1].videoUrl}</Text>
                        </Box>
                      )}
                      <Separator />
                      <FileComponent
                        lesson={lesson}
                        path={path}
                        currentPart={currentPart}
                        teacherId={teacherProfile?.id}
                        partIndex={parts}
                      />
                    </VStack>
                  </AccordionItemContent>
                </AccordionItem>
              </Box>
            )}

            {/* Exam Section */}
            {(currentPart?.type === "exam" || !currentPart?.type) && (
              <Box bg="bg.panel" borderRadius="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="border.subtle">
                <AccordionItem value="exam" border="none">
                  <AccordionItemTrigger px={6} py={4} _hover={{bg: "whiteAlpha.100"}}>
                    <HStack width="100%" justify="space-between">
                      <HStack>
                        <Icon as={MdExpandMore} boxSize={5} color={activeSection == "exam" ? "fg.pink" : "fg.subtle"} />
                      </HStack>
                      <HStack gap={3}>
                        <Text fontWeight="bold" color={activeSection == "exam" ? "fg.pink" : "fg.subtle"}>امتحان {lesson?.arr?.[parts - 1]?.type === "quiz" && "(مطبق)"}</Text>
                        <Icon as={MdQuiz} boxSize={5} color={activeSection == "exam" ? "fg.pink" : "fg.subtle"} />
                      </HStack>
                    </HStack>
                  </AccordionItemTrigger>
                  <AccordionItemContent px={6} pb={6}>
                    <Quiz
                    lesson={lesson}
                    path={path}
                    currentPart={currentPart}
                    teacherId={teacherProfile?.id}
                    partIndex={parts}
                  />

                  </AccordionItemContent>
                </AccordionItem>
              </Box>
            )}

          </VStack>
        </AccordionRoot>
      </Container>
    </Box>
  );
}
