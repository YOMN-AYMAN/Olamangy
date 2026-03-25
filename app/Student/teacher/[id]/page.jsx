"use client"

import {useState, useEffect} from "react";
import {Box, Container, Text, Flex, Badge, Button, VStack, HStack, Heading, Spinner, Center, Image, Input, Icon} from "@chakra-ui/react";
import {useColorModeValue} from "@/components/ui/color-mode";
import Link from "next/link";
import {useParams} from "next/navigation";
import {MdArrowCircleRight, MdOutlinePlayLesson, MdCheckCircle} from "react-icons/md";
import {onValue, ref, get, update} from "firebase/database";
import {rtdb} from "@/auth/firebase";
import {useAuth} from "@/providers/AuthContext";
import {toaster} from "@/components/ui/toaster";

const LessonCard = ({lesson, teacherId}) => {
  const cardBg = useColorModeValue("white", "#1A202C");
  const textColor = useColorModeValue("gray.800", "white");
  const descColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Link
      href={`/Student/teacher/${teacherId}/lesson/${lesson.id}`}
      style={{textDecoration: 'none', display: 'block'}}
    >
      <Box
        bg={cardBg}
        p={5}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow={useColorModeValue("0 2px 4px rgba(0,0,0,0.1)", "0 2px 4px rgba(0,0,0,0.3)")}
        _hover={{shadow: useColorModeValue("0 6px 8px rgba(255, 90, 126, 0.24)", "0 6px 8px rgba(255, 90, 126, 0.15)"), transform: "translateY(-2px)"}}
        transition="all 0.2s"
        cursor="pointer"
      >
        <Flex align="center" gap={4} flexWrap={{base: "wrap", md: "nowrap"}}>
          {/* Thumbnail */}
          <Box 
            w={{base: "100%", md: "180px"}} 
            h="120px" 
            borderRadius="xl" 
            overflow="hidden"
            flexShrink={0}
            bg="gray.100"
            position="relative"
          >
            <Image 
              src={lesson?.pages?.[0]?.thumbnailUrl || lesson.thumbnailUrl || "https://img.youtube.com/vi/placeholder/maxresdefault.jpg"} 
              alt={lesson.title}
              w="100%"
              h="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/180x120?text=بدون+صورة"
            />
            <Box 
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="rgba(0,0,0,0.5)"
              borderRadius="full"
              p={2}
            >
              <MdOutlinePlayLesson size={24} color="white" />
            </Box>
          </Box>

          <Flex direction="column" flex="1" gap={2} mx={{base: 0, md: 5}}>
            <Flex align="center" justify="flex-start" flexWrap="wrap" gap={2}>
              <Text fontWeight="bold" fontSize={{base: "md", md: "lg"}} color={textColor}>
                {lesson.title}
              </Text>
              {lesson.isFree && (
                <Badge
                  bg="#FF5A7E"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  حصة مجانية
                </Badge>
              )}
            </Flex>
            <Text fontSize={{base: "xs", md: "sm"}} color={descColor} noOfLines={2}>
              {lesson.description || "لا يوجد وصف لهذا الدرس"}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

export default function TeacherDetailPage() {
  const params = useParams();
  const teacherId = params?.id;
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [subCode, setSubCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubscribed = user?.subscriptions ? Object.keys(user.subscriptions).includes(teacherId) : false;

  const handleSubscribe = async () => {
    if (!subCode.trim()) {
      toaster.create({
        title: "تنبيه",
        description: "الرجاء إدخال كود المدرس أولاً",
        type: "warning"
      });
      return;
    }

    if (teacher?.code && subCode.trim() !== teacher.code) {
      toaster.create({
        title: "خطأ",
        description: "الكود المدخل غير صحيح، تأكد من الكود وأعد المحاولة",
        type: "error"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updates = {};
      updates[`users/${user.uid}/subscriptions/${teacherId}`] = {
        subscribedAt: new Date().toISOString(),
        teacherName: teacher.fullName || teacher.name || "مدرس",
        type: "center"
      };

      await update(ref(rtdb), updates);

      toaster.create({
        title: "نجاح",
        description: "تم تفعيل الاشتراك بنجاح!",
        type: "success"
      });
      
      setSubCode("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toaster.create({
        title: "خطأ",
        description: "حدث خطأ أثناء تفعيل الاشتراك، الرجاء المحاولة لاحقاً",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!params.id) return;
    
    // Fetch teacher profile
    const teacherPathRef = ref(rtdb, `teachers/${params.id}`);
    const unsubscribeTeacher = onValue(teacherPathRef, (snapshot) => {
      if (snapshot.exists()) {
        setTeacher(snapshot.val());
      }
    });

    // Fetch teacher's lessons
    const arrLessonsRef = ref(rtdb, `teachers/${params.id}/arrLessons`);
    const unsubscribeLessons = onValue(arrLessonsRef, async (snapshot) => {
      setLoading(true);
      if (snapshot.exists()) {
        const arr = snapshot.val();
        
        // arr is a map of { lessonId: academicKey }
        const promises = Object.entries(arr).map(async ([lessonId, academicKey]) => {
          const lessonRef = ref(rtdb, `teachers/${params.id}/lessons/${academicKey}/${lessonId}`);
          const lessonSnap = await get(lessonRef);
          if (lessonSnap.exists()) {
            return { id: lessonId, ...lessonSnap.val() };
          }
          return null;
        });

        const results = await Promise.all(promises);
        setLessons(results.filter(Boolean));
      } else {
        setLessons([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeTeacher();
      unsubscribeLessons();
    };
  }, [params.id]);


  if (!teacher) {
    return (
      <Container maxW="container.md" py={20} dir="rtl">
        <VStack gap={4}>
          <Text fontSize="xl" color="gray.500">
            المدرس غير موجود
          </Text>
          <Link href="/Student/teacher">
            <Button bg="#00A3E0" color="white" _hover={{bg: "#0088C0"}}>
              العودة إلى قائمة المدرسين
            </Button>
          </Link>
        </VStack>
      </Container>
    );
  }

  const pageBg = useColorModeValue("#FAFAFA", "#0F172A");
  const headerTextColor = useColorModeValue("gray.800", "white");
  const buttonBg = useColorModeValue("white", "#2D3748");
  const buttonHoverBg = useColorModeValue("gray.100", "#374151");
  const buttonBorderColor = useColorModeValue("gray.300", "#4B5563");
  const arrowBg = useColorModeValue("black", "#2D3748");

  if (loading && !teacher) {
    return (
      <Center minH="100vh" bg={pageBg}>
        <Spinner size="xl" color="#00BCD4" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box bg={pageBg} minH="100vh" dir="rtl">
      <Box py={6} px={{base: 2, sm: 4, md: 8}}>
        <Container maxW="container.xl">
          <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
            <Flex align="center" gap={3} flexWrap="wrap">
              <Link href="/Student/teacher">
                <MdArrowCircleRight size={35} color={useColorModeValue("black", "white")} style={{cursor: 'pointer'}} />
              </Link>
              <VStack align="flex-start" gap={0}>
                <Text fontWeight="bold" fontSize={{base: "sm", sm: "md", md: "xl"}} color={headerTextColor}>
                 م/{teacher?.fullName || teacher?.name || 'مدرس'}
                </Text>
              </VStack>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8} px={{base: 2, sm: 4, md: 8}}>
        {isSubscribed ? (
          <Box mb={6}>
            <Flex align="center" gap={4} mb={6}>
              <MdOutlinePlayLesson size={24} color="#00BCD4" />
              <Heading
                size={{base: "xl", md: "2xl"}}
                color="#00BCD4"
                fontWeight="bold"
              >
                جميع الحصص المتاحة
              </Heading>
            </Flex>

            {loading && lessons.length === 0 ? (
              <Center py={10}>
                <Spinner size="lg" color="#00BCD4" />
              </Center>
            ) : lessons.length > 0 ? (
              <VStack gap={4} align="stretch">
                {lessons.map(lesson => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    teacherId={teacherId} 
                  />
                ))}
              </VStack>
            ) : (
              <Center py={10} bg={useColorModeValue("white", "gray.800")} borderRadius="xl" borderWidth="1px">
                <VStack gap={3}>
                  <Text color="gray.500" fontSize="lg">لا توجد حصص متاحة في الوقت الحالي</Text>
                </VStack>
              </Center>
            )}
          </Box>
        ) : (
          <Box bg={useColorModeValue("white", "#1A202C")} p={{base: 5, md: 10}} borderRadius="3xl" shadow="xl" border="1px solid" borderColor={buttonBorderColor}>
            <Flex direction={{base: "column", lg: "row"}} gap={10} align="center">
              
              {/* Promo Context / Video */}
              <Box flex="1" w="100%">
                <Box borderRadius="2xl" overflow="hidden" shadow="lg" aspectRatio={16/9} bg="gray.800" position="relative">
                  {teacher.promoVideoUrl ? (
                    <iframe
                      src={`https://iframe.mediadelivery.net/embed/595363/${teacher.promoVideoUrl}?autoplay=false&loop=false&muted=false&preload=true`}
                      title="فيديو تعريفي"
                      style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                      }}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <Center w="100%" h="100%" flexDirection="column" gap={4} bg="gray.100" color="gray.500">
                       <MdOutlinePlayLesson size={60} color="#00A3E0" />
                       <Text fontSize="lg" fontWeight="bold">الفيديو التعريفي للمدرس</Text>
                    </Center>
                  )}
                </Box>
              </Box>

              {/* Subscription Form */}
              <VStack flex="1" w="100%" align="stretch" gap={6} p={{base: 0, md: 6}}>
                <VStack align="flex-start" gap={2}>
                  <Heading size="lg" color={headerTextColor}>
                    اشترك الآن مع م/ {teacher?.fullName || teacher?.name}
                  </Heading>
                  <Text color="gray.500" fontSize="md">
                    قم بإدخال كود المدرس الخاص بك لتتمكن من الوصول لجميع الدروس والمحتوى الحصري.
                  </Text>
                </VStack>

                <VStack align="stretch" gap={4} mt={4}>
                  <Box>
                    <Text mb={2} fontWeight="bold" color={headerTextColor}>كود الاشتراك:</Text>
                    <Input 
                      placeholder="أدخل كود المدرس هنا..." 
                      size="lg" 
                      value={subCode}
                      onChange={(e) => setSubCode(e.target.value)}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      border="1px solid"
                      borderColor={buttonBorderColor}
                      borderRadius="xl"
                      _focus={{ borderColor: "#00A3E0", boxShadow: "0 0 0 1px #00A3E0" }}
                      dir="ltr"
                      textAlign="right"
                    />
                  </Box>
                  <Button 
                    bg="#00BCD4" 
                    color="white" 
                    size="lg" 
                    borderRadius="xl" 
                    _hover={{ bg: "#00ACC1", transform: "translateY(-2px)", shadow: "lg" }}
                    transition="all 0.2s"
                    mt={2}
                    leftIcon={<MdCheckCircle size={20} />}
                    onClick={handleSubscribe}
                    loading={isSubmitting}
                  >
                    تفعيل الاشتراك
                  </Button>
                </VStack>

                <Flex align="center" justify="center" gap={2} mt={4}>
                  <Text color="gray.500" fontSize="sm">
                    ليس لديك كود؟
                  </Text>
                  <Link href="/Student/subscriptions">
                    <Text color="#FF5A7E" fontWeight="bold" fontSize="sm" _hover={{textDecoration: "underline"}}>
                      اذهب لشراء باقة
                    </Text>
                  </Link>
                </Flex>
              </VStack>

            </Flex>
          </Box>
        )}
      </Container>
    </Box>
  );
}