
"use client"
import { useState, useEffect } from "react"
import {
  Box, Flex, Text, VStack, HStack, Icon,
  Input, Button, Grid, GridItem, SimpleGrid, Badge, Spinner
} from "@chakra-ui/react"
import {
  MdClass, MdLayers, MdSchool,
  MdQrCodeScanner, MdHighlightOff, MdDeleteOutline,
  MdNotificationsNone, MdSearch, MdPeopleAlt, MdAdd
} from "react-icons/md"
import { useTeacher } from "@/providers/teacherProvider"
import { useAuth } from "@/providers/AuthContext"
import { rtdb } from "@/auth/firebase"
import { ref, push, set, onValue, remove, update, get } from "firebase/database"
import { toaster, Toaster } from "@/components/ui/toaster"
// Note: You must run 'npm install html5-qrcode' for scanning to work
import { Html5QrcodeScanner } from "html5-qrcode"

const teachingStages = [
  { value: "primary", label: "الابتدائي" },
  { value: "preparatory", label: "الإعدادي" },
  { value: "secondary", label: "الثانوي" },
]

const stageGrades = {
  primary: ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"],
  preparatory: ["الأول", "الثاني", "الثالث"],
  secondary: ["الأول", "الثاني", "الثالث"],
}

export default function LessonManager() {
  const { user } = useAuth()
  const { teacherProfile } = useTeacher()
  const [view, setView] = useState("form")
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [type, setType] = useState("حصة")
  const [stage, setStage] = useState("")
  const [grade, setGrade] = useState("")
  const [title, setTitle] = useState("")
  
  // Current Session State
  const [currentSession, setCurrentSession] = useState(null)
  const [studentCount, setStudentCount] = useState(0)
  const [attendanceList, setAttendanceList] = useState([])
  const [isScanning, setIsScanning] = useState(false)

  // Listen for attendance updates
  useEffect(() => {
    if (currentSession && user) {
      const attendanceRef = ref(rtdb, `teachers/${user.uid}/sessions/${currentSession.id}/attendance`);
      const unsubscribe = onValue(attendanceRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
          setAttendanceList(list.sort((a, b) => b.attendedAt - a.attendedAt));
          setStudentCount(list.length);
        } else {
          setAttendanceList([]);
          setStudentCount(0);
        }
      });
      return () => unsubscribe();
    }
  }, [currentSession, user]);

  // QR Scanner Implementation
  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      // Use a timeout to ensure the element exists in DOM
      const timer = setTimeout(() => {
        scanner = new Html5QrcodeScanner("reader", {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        }, false);

        scanner.render(onScanSuccess, onScanFailure);
      }, 100);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        }
      };
    }
  }, [isScanning]);

  const onScanSuccess = (decodedText) => {
    handleScan(decodedText);
    setIsScanning(false); // Close scanner after success
  };

  const onScanFailure = (error) => {
    // Silently ignore or handle occasional scan failures
  };

  const handleScan = async (scannedUid) => {
    if (!scannedUid || !user || !currentSession) return;

    // Search in subscriptions
    let student = teacherProfile?.subscriptions?.payed?.[scannedUid];
    let status = "payed";

    if (!student) {
      student = teacherProfile?.subscriptions?.notPayed?.[scannedUid];
      status = "notPayed";
    }

    if (student) {
      try {
        const attendancePath = `teachers/${user.uid}/sessions/${currentSession.id}/attendance/${scannedUid}`;
        const alreadyRef = ref(rtdb, attendancePath);
        const snap = await get(alreadyRef);
        
        if (snap.exists()) {
          toaster.create({ title: "تنبيه", description: "الطالب مسجل حضور بالفعل", type: "warning" });
          return;
        }

        await set(alreadyRef, {
          name: student.name || "مجهول",
          phone: student.phone || "—",
          attendedAt: Date.now(),
          paymentStatus: status
        });

        toaster.create({
          title: "تم تسجيل الحضور",
          description: `الطالب: ${student.name} (${status === "payed" ? "مدفوع" : "غير مدفوع"})`,
          type: status === "payed" ? "success" : "warning"
        });
      } catch (err) {
        console.error(err);
        toaster.create({ title: "خطأ", description: "فشل تسجيل الحضور", type: "error" });
      }
    } else {
      toaster.create({ title: "خطأ", description: "الطالب غير مسجل في أي من قوائمك", type: "error" });
    }
  };

  // Set initial stage if teacherProfile is available
  useEffect(() => {
    if (teacherProfile?.stages?.length > 0 && !stage) {
      setStage(teacherProfile.stages[0])
    }
  }, [teacherProfile, stage])

  // Reset grade when stage changes
  useEffect(() => {
    if (stage) {
      setGrade(stageGrades[stage]?.[0] || "")
    }
  }, [stage])

  const SelectionButton = ({ label, value, currentValue, setter }) => (
    <Button
      variant={currentValue === value ? "solid" : "outline"}
      colorPalette="blue"
      bg={currentValue === value ? "fg.blue" : "transparent"}
      color={currentValue === value ? "white" : "fg"}
      borderColor={currentValue === value ? "fg.blue" : "border.subtle"}
      onClick={() => setter(value)}
      borderRadius="xl"
      px={{ base: 4, md: 6 }}
      size="sm"
      fontWeight="bold"
      transition="all 0.2s"
      flex={{ base: "1", md: "initial" }}
      _hover={{ transform: "translateY(-1px)", bg: currentValue === value ? "blue.emphasized" : "bg.subtle" }}
    >
      {label}
    </Button>
  )

  const handleCreateSession = async () => {
    if (!title) {
      toaster.create({ title: "خطأ", description: "يرجى كتابة عنوان الدرس", type: "error" })
      return
    }
    if (!user) return

    setLoading(true)
    try {
      const sessionsRef = ref(rtdb, `teachers/${user.uid}/sessions`)
      const newSessionRef = push(sessionsRef)
      const sessionData = {
        id: newSessionRef.key,
        type,
        stage,
        grade,
        title,
        status: "active",
        createdAt: Date.now(),
        studentCount: 0
      }
      await set(newSessionRef, sessionData)
      setCurrentSession(sessionData)
      setView("details")
      toaster.create({ title: "تم", description: "تم بدء الحصة بنجاح", type: "success" })
    } catch (err) {
      console.error(err)
      toaster.create({ title: "خطأ", description: "فشل في بدء الحصة", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async () => {
    if (!currentSession || !user) return
    try {
      await remove(ref(rtdb, `teachers/${user.uid}/sessions/${currentSession.id}`))
      setView("form")
      setCurrentSession(null)
      setTitle("")
      toaster.create({ title: "تم", description: "تم حذف الحصة", type: "info" })
    } catch (err) {
      console.error(err)
    }
  }

  const handleCloseSession = async () => {
    if (!currentSession || !user) return
    try {
      await update(ref(rtdb, `teachers/${user.uid}/sessions/${currentSession.id}`), { status: "closed" })
      setView("form")
      setCurrentSession(null)
      setTitle("")
      toaster.create({ title: "تم", description: "تم إغلاق الحصة بنجاح", type: "success" })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
    <Box 
      p={{ base: 4, md: 6 }} 
      bg="bg.canvas" 
      minH="100vh" 
      dir="rtl"
    >
      <Flex mb={6} gap={4} align="center">
        <Box flex="1" position="relative">
          <Input 
            placeholder="البحث عن حصص سابقة..." 
            bg="bg.panel" 
            borderRadius="xl" 
            border="1px solid" 
            borderColor="border.subtle" 
            pr="40px" 
            _focus={{ borderColor: "fg.blue", boxShadow: "0 0 0 1px var(--chakra-colors-fg-blue)" }}
          />
          <Icon as={MdSearch} position="absolute" right="3" top="50%" transform="translateY(-50%)" color="fg.muted" />
        </Box>
        <Button bg="bg.panel" p={2} borderRadius="xl" shadow="sm" border="1px solid" borderColor="border.subtle">
          <Icon as={MdNotificationsNone} fontSize="xl" color="fg" />
        </Button>
      </Flex>

      <Box bg="bg.panel" p={{ base: 4, md: 8 }} borderRadius="2xl" shadow="md" border="1px solid" borderColor="border.subtle">
        
        {view === "form" ? (
          <VStack align="stretch" gap={8}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 8, md: 10 }}>
              <GridItem>
                <HStack mb={4} gap={2}>
                  <Icon as={MdClass} color="fg.blue" />
                  <Text fontWeight="bold" color="fg">نوع المحتوى</Text>
                </HStack>
                <HStack gap={3}>
                  <SelectionButton label="حصة" value="حصة" currentValue={type} setter={setType} />
                  <SelectionButton label="امتحان" value="امتحان" currentValue={type} setter={setType} />
                </HStack>
              </GridItem>

              <GridItem 
                borderRight={{ base: "none", md: "1px solid" }} 
                borderColor="border.subtle"
                pr={{ base: 0, md: 10 }}
                borderTop={{ base: "1px solid", md: "none" }}
                pt={{ base: 8, md: 0 }}
              >
                <HStack mb={4} gap={2}>
                  <Icon as={MdLayers} color="fg.blue" />
                  <Text fontWeight="bold" color="fg">المرحلة التعليمية</Text>
                </HStack>
                <Flex gap={3} wrap="wrap">
                  {teacherProfile?.stages?.map(s => {
                    const stg = teachingStages.find(ts => ts.value === s);
                    return (
                      <SelectionButton 
                        key={s} 
                        label={stg?.label || s} 
                        value={s} 
                        currentValue={stage} 
                        setter={setStage} 
                      />
                    );
                  })}
                </Flex>
              </GridItem>
            </Grid>

            <Box>
              <HStack mb={4} gap={2}>
                <Icon as={MdSchool} color="fg.blue" />
                <Text fontWeight="bold" color="fg">الصف الدراسي</Text>
              </HStack>
              <Flex wrap="wrap" gap={3}>
                {stage && stageGrades[stage]?.map((item) => (
                  <SelectionButton key={item} label={item} value={item} currentValue={grade} setter={setGrade} />
                ))}
              </Flex>
            </Box>

            <Box>
              <Text fontSize="sm" color="fg.muted" mb={2} fontWeight="bold">عنوان الموضوع / الدرس</Text>
              <Input 
                placeholder="مثال: مراجعة الوحدة الأولى - تاريخ" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                p={6} 
                borderRadius="xl" 
                bg="bg.subtle"
                border="1px solid"
                borderColor="border.subtle"
                _focus={{ borderColor: "fg.blue" }}
              />
            </Box>

            <Button 
              alignSelf={{ base: "stretch", md: "flex-end" }} 
              bg="fg.blue" 
              color="white" 
              px={12} 
              py={7} 
              borderRadius="xl" 
              fontSize="md"
              fontWeight="black"
              loading={loading}
              onClick={handleCreateSession}
              _hover={{ transform: "scale(1.02)", bg: "blue.emphasized" }}
              shadow="md"
            >
              ابدأ الآن
              <Icon as={MdAdd} mr={2} />
            </Button>
          </VStack>

        ) : (
          <VStack align="stretch" gap={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} p={6} borderRadius="2xl" bg="bg.subtle" border="1px solid" borderColor="border.subtle">
              <HStack gap={4}>
                <Text fontWeight="bold" color="fg.muted">النوع :</Text>
                <Badge size="lg" colorPalette="blue" borderRadius="md" px={3}>{type}</Badge> 
              </HStack>
              <HStack gap={4}>
                <Text fontWeight="bold" color="fg.muted">العنوان :</Text>
                <Text fontWeight="black" fontSize="lg">{title}</Text> 
              </HStack>
              <HStack gap={4}>
                <Icon as={MdLayers} color="fg.blue" />
                <Text fontWeight="bold" color="fg.muted">المرحلة :</Text>
                <Text fontWeight="bold">{teachingStages.find(ts => ts.value === stage)?.label || stage}</Text>
              </HStack>
              <HStack gap={4}>
                <Icon as={MdSchool} color="fg.blue" />
                <Text fontWeight="bold" color="fg.muted">الصف :</Text>
                <Text fontWeight="bold">{grade}</Text>
              </HStack>
            </SimpleGrid>

            <HStack gap={4} p={6} bg="blue.subtle" borderRadius="2xl" border="1px solid" borderColor="blue.emphasized">
              <Icon as={MdPeopleAlt} boxSize={6} color="fg.blue" />
              <VStack align="flex-start" gap={0}>
                <Text fontSize="xs" fontWeight="bold" color="fg.muted">عدد الطلاب الحاضرين</Text>
                <Text fontWeight="black" fontSize="xl" color="fg.blue">{studentCount} طالب</Text>
              </VStack>
            </HStack>

            <Box mt={6}>
              <Text fontWeight="bold" color="fg.muted" mb={4}>أحدث المسجلين حضوراً:</Text>
              <VStack align="stretch" gap={3}>
                {attendanceList.length > 0 ? attendanceList.slice(0, 5).map((att) => (
                  <HStack key={att.id} p={3} bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border.subtle" justify="space-between" shadow="sm">
                    <HStack gap={3}>
                      <Icon as={MdCheckCircle} color={att.paymentStatus === "payed" ? "green.fg" : "orange.fg"} />
                      <VStack align="flex-start" gap={0}>
                        <Text fontWeight="bold" fontSize="sm">{att.name}</Text>
                        <Text fontSize="10px" color="fg.muted">{new Date(att.attendedAt).toLocaleTimeString("ar-EG")}</Text>
                      </VStack>
                    </HStack>
                    <Badge colorPalette={att.paymentStatus === "payed" ? "green" : "orange"} variant="subtle">
                      {att.paymentStatus === "payed" ? "مدفوع" : "معلق"}
                    </Badge>
                  </HStack>
                )) : (
                  <Text textAlign="center" py={4} color="fg.subtle" fontSize="sm">لم يحضر أحد بعد</Text>
                )}
              </VStack>
            </Box>

            <Flex direction={{ base: "column", lg: "row" }} gap={6} justify="space-between">
              <Flex gap={4} direction={{ base: "column", sm: "row" }} flex="1">
                <Button flex="1" variant="surface" colorPalette="red" py={7} borderRadius="2xl" onClick={handleDeleteSession}>
                  <Icon as={MdDeleteOutline} ml={2} />
                  حذف الحصة
                </Button>
                <Button flex="1" bg="fg" color="bg" py={7} borderRadius="2xl" onClick={handleCloseSession}>
                  <Icon as={MdHighlightOff} ml={2} />
                  إغلاق الحصة
                </Button>
              </Flex>
              <Button bg="fg.blue" color="white" py={8} px={10} borderRadius="2xl" shadow="md" fontSize="xl" fontWeight="black"
                onClick={() => setIsScanning(true)}
                _hover={{ transform: "scale(1.02)", bg: "blue.emphasized" }}>
                Scan QR Code
                <Icon as={MdQrCodeScanner} mr={3} fontSize="2xl" />
              </Button>
            </Flex>
          </VStack>
        )}
      </Box>

      {/* Scanner Modal Overlay */}
      {isScanning && (
        <Box 
          position="fixed" top="0" left="0" w="100vw" h="100vh" 
          bg="blackAlpha.800" zIndex="9999" display="flex" 
          alignItems="center" justifyContent="center" p={4}
        >
          <VStack bg="bg.panel" p={6} borderRadius="3xl" w="full" maxW="500px" gap={6} shadow="2xl">
            <HStack w="full" justify="space-between">
              <Text fontWeight="black" fontSize="xl">اسكان كيو ار الطالب</Text>
              <Button variant="ghost" onClick={() => setIsScanning(false)}>
                <MdHighlightOff size={24} />
              </Button>
            </HStack>
            
            <Box id="reader" w="full" borderRadius="2xl" overflow="hidden" border="2px solid" borderColor="fg.blue" bg="black" />
            
            <Text fontSize="sm" color="fg.muted" textAlign="center">
              ضع الكود الخاص بالطالب أمام الكاميرا لتسجيل حضوره تلقائياً
            </Text>
            
            <Button w="full" variant="outline" py={6} borderRadius="xl" onClick={() => setIsScanning(false)}>
              إلغاء
            </Button>
          </VStack>
        </Box>
      )}

      <Toaster />
    </Box>
    </>
  )
}