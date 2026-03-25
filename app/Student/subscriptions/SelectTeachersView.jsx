"use client"
import {useState, useEffect, useMemo} from "react";
import {
  Box, VStack, HStack, Text, Flex, Button, Input,
  Heading, Badge, Avatar, SimpleGrid, Icon, Spinner,
  Alert, AlertIcon, AlertTitle, AlertDescription
} from "@chakra-ui/react";
import {MdSearch, MdPersonAdd, MdPersonRemove, MdCheckCircle, MdInfo} from "react-icons/md";
import {rtdb} from "@/auth/firebase";
import {ref, get, update} from "firebase/database";
import {useAuth} from "@/providers/AuthContext";
import {useStudent} from "@/providers/studentProvider";

const subjectLabels = {
  arabic: "اللغة العربية",
  english: "اللغة الإنجليزية",
  math: "الرياضيات",
  physics: "الفيزياء",
  chemistry: "الكيمياء",
  biology: "الأحياء",
  geography: "الجغرافيا",
  history: "التاريخ",
  philosophy: "الفلسفة",
  psychology: "علم النفس",
  economics: "الاقتصاد",
  french: "اللغة الفرنسية",
  german: "اللغة الألمانية",
  italian: "اللاتينية",
  spanish: "الإسبانية",
  science: "العلوم",
  social: "الدراسات الاجتماعية",
  religion: "التربية الدينية",
  art: "التربية الفنية",
  music: "التربية الموسيقية",
  sports: "التربية البدنية",
  technology: "التكنولوجيا",
  computers: "الحاسب الآلي",
};

