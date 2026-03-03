"use client"

import { useState, useMemo, useEffect } from "react";
import { 
    Box, Container, Text, Flex, Button, VStack, Input, Badge, Grid, HStack, Icon, Portal, Spinner
} from "@chakra-ui/react";
import {
    DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent,
    DialogFooter, DialogHeader, DialogRoot, DialogTitle,
} from "../../../components/ui/dialog";
import { useColorModeValue } from "../../../components/ui/color-mode";
import { rtdb } from "@/auth/firebase";
import { ref, get, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { 
    MdSearch, MdArrowBack, MdCheckCircle, MdCancel, MdPeople, MdEmail, MdPhone, MdPerson
} from "react-icons/md";

// ─── Mock examples (kept as requested) ────────────────────────────────────
const registeredStudentsData = [
    { id: "mock_1", name: "سالم علي", phone: "01019569964", email: "filopaterf.m@gamil.com", status: "مدفوع" },
    { id: "mock_2", name: "ليلى خالد", phone: "01019569965", email: "laila.khaled@email.com", status: "مدفوع" },
    { id: "mock_3", name: "عمر حسن", phone: "01019569966", email: "omar.hassan@email.com", status: "غير مدفوع" },
    { id: "mock_4", name: "فاطمة محمود", phone: "01019569967", email: "fatma.mahmoud@email.com", status: "مدفوع" },
    { id: "mock_5", name: "يوسف احمد", phone: "01019569968", email: "youssef.ahmed@email.com", status: "غير مدفوع" }
];
const subscriptionRequestsData = [
    { id: "mock_r1", name: "أحمد سامي", phone: "01019569969", email: "ahmed.sami@email.com", packageType: "عادي", accountStatus: "مفعل" },
    { id: "mock_r2", name: "سارة محمد", phone: "01019569970", email: "sara.mohamed@email.com", packageType: "بريميم", accountStatus: "غير مفعل" },
    { id: "mock_r3", name: "خالد عمر", phone: "01019569971", email: "khaled.omar@email.com", packageType: "عادي", accountStatus: "مفعل" },
    { id: "mock_r4", name: "نورا سعيد", phone: "01019569972", email: "nora.saeed@email.com", packageType: "مميزة", accountStatus: "مفعل" }
];

const GRID_REGISTERED = { base: "2fr 1fr 1fr", md: "1fr 1fr 2fr 1fr 0.8fr" };
const GRID_REQUESTS   = { base: "2fr 1fr 1fr", md: "1fr 1fr 2fr 1fr 1fr" };

// ─── StatusButton ──────────────────────────────────────────────────────────
const StatusButton = ({ status, onToggle }) => {
    const isActive = status === "مفعل" || status === "مدفوع";
    const activeBg      = useColorModeValue("#E3F2FD", "#1E3A8A");
    const inactiveBg    = useColorModeValue("#FFEBEE", "#7a2323");
    const activeHover   = useColorModeValue("#BBDEFB", "#274374");
    const inactiveHover = useColorModeValue("#FFCDD2", "#8B1C1C");
    const activeBorder  = useColorModeValue("#90CAF9", "#3B82F6");
    const inactiveBorder= useColorModeValue("#EF9A9A", "#EF4444");
    return (
        <Button
            size="xs" minW={{ base: "70px", md: "90px" }} fontSize={{ base: "9px", md: "11px" }}
            height={{ base: "24px", md: "28px" }} px={{ base: 2, md: 3 }}
            bg={isActive ? activeBg : inactiveBg} color={isActive ? "#00A3E0" : "#F44336"}
            borderRadius="full" py={0} fontWeight="bold"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            _hover={{ transform: "scale(1.05)", bg: isActive ? activeHover : inactiveHover }}
            _active={{ transform: "scale(0.95)" }} transition="all 0.2s"
            border="1px solid" borderColor={isActive ? activeBorder : inactiveBorder}
            leftIcon={isActive ? <Icon as={MdCheckCircle} boxSize={3} /> : <Icon as={MdCancel} boxSize={3} />}
            iconSpacing={1} justifySelf="center">
            {isActive ? "مفعل" : "غير مفعل"}
        </Button>
    );
};

// ─── TruncatedText ─────────────────────────────────────────────────────────
const TruncatedText = ({ children, fontWeight = "normal", color, textAlign = "center" }) => {
    const def = useColorModeValue("gray.800", "gray.200");
    return (
        <Text fontSize={{ base: "11px", md: "sm" }} fontWeight={fontWeight} color={color || def}
            textAlign={textAlign} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" px={2}>
            {children}
        </Text>
    );
};

// ─── StudentDetailsDialog ──────────────────────────────────────────────────
const StudentDetailsDialog = ({ student, isOpen, onClose, onToggleStatus, onKick, isRequest = false }) => {
    const isActive = isRequest ? student?.accountStatus === "مفعل" : student?.status === "مدفوع";
    const dialogBg = useColorModeValue("white", "gray.800");
    const itemBg   = useColorModeValue("gray.50", "gray.700");
    const labelColor = useColorModeValue("gray.500", "gray.400");
    const iconColor  = useColorModeValue("blue.500", "blue.300");
    const headerGradient = useColorModeValue("linear(to-l, blue.50, white)", "linear(to-l, gray.700, gray.800)");

    return (
        <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="md" placement="center">
            <Portal>
                <DialogContent bg={dialogBg} borderRadius="2xl" m={15} boxShadow="0 25px 60px rgba(0,0,0,0.15)" overflow="hidden">
                    <Box bgGradient={headerGradient} px={2} py={5} mt={6} alignSelf="center">
                        <DialogHeader p={0}>
                            <DialogTitle textAlign="center" fontSize={{ base: "lg", md: "xl" }} fontWeight="bold"
                                color={useColorModeValue("gray.800", "white")}>
                                معلومات الطالب
                            </DialogTitle>
                        </DialogHeader>
                        <DialogCloseTrigger />
                    </Box>

                    <DialogBody px={6} py={6}>
                        {student && (
                            <VStack spacing={5} align="stretch" dir="rtl">
                                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                                    <Flex align="center" gap={4} p={4} m={3} bg={itemBg} borderRadius="xl" flex={1}
                                        boxShadow="sm" _hover={{ transform: "translateY(-3px)", boxShadow: "md" }} transition="all 0.2s">
                                        <Icon as={MdPerson} boxSize={6} color={iconColor} />
                                        <Box flex={1}>
                                            <Text fontSize="xs" color={labelColor} mb={1}>الاسم</Text>
                                            <Text fontSize="md" fontWeight="bold" color={useColorModeValue("gray.800", "white")}>{student.name}</Text>
                                        </Box>
                                    </Flex>
                                    {isRequest && (
                                        <Flex align="center" gap={4} p={4} m={3} bg={itemBg} borderRadius="xl"
                                            minW={{ base: "auto", md: "220px" }} boxShadow="sm"
                                            _hover={{ transform: "translateY(-3px)", boxShadow: "md" }} transition="all 0.2s">
                                            <Icon as={MdPeople} boxSize={6} color={iconColor} />
                                            <Box>
                                                <Text fontSize="xs" color={labelColor} mb={1}>نوع الاشتراك</Text>
                                                <Badge px={4} py={1} borderRadius="full" fontSize="sm" fontWeight="bold"
                                                    bg={student.packageType === "مميزة" ? "purple.100" : "blue.100"}
                                                    color={student.packageType === "مميزة" ? "purple.600" : "blue.600"}>
                                                    {student.packageType}
                                                </Badge>
                                            </Box>
                                        </Flex>
                                    )}
                                </Flex>

                                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                                    <Flex align="center" gap={4} p={4} m={3} bg={itemBg} borderRadius="xl" flex={1}
                                        boxShadow="sm" _hover={{ transform: "translateY(-3px)", boxShadow: "md" }} transition="all 0.2s">
                                        <Icon as={MdPhone} boxSize={5} color={iconColor} />
                                        <Box flex={1}>
                                            <Text fontSize="xs" color={labelColor} mb={1}>رقم الهاتف</Text>
                                            <Text fontSize="md" fontWeight="semibold" dir="ltr" textAlign="right"
                                                color={useColorModeValue("gray.800", "white")}>{student.phone}</Text>
                                        </Box>
                                    </Flex>
                                    <Flex align="center" gap={4} p={4} m={3} bg={itemBg} borderRadius="xl" flex={1}
                                        boxShadow="sm" _hover={{ transform: "translateY(-3px)", boxShadow: "md" }} transition="all 0.2s">
                                        <Icon as={MdEmail} boxSize={5} color={iconColor} />
                                        <Box flex={1}>
                                            <Text fontSize="xs" color={labelColor} mb={1}>البريد الإلكتروني</Text>
                                            <Text fontSize="md" fontWeight="semibold" wordBreak="break-word"
                                                color={useColorModeValue("gray.800", "white")}>{student.email}</Text>
                                        </Box>
                                    </Flex>
                                </Flex>

                                <Box p={5} m={3} borderRadius="xl" border="1px solid"
                                    borderColor={isActive ? "green.200" : "red.200"}>
                                    <Flex align="center" justify="space-between">
                                        <Flex align="center" gap={3}>
                                            <Icon as={isActive ? MdCheckCircle : MdCancel} boxSize={6}
                                                color={isActive ? "green.500" : "red.500"} />
                                            <Box>
                                                <Text fontSize="xs" color={labelColor} mb={1}>الحالة</Text>
                                                <Text fontWeight="bold" fontSize="md"
                                                    color={useColorModeValue("gray.800", "white")}>
                                                    {isActive ? "نشط" : "غير نشط"}
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <StatusButton
                                            status={isRequest ? student.accountStatus : student.status}
                                            onToggle={() => onToggleStatus(student.id)} />
                                    </Flex>
                                </Box>

                                {!isRequest && (
                                    <Button variant="outline" color="#EF4444" borderColor="#EF4444"
                                        borderRadius="full" mx={3} _hover={{ bg: "#FEF2F2" }}
                                        onClick={() => { onKick(student); onClose(); }}
                                        leftIcon={<Icon as={MdArrowBack} />}>
                                        طرد الطالب
                                    </Button>
                                )}
                            </VStack>
                        )}
                    </DialogBody>

                    <DialogFooter px={6} py={4} borderTop="1px solid" borderColor="gray.200"
                        bg={useColorModeValue("gray.50", "gray.900")}>
                        <DialogActionTrigger>
                            <Button bg="blue.500" color="white" borderRadius="full" px={6} _hover={{ bg: "blue.600" }}>
                                إغلاق
                            </Button>
                        </DialogActionTrigger>
                    </DialogFooter>
                </DialogContent>
            </Portal>
        </DialogRoot>
    );
};

// ─── StudentCard ───────────────────────────────────────────────────────────
const StudentCard = ({ student, onToggleStatus, isRequest = false, onRowClick, onKick }) => {
    const borderColor = useColorModeValue("gray.200", "gray.400");
    const hoverBg     = useColorModeValue("gray.100", "gray.700");
    const nameColor   = useColorModeValue("gray.500", "gray.300");
    const phoneColor  = useColorModeValue("gray.700", "gray.400");
    const emailColor  = useColorModeValue("gray.500", "gray.300");

    if (isRequest) {
        const bgLight = student.packageType === "مميزة" ? "#F3E8FF" : student.packageType === "بريميم" ? "#f4ebfc" : "#E0F2FE";
        const bgDark  = student.packageType === "مميزة" ? "#6B21A8" : student.packageType === "بريميم" ? "#FF4466" : "#0284C7";
        const clLight = student.packageType === "مميزة" ? "#9333EA" : student.packageType === "بريميم" ? "#895fb0" : "#0284C7";
        const clDark  = student.packageType === "مميزة" ? "#E9D5FF" : student.packageType === "بريميم" ? "#EDE9FE" : "#ffffff";
        const pkgBg   = useColorModeValue(bgLight, bgDark);
        const pkgColor= useColorModeValue(clLight, clDark);
        return (
            <Grid templateColumns={GRID_REQUESTS} gap={{ base: 2, md: 2 }} px={{ base: 2, md: 4 }}
                py={{ base: 3, md: 3 }} borderBottom="1px solid" borderColor={borderColor}
                _hover={{ bg: hoverBg, cursor: "pointer" }} transition="all 0.2s"
                alignItems="center" w="100%" onClick={() => onRowClick(student)}>
                <TruncatedText fontWeight="bold" color={nameColor}>{student.name}</TruncatedText>
                <Box display={{ base: "none", md: "block" }}>
                    <TruncatedText color={phoneColor} textAlign="center" dir="ltr">{student.phone}</TruncatedText>
                </Box>
                <Box display={{ base: "none", md: "block" }}>
                    <TruncatedText color={emailColor}>{student.email}</TruncatedText>
                </Box>
                <Badge bg={pkgBg} color={pkgColor} px={3} py={1} borderRadius="full"
                    fontSize={{ base: "8px", md: "10px" }} fontWeight="bold" textAlign="center"
                    minW={{ base: "50px", md: "60px" }} justifySelf="center">
                    {student.packageType}
                </Badge>
                <StatusButton status={student.accountStatus} onToggle={() => onToggleStatus(student.id)} />
            </Grid>
        );
    }

    return (
        <Grid templateColumns={GRID_REGISTERED} gap={{ base: 2, md: 2 }} px={{ base: 2, md: 4 }}
            py={3} borderBottom="1px solid" borderColor={borderColor}
            _hover={{ bg: hoverBg, cursor: "pointer" }} transition="all 0.2s"
            alignItems="center" onClick={() => onRowClick(student)}>
            <TruncatedText fontWeight="bold" color={nameColor}>{student.name}</TruncatedText>
            <Box display={{ base: "none", md: "block" }}>
                <TruncatedText color={phoneColor} textAlign="center" dir="ltr">{student.phone}</TruncatedText>
            </Box>
            <Box display={{ base: "none", md: "block" }}>
                <TruncatedText color={emailColor}>{student.email}</TruncatedText>
            </Box>
            <StatusButton status={student.status} onToggle={() => onToggleStatus(student.id)} />
            <Button
                size="xs" minW={{ base: "60px", md: "90px" }} fontSize={{ base: "9px", md: "11px" }}
                height={{ base: "24px", md: "28px" }} px={{ base: 2, md: 3 }}
                variant="outline" color="#EF4444" borderColor="#EF4444" borderRadius="full"
                py={0} fontWeight="bold"
                onClick={(e) => { e.stopPropagation(); onKick(student); }}
                _hover={{ bg: "#FEF2F2", transform: "scale(1.05)", borderColor: "#DC2626" }}
                _active={{ transform: "scale(0.95)" }} transition="all 0.2s"
                leftIcon={<Icon as={MdArrowBack} boxSize={3} />} iconSpacing={1} justifySelf="center">
                طرد
            </Button>
        </Grid>
    );
};

// ─── ColumnHeaders ─────────────────────────────────────────────────────────
const ColumnHeaders = ({ isRequest = false }) => {
    const headers = isRequest
        ? { base: ["الاسم", "نوع الاشتراك", "الحالة"], md: ["الاسم", "رقم الهاتف", "الايميل", "نوع الاشتراك", "الحالة"] }
        : { base: ["الاسم", "الحالة", ""],              md: ["الاسم", "رقم الهاتف", "الايميل", "الحالة", ""] };
    const grid = isRequest ? GRID_REQUESTS : GRID_REGISTERED;
    return (
        <Grid templateColumns={grid} gap={{ base: 5, md: 2 }} px={{ base: 2, md: 4 }} py={2}
            alignItems="center" color={useColorModeValue("#00A3E0", "#6ac8ff")}
            borderBottom="2px solid" borderColor={useColorModeValue("#39393934", "#ffffff22")} mb={2}>
            <Box display={{ base: "contents", md: "none" }}>
                {headers.base.map((t, i) => (
                    <Text key={i} fontSize="9px" fontWeight="bold" color={useColorModeValue("gray.500", "gray.300")}
                        textAlign="center" letterSpacing="wide" px={2}>{t}</Text>
                ))}
            </Box>
            <Box display={{ base: "none", md: "contents" }}>
                {headers.md.map((t, i) => (
                    <Text key={i} fontSize="xs" fontWeight="bold" color={useColorModeValue("gray.500", "gray.300")}
                        textAlign="center" letterSpacing="wide" px={2}>{t}</Text>
                ))}
            </Box>
        </Grid>
    );
};

// ─── SectionHeader ─────────────────────────────────────────────────────────
const SectionHeader = ({ title, count, loading }) => {
    const hdrColor   = useColorModeValue("gray.800", "gray.200");
    const hdrBadgeBg = useColorModeValue("#00A3E0", "#257BA3");
    const iconColor  = useColorModeValue("black", "white");
    return (
        <Flex mb={4} justifyContent="flex-start" alignItems="center" gap={3}>
            <Box p={2} display="flex" alignItems="center" justifyContent="center">
                <MdPeople size={24} color={iconColor} />
                <Text fontWeight="bold" textAlign="right" fontSize={{ base: "sm", md: "lg" }} color={hdrColor} mr={2}>
                    {title}
                </Text>
            </Box>
            <Badge bg={hdrBadgeBg} color="white" px={3} py={1} borderRadius="full" fontWeight="bold"
                minW={{ base: "60px", md: "60px" }} fontSize={{ base: "10px", md: "11px" }}>
                {loading ? "..." : count} {title.includes("طلاب") ? "طلاب" : "طالب"}
            </Badge>
        </Flex>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function StudentsManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    // Table 1: students subscribed to this teacher
    const [registeredStudents, setRegisteredStudents] = useState(registeredStudentsData);
    // Table 2: students subscribed to a general plan
    const [subscriptionRequests, setSubscriptionRequests] = useState(subscriptionRequestsData);
    const [loadingTeacher, setLoadingTeacher] = useState(true);
    const [loadingPlans, setLoadingPlans]     = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDialogOpen, setIsDialogOpen]       = useState(false);
    const [dialogType, setDialogType]           = useState("registered");

    const textColor   = useColorModeValue("gray.800", "gray.200");
    const cardBg      = useColorModeValue("white", "gray.700");
    const searchBg    = useColorModeValue("white", "gray.700");
    const searchBorder= useColorModeValue("#00A3E0", "#00A3E0");

    // ── Load real students from Firebase ──────────────────────────────────
    useEffect(() => {
        const fetchStudents = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser) { setLoadingTeacher(false); setLoadingPlans(false); return; }
            const teacherId = currentUser.uid;

            try {
                const usersSnap = await get(ref(rtdb, "users"));
                if (!usersSnap.exists()) return;
                const usersData = usersSnap.val();

                const teacherStudents = [];
                const planStudents    = [];

                for (const [userId, userData] of Object.entries(usersData)) {
                    if (!userData.subscriptions) continue;
                    const userInfo = {
                        name:  userData.fullName || userData.name  || "مجهول",
                        phone: userData.phone    || "—",
                        email: userData.email    || "—",
                    };
                    for (const [subKey, sub] of Object.entries(userData.subscriptions)) {
                        // Table 1 — subscribed to THIS teacher by their UID
                        if (sub.type === "teacher" && sub.teacherId === teacherId) {
                            teacherStudents.push({
                                id: `${userId}_${subKey}`,
                                userId, subKey, ...userInfo,
                                status: sub.status === "active" ? "مدفوع" : "غير مدفوع",
                                subscribedAt: sub.subscribedAt,
                            });
                        }
                        // Table 2 — subscribed to a general plan
                        else if (sub.type === "general") {
                            planStudents.push({
                                id: `${userId}_${subKey}`,
                                userId, subKey, ...userInfo,
                                packageType:   sub.planName || sub.planId || "—",
                                accountStatus: sub.status === "active" ? "مفعل" : "غير مفعل",
                                subscribedAt:  sub.subscribedAt,
                            });
                        }
                    }
                }

                // Real entries appended after mock examples
                setRegisteredStudents([...registeredStudentsData, ...teacherStudents]);
                setSubscriptionRequests([...subscriptionRequestsData, ...planStudents]);
            } catch (e) {
                console.error("Error fetching students:", e);
            } finally {
                setLoadingTeacher(false);
                setLoadingPlans(false);
            }
        };
        fetchStudents();
    }, []);

    // ── Sort ───────────────────────────────────────────────────────────────
    const sortedRegistered = useMemo(() =>
        [...registeredStudents].sort((a, b) => a.name.localeCompare(b.name, "ar")),
        [registeredStudents]
    );
    const sortedRequests = useMemo(() =>
        [...subscriptionRequests].sort((a, b) => a.name.localeCompare(b.name, "ar")),
        [subscriptionRequests]
    );

    // ── Filter ─────────────────────────────────────────────────────────────
    const filteredRegistered = useMemo(() => {
        if (!searchQuery.trim()) return sortedRegistered;
        const q = searchQuery.toLowerCase();
        return sortedRegistered.filter(s =>
            s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.email.toLowerCase().includes(q)
        );
    }, [sortedRegistered, searchQuery]);

    const filteredRequests = useMemo(() => {
        if (!searchQuery.trim()) return sortedRequests;
        const q = searchQuery.toLowerCase();
        return sortedRequests.filter(s =>
            s.name.toLowerCase().includes(q) || s.phone.includes(q) ||
            s.email.toLowerCase().includes(q) || (s.packageType || "").toLowerCase().includes(q)
        );
    }, [sortedRequests, searchQuery]);

    // ── Toggle status — persists to Firebase for real entries ──────────────
    const handleToggleRegisteredStatus = (id) => {
        setRegisteredStudents(prev => prev.map(s => {
            if (s.id !== id) return s;
            const newStatus = s.status === "مدفوع" ? "غير مدفوع" : "مدفوع";
            const updated   = { ...s, status: newStatus };
            if (selectedStudent?.id === id) setSelectedStudent(updated);
            if (s.userId && s.subKey)
                update(ref(rtdb, `users/${s.userId}/subscriptions/${s.subKey}`),
                    { status: newStatus === "مدفوع" ? "active" : "pending" }).catch(console.error);
            return updated;
        }));
    };

    const handleToggleRequestStatus = (id) => {
        setSubscriptionRequests(prev => prev.map(s => {
            if (s.id !== id) return s;
            const newStatus = s.accountStatus === "مفعل" ? "غير مفعل" : "مفعل";
            const updated   = { ...s, accountStatus: newStatus };
            if (selectedStudent?.id === id) setSelectedStudent(updated);
            if (s.userId && s.subKey)
                update(ref(rtdb, `users/${s.userId}/subscriptions/${s.subKey}`),
                    { status: newStatus === "مفعل" ? "active" : "pending" }).catch(console.error);
            return updated;
        }));
    };

    // ── Kick — deletes from Firebase + removes from local state ───────────
    const handleKick = async (student) => {
        if (student.userId && student.subKey) {
            try { await remove(ref(rtdb, `users/${student.userId}/subscriptions/${student.subKey}`)); }
            catch (e) { console.error("Kick error:", e); }
        }
        setRegisteredStudents(prev => prev.filter(s => s.id !== student.id));
    };

    // ── Row click — opens dialog on mobile only ───────────────────────────
    const handleRowClick = (student, type) => {
        if (window.innerWidth < 768) {
            setSelectedStudent(student);
            setDialogType(type);
            setIsDialogOpen(true);
        }
    };

    return (
        <Box minH="100vh" bg="bg.canvas" dir="rtl">
            <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 4 }} color={textColor}>

                {/* Search Bar */}
                <Box w="100%" maxW={{ base: "100%", sm: "90%", md: "600px" }} mx="auto"
                    mb={{ base: 6, md: 10 }} px={{ base: 3, md: 4 }}>
                    <Flex bg={searchBg} borderRadius={{ base: "4xl", md: "4xl" }} px={{ base: 3, md: 5 }}
                        py={{ base: 2.5, md: 3 }} boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                        border="2px solid" borderColor={searchQuery ? searchBorder : "transparent"}
                        transition="all 0.3s" align="center" gap={{ base: 2, md: 3 }}>
                        <Box p={{ base: 1, md: 2 }} flexShrink={0}>
                            <MdSearch size={18} color="#00A3E0" />
                        </Box>
                        <Input
                            placeholder="ابحث عن طالب بالاسم أو رقم الهاتف أو البريد الإلكتروني..."
                            bg="transparent" border="none" textAlign="right"
                            fontSize={{ base: "xs", sm: "sm" }} color={textColor}
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
                            _focus={{ outline: "none" }} flex="1" minW={0} />
                        {searchQuery && (
                            <Text fontSize={{ base: "10px", sm: "xs" }} color={useColorModeValue("gray.500", "gray.400")}
                                whiteSpace="nowrap" flexShrink={0} display={{ base: "none", sm: "block" }}>
                                {filteredRegistered.length + filteredRequests.length} نتيجة
                            </Text>
                        )}
                    </Flex>
                </Box>

                {/* Table 1 — subscribed to this teacher */}
                <Box bg={cardBg} borderRadius="3xl" p={{ base: 4, md: 6 }} mb={8} mx={{ base: 0, md: 8 }}
                    boxShadow="0 4px 24px rgba(0,0,0,0.06)" overflowX="hidden">
                    <SectionHeader title="طلاب السنتر المسجلين" count={filteredRegistered.length} loading={loadingTeacher} />
                    <Box w="100%">
                        <ColumnHeaders isRequest={false} />
                        {loadingTeacher ? (
                            <Flex justify="center" py={8}><Spinner color="#00A3E0" /></Flex>
                        ) : (
                            <VStack align="stretch" gap={0}>
                                {filteredRegistered.length > 0 ? filteredRegistered.map(student => (
                                    <StudentCard key={student.id} student={student}
                                        onToggleStatus={handleToggleRegisteredStatus} isRequest={false}
                                        onRowClick={(s) => handleRowClick(s, "registered")} onKick={handleKick} />
                                )) : (
                                    <Text textAlign="center" py={8} color="gray.400">لا يوجد طلاب مسجلين مطابقين للبحث</Text>
                                )}
                            </VStack>
                        )}
                    </Box>
                </Box>

                {/* Table 2 — subscribed to a plan */}
                <Box bg={cardBg} borderRadius="3xl" p={{ base: 4, md: 6 }} mb={8} mx={{ base: 0, md: 8 }}
                    boxShadow="0 4px 24px rgba(0,0,0,0.06)" overflowX="hidden">
                    <SectionHeader title="الطلاب المسجلين" count={filteredRequests.length} loading={loadingPlans} />
                    <Box w="100%">
                        <ColumnHeaders isRequest={true} />
                        {loadingPlans ? (
                            <Flex justify="center" py={8}><Spinner color="#00A3E0" /></Flex>
                        ) : (
                            <VStack align="stretch" gap={0}>
                                {filteredRequests.length > 0 ? filteredRequests.map(student => (
                                    <StudentCard key={student.id} student={student}
                                        onToggleStatus={handleToggleRequestStatus} isRequest={true}
                                        onRowClick={(s) => handleRowClick(s, "request")} onKick={handleKick} />
                                )) : (
                                    <Text textAlign="center" py={8} color="gray.400">لا يوجد طلبات اشتراك مطابقة للبحث</Text>
                                )}
                            </VStack>
                        )}
                    </Box>
                </Box>
            </Container>

            {/* Mobile student details dialog */}
            <StudentDetailsDialog
                student={selectedStudent} isOpen={isDialogOpen}
                onClose={() => { setIsDialogOpen(false); setSelectedStudent(null); }}
                onToggleStatus={dialogType === "registered" ? handleToggleRegisteredStatus : handleToggleRequestStatus}
                onKick={handleKick} isRequest={dialogType === "request"} />
        </Box>
    );
}