export default function SelectTeachersView({activeSub, plan, showToast}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState(null); // ID of teacher being updated
  const {user} = useAuth()
  console.log(user, "user")
  const {teachers} = useStudent()
  // The limit comes from the plan (default to 1 if not specified)
  const limit = plan?.teacherLimit || 1;

  // Selected teachers are stored under the subscription itself or a central path
  // We'll use activeSub.selectedTeachers (an object/map of IDs)
  const selectedTeachers = activeSub?.selectedTeachers || {};
  const selectedCount = Object.keys(selectedTeachers).length;
  console.log(teachers, "sss")
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter(t =>
      t.fullName.toLowerCase().includes(q) ||
      t.subjectId.toLowerCase().includes(q)
    );
  }, [teachers, searchQuery]);

  const handleToggleTeacher = async (teacher) => {
    const isSelected = !!selectedTeachers[teacher.id];

    if (!isSelected && selectedCount >= limit) {
      showToast(`لقد استنفدت الحد الأقصى للمدرسين المسموح به (${limit})`, "error");
      return;
    }

    setUpdating(teacher.id);
    try {
      // Path: users/{uid}/subscriptions/{subKey}/selectedTeachers/{teacherId}
      const subKey = activeSub.key;
      const newSelection = {...selectedTeachers};

      if (isSelected) {
        delete newSelection[teacher.id];
      } else {
        newSelection[teacher.id] = {
          id: teacher.id,
          fullName: teacher.fullName || "مدرس",
          subjectId: teacher.subjectId || "—",
          avatar: teacher.avatar || null,
          addedAt: new Date().toISOString()
        };
      }

      await update(ref(rtdb, `users/${user.uid}/subscriptions/${subKey}`), {
        selectedTeachers: newSelection
      });
      if (!isSelected) {
        await update(ref(rtdb, `teachers/${teacher.id}/sub`), {
            [user.uid]: new Date().toISOString()
        });
      }

      showToast(isSelected ? "تمت إزالة المدرس" : "تمت إضافة المدرس بنجاح");
    } catch (e) {
      console.error(e);
      showToast("حدث خطأ، يرجى المحاولة مرة أخرى", "error");
    } finally {
      setUpdating(null);
    }
  };


  return (
    <VStack gap={8} align="stretch" w="100%" animation="fadeIn 0.5s ease-in-out">
      {/* Package Info Banner */}
      <Box
        bg="linear-gradient(135deg, #00A3E0 0%, #0088C0 100%)"
        p={6}
        borderRadius="3xl"
        color="white"
        boxShadow="xl"
      >
        <VStack align="flex-start" gap={1}>
          <HStack justify="space-between" w="100%">
            <Heading size="lg">باقة {plan?.name || activeSub.planName}</Heading>
            <Badge bg="whiteAlpha.400" color="white" px={4} py={1} borderRadius="full" fontSize="md">
              نشط ✅
            </Badge>
          </HStack>
          <Text fontSize="md" opacity={0.9}>
            يمكنك اختيار حتى **{limit}** مدرسين لمتابعة دروسهم.
          </Text>
          <Flex justify="space-between" w="100%" mt={4} align="center">
            <HStack gap={3}>
              <Box w="60px" h="10px" bg="whiteAlpha.300" borderRadius="full" overflow="hidden">
                <Box
                  w={`${(selectedCount / limit) * 100}%`}
                  h="100%"
                  bg="white"
                  transition="width 0.3s"
                />
              </Box>
              <Text fontWeight="bold" fontSize="lg">
                {selectedCount} / {limit}
              </Text>
            </HStack>
            <Text fontSize="sm">المدرسين المختارين</Text>
          </Flex>
        </VStack>
      </Box>

      {/* Search */}
      <Flex
        bg="bg.panel"
        borderRadius="2xl"
        px={6}
        py={2}
        align="center"
        gap={3}
        boxShadow="sm"
        border="2px solid"
        borderColor="border.subtle"
      >
        <MdSearch size={24} color="gray" />
        <Input
          placeholder="ابحث عن مدرس لإضافته..."
          variant="unstyled"
          textAlign="right"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Flex>

      {/* Chosen Teachers Section (Only if any) */}
      {selectedCount > 0 && (
        <VStack align="stretch" gap={4}>
          <Heading size="md">المدرسون المختارون</Heading>
          <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
            {Object.values(selectedTeachers).map((t) => (
              <Flex
                key={t.id}
                bg="bg.panel"
                p={4}
                borderRadius="2xl"
                border="2px solid"
                borderColor="fg.blue"
                shadow="md"
                align="center"
                justify="space-between"
              >
                <HStack gap={4}>
                  <Box
                    w="50px"
                    h="50px"
                    borderRadius="full"
                    overflow="hidden"
                    border="2px solid"
                    borderColor="fg.blue"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.fullName} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                    ) : (
                      <Text fontWeight="bold" color="fg.blue">{t.fullName?.charAt(0) || "م"}</Text>
                    )}
                  </Box>
                  <VStack align="flex-start" gap={0}>
                    <Text fontWeight="bold">م/ {t?.fullName}</Text>
                    <Text fontSize="sm" color="fg.muted">{subjectLabels[t?.subjectId] || t?.subjectId}</Text>
                  </VStack>
                </HStack>
                <Button
                  size="sm"
                  variant="ghost"
                  color="fg.pink"
                  leftIcon={<MdPersonRemove />}
                  isLoading={updating === t.id}
                  onClick={() => handleToggleTeacher(t)}
                >
                  إزالة
                </Button>
              </Flex>
            ))}
          </SimpleGrid>
        </VStack>
      )}

      {/* Available Teachers Section */}
      <VStack align="stretch" gap={4}>
        <HStack justify="space-between">
          <Heading size="md">قائمة المدرسين</Heading>
          <Text fontSize="sm" color="fg.muted">{filtered.length} مدرس متاح</Text>
        </HStack>

        <SimpleGrid columns={{base: 1, sm: 2, lg: 3}} gap={6}>
          {filtered.map((t) => {
            const isSelected = !!selectedTeachers[t.id];
            return (
              <Box
                key={t.id}
                bg="bg.panel"
                p={5}
                borderRadius="3xl"
                border="1px solid"
                borderColor={isSelected ? "fg.blue" : "border.DEFAULT"}
                display="flex"
                flexDirection="column"
                align="center"
                gap={4}
                transition="all 0.3s"
                _hover={{transform: "translateY(-5px)", shadow: "lg"}}
                position="relative"
              >
                {isSelected && (
                  <Box position="absolute" top={3} right={3} color="fg.blue">
                    <MdCheckCircle size={24} />
                  </Box>
                )}
                <Box
                    w="100px"
                    h="100px"
                    borderRadius="full"
                    overflow="hidden"
                    border="4px solid"
                    borderColor="fg.blue"
                    boxShadow="sm"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.fullName} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                    ) : (
                      <Text fontSize="2xl" fontWeight="bold" color="fg.blue">{t.fullName?.charAt(0) || "م"}</Text>
                    )}
                </Box>
                <VStack gap={0}>
                  <Text fontWeight="bold" fontSize="lg">م/ {t?.fullName || ""}</Text>
                  <Text fontSize="sm" color="fg.muted">{subjectLabels[t?.subjectId] || t?.subjectId || ""}</Text>
                </VStack>
                <Button
                  w="100%"
                  borderRadius="xl"
                  colorScheme={isSelected ? "gray" : "blue"}
                  variant={isSelected ? "ghost" : "solid"}
                  leftIcon={isSelected ? <MdPersonRemove /> : <MdPersonAdd />}
                  isLoading={updating === t.id}
                  onClick={() => handleToggleTeacher(t)}
                  bg={isSelected ? "bg.subtle" : "linear-gradient(135deg, #00A3E0, #0088C0)"}
                  color={isSelected ? "fg.pink" : "white"}
                >
                  {isSelected ? "إزالة المدرس" : "إضافة المدرس"}
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>
      </VStack>

      {/* Empty State */}
      {filtered.length === 0 && (
        <VStack py={10} color="fg.muted">
          <MdInfo size={40} />
          <Text>لا يوجد نتائج لعملية البحث</Text>
        </VStack>
      )}
    </VStack>
  );
}
