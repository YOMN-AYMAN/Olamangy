"use client"

import { useState, useEffect } from "react";
import { Box, Container, Text, Flex, Button, VStack, HStack, Heading, Input, Badge } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { rtdb } from "@/auth/firebase";
import { ref, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { 
    MdCheck,
    MdSearch,
    MdStar,
    MdLocalOffer,
    MdClose
} from "react-icons/md";


// Subject labels map
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
    italian: "اللغة الإيطالية",
    spanish: "اللغة الإسبانية",
    science: "العلوم",
    social: "الدراسات الاجتماعية",
    religion: "التربية الدينية",
    art: "التربية الفنية",
    music: "التربية الموسيقية",
    sports: "التربية البدنية",
    technology: "التكنولوجيا",
    computers: "الحاسب الآلي",
};

// ─── Confirmation Dialog ───────────────────────────────────────────────────
function ConfirmDialog({ isOpen, onClose, onConfirm, message, loading }) {
    if (!isOpen) return null;
    return (
        <>
            <Box
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                rounded="2xl"
                shadow="2xl"
                w="92%"
                maxW="420px"
                zIndex={1000}
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
                _dark={{ bg: "gray.900", borderColor: "gray.700" }}
            >
                {/* Header */}
                <Flex
                    justify="space-between"
                    align="center"
                    px={6}
                    py={4}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    _dark={{ borderColor: "gray.700" }}
                >
                    <Text fontWeight="bold" fontSize="md" color="#000" _dark={{ color: "white" }}>
                        تأكيد الاشتراك
                    </Text>
                    <Box
                        as="button"
                        w="28px"
                        h="28px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        rounded="full"
                        bg="gray.100"
                        color="gray.500"
                        fontSize="lg"
                        fontWeight="bold"
                        cursor="pointer"
                        _hover={{ bg: "gray.200" }}
                        onClick={onClose}
                        _dark={{ bg: "gray.700", color: "gray.300" }}
                    >
                        <MdClose size={18} />
                    </Box>
                </Flex>

                {/* Body */}
                <Box px={6} py={6} dir="rtl">
                    <Text fontSize="md" color="gray.700" lineHeight="1.8" textAlign="right" _dark={{ color: "gray.300" }}>
                        {message}
                    </Text>
                </Box>

                {/* Footer */}
                <Flex
                    px={6}
                    pb={5}
                    pt={2}
                    gap={3}
                    justify="flex-end"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    _dark={{ borderColor: "gray.700" }}
                >
                    <Button
                        variant="outline"
                        rounded="xl"
                        onClick={onClose}
                        disabled={loading}
                        color="gray.600"
                        borderColor="gray.300"
                        _hover={{ bg: "gray.50" }}
                    >
                        إلغاء
                    </Button>
                    <Button
                        bg="#009EDB"
                        color="white"
                        rounded="xl"
                        onClick={onConfirm}
                        loading={loading}
                        _hover={{ bg: "#0085bb" }}
                        fontWeight="bold"
                    >
                        تأكيد
                    </Button>
                </Flex>
            </Box>
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.600"
                zIndex={999}
                onClick={onClose}
            />
        </>
    );
}

// ─── General Packages Tab ─────────────────────────────────────────────────
const GeneralPackagesTab = ({ plans, onSubscribe }) => {
    const bgColor = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const descBg = useColorModeValue("white", "#2D3748");

    return (
        <VStack gap={8} align="stretch" w="100%">
            <Box
                border="2px solid #00A3E0"
                p={{ base: 4, md: 8 }}
                mx={{ base: 2, sm: 4, md: 12 }}
                borderRadius="2xl"
                textAlign="right"
                position="relative"
                overflow="hidden"
                boxShadow="0 2px 8px rgba(0,163,224,0.4)"
                bg={descBg}
            >
                <Text color="#00A3E0" fontSize={{ base: "sm", md: "lg" }} fontWeight="medium" position="relative">
                    هذه الباقة تتيح لك الاشتراك مع عدد من المدرسين - ايا يكن التخصص او المدرس - مقابل عدد من المال حسب الباقة اللي هتشترك فيها.
                </Text>
            </Box>

            <Flex
                gap={{ base: 4, md: 6 }}
                justify="center"
                flexWrap="wrap"
                align="stretch"
                mt={{ base: 6, md: 10 }}
                px={{ base: 2, md: 0 }}
            >
                {plans.map((pkg) => (
                    <Box
                        key={pkg.id}
                        bg={pkg.isPopular ? pkg.bgColor : bgColor}
                        color={pkg.isPopular ? "white" : textColor}
                        borderRadius="3xl"
                        p={{ base: 4, md: 8 }}
                        minW={{ base: "100%", sm: "280px", md: "300px" }}
                        w={{ base: "100%", sm: "calc(50% - 8px)", lg: "auto" }}
                        flex={{ base: "none", lg: "1" }}
                        maxW={{ base: "100%", md: "360px" }}
                        border="2px solid"
                        borderColor={pkg.isPopular ? pkg.borderColor : borderColor}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={6}
                        position="relative"
                        boxShadow={pkg.isPopular
                            ? "0 20px 40px rgba(0,163,224,0.3)"
                            : "0 4px 20px rgba(0,0,0,0.08)"
                        }
                        transform={pkg.isPopular ? { base: "scale(1)", lg: "scale(1.05)" } : "scale(1)"}
                        _hover={{
                            transform: pkg.isPopular ? { base: "scale(1.02)", lg: "scale(1.08)" } : { base: "scale(1.01)", lg: "scale(1.03)" },
                            boxShadow: pkg.isPopular
                                ? "0 24px 48px rgba(0,163,224,0.4)"
                                : "0 8px 30px rgba(0,0,0,0.12)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                        {pkg.isPopular && (
                            <Badge
                                position="absolute"
                                top="-12px"
                                bg="#FF5A7E"
                                color="white"
                                px={4}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="bold"
                                boxShadow="0 4px 12px rgba(255,90,126,0.4)"
                            >
                                الأكثر شعبية ⭐
                            </Badge>
                        )}

                        <Heading
                            size="xl"
                            color={pkg.isPopular ? "white" : textColor}
                            mt={pkg.isPopular ? 4 : 0}
                        >
                            {pkg.name}
                        </Heading>

                        <Box textAlign="center">
                            <Flex align="baseline" justify="center" gap={1}>
                                <Text
                                    fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                                    fontWeight="black"
                                    color={pkg.isPopular ? "white" : "#00A3E0"}
                                    lineHeight="1"
                                >
                                    {pkg.price}
                                </Text>
                                <Text
                                    fontSize={{ base: "sm", md: "xl" }}
                                    color={pkg.isPopular ? "rgba(255,255,255,0.9)" : "gray.600"}
                                >
                                    ج
                                </Text>
                            </Flex>
                            <Text
                                fontSize="md"
                                color={pkg.isPopular ? "rgba(255,255,255,0.8)" : "gray.500"}
                                mt={1}
                            >
                                لكل {pkg.period}
                            </Text>
                        </Box>

                        <Box
                            w="100%"
                            h="1px"
                            bg={pkg.isPopular ? "rgba(255,255,255,0.3)" : borderColor}
                        />

                        <VStack gap={4} align="stretch" w="100%">
                            {Object.values(pkg.features ?? {}).map((feature, index) => (
                                <Flex
                                    key={index}
                                    align="center"
                                    justify="space-between"
                                    gap={3}
                                >
                                    <Text
                                        fontSize="sm"
                                        textAlign="right"
                                        color={pkg.isPopular ? "white" : textColor}
                                    >
                                        {feature}
                                    </Text>
                                    <Box
                                        bg={pkg.isPopular ? "rgba(255,255,255,0.2)" : useColorModeValue("#E3F2FD", "#2D3748")}
                                        borderRadius="full"
                                        p={1}
                                    >
                                        <MdCheck
                                            size={20}
                                            color={pkg.isPopular ? "white" : "#00A3E0"}
                                        />
                                    </Box>
                                </Flex>
                            ))}
                        </VStack>

                        <Button
                            mt="auto"
                            w="100%"
                            bg={pkg.buttonColor}
                            color={pkg.buttonTextColor}
                            borderRadius="xl"
                            py={7}
                            fontSize="lg"
                            fontWeight="bold"
                            _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: pkg.isPopular
                                    ? "0 12px 24px rgba(255,255,255,0.3)"
                                    : "0 8px 20px rgba(0,163,224,0.4)"
                            }}
                            _active={{ transform: "translateY(-2px)" }}
                            transition="all 0.3s"
                            border={pkg.isPopular ? "2px solid white" : "none"}
                            onClick={() => onSubscribe({ type: "general", plan: pkg })}
                        >
                            اشترك الآن
                        </Button>
                    </Box>
                ))}
            </Flex>
        </VStack>
    );
};

// ─── Teacher Packages Tab ─────────────────────────────────────────────────
const TeacherPackagesTab = ({ onSubscribe }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);

    const bgColor = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const descBg = useColorModeValue("white", "#2D3748");
    const searchBg = useColorModeValue("white", "#2D3748");
    const searchBorderColor = useColorModeValue("#E3F2FD", "#374151");
    const badgeBg = useColorModeValue("#E3F2FD", "#1F2937");

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoadingTeachers(true);
            try {
                const teachersSnap = await get(ref(rtdb, "teachers"));
                const usersSnap = await get(ref(rtdb, "users"));

                if (!teachersSnap.exists()) { setLoadingTeachers(false); return; }

                const teachersData = teachersSnap.val();
                const usersData = usersSnap.exists() ? usersSnap.val() : {};

                const approvedTeachers = Object.entries(teachersData)
                    .filter(([, t]) => t.status === "approved")
                    .map(([id, t]) => {
                        const user = usersData[id] || {};
                        return {
                            id,
                            name: user.fullName || "مدرس",
                            subject: subjectLabels[t.subjectId] || t.subjectId || "—",
                            subjectId: t.subjectId,
                            image: user.avatar || t.profileImage || null,
                            rating: t.rating || 0,
                            students: t.totalStudents || 0,
                            language: t.language || "",
                        };
                    });

                setTeachers(approvedTeachers);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingTeachers(false);
            }
        };
        fetchTeachers();
    }, []);

    const filtered = teachers.filter((t) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            t.name.toLowerCase().includes(q) ||
            t.subject.toLowerCase().includes(q) ||
            (t.subjectId || "").toLowerCase().includes(q)
        );
    });

    return (
        <VStack gap={8} align="stretch" w="100%">
            <Box
                border="2px solid #00A3E0"
                p={{ base: 4, md: 8 }}
                mx={{ base: 2, sm: 4, md: 12 }}
                borderRadius="2xl"
                textAlign="right"
                position="relative"
                overflow="hidden"
                boxShadow="0 2px 8px rgba(0,163,224,0.4)"
                bg={descBg}
            >
                <Text color="#00A3E0" fontSize={{ base: "sm", md: "lg" }} fontWeight="medium" position="relative">
                    هذه الباقة تتيح لك الاشتراك مع مدرس معين أو أكثر حسب شروط يحددها المدرس
                </Text>
            </Box>

            {/* Search Bar */}
            <Flex
                maxW="600px"
                mx="auto"
                w="100%"
                bg={searchBg}
                borderRadius="2xl"
                px={{ base: 3, md: 6 }}
                py={2}
                align="center"
                gap={3}
                boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                border="2px solid"
                borderColor={searchBorderColor}
            >
                <MdSearch size={24} color="#00A3E0" />
                <Input
                    placeholder="ابحث عن المدرس بالاسم أو التخصص..."
                    bg="transparent"
                    border="none"
                    textAlign="right"
                    fontSize={{ base: "sm", md: "md" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
                    _focus={{ outline: "none" }}
                    color={textColor}
                    flex="1"
                />
            </Flex>

            {/* Section Title */}
            <Flex align="center" gap={3} mt={2}>
                <Box bg={badgeBg} borderRadius="full" p={2}>
                    <MdStar size={24} color="#00A3E0" />
                </Box>
                <Heading size="lg" color={textColor}>
                    المدرسون المتاحون
                </Heading>
            </Flex>

            {/* Teachers Grid */}
            {loadingTeachers ? (
                <Text textAlign="center" color="gray.500" py={10}>جاري التحميل...</Text>
            ) : filtered.length === 0 ? (
                <Text textAlign="center" color="gray.500" py={10}>لا يوجد مدرسون مطابقون للبحث</Text>
            ) : (
                <Flex
                    gap={{ base: 4, md: 6 }}
                    justify="center"
                    flexWrap="wrap"
                    px={{ base: 2, md: 0 }}
                >
                    {filtered.map((teacher) => (
                        <Box
                            key={teacher.id}
                            bg={bgColor}
                            borderRadius="3xl"
                            p={6}
                            minW={{ base: "100%", sm: "240px" }}
                            maxW="300px"
                            border="2px solid"
                            borderColor={borderColor}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap={4}
                            boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                            _hover={{
                                transform: "translateY(-8px)",
                                boxShadow: useColorModeValue("0 12px 40px rgba(0,163,224,0.2)", "0 12px 40px rgba(0,163,224,0.15)"),
                                borderColor: "#00A3E0"
                            }}
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            position="relative"
                            overflow="hidden"
                        >
                            <Box
                                position="absolute"
                                top="-20px"
                                right="-20px"
                                w="80px"
                                h="80px"
                                borderRadius="full"
                                bg="linear-gradient(135deg, #00A3E0 0%, #0088C0 100%)"
                                opacity="0.1"
                            />

                            {/* Avatar */}
                            <Box
                                w="120px"
                                h="120px"
                                borderRadius="full"
                                overflow="hidden"
                                border="4px solid"
                                borderColor="#00A3E0"
                                boxShadow="0 8px 24px rgba(0,163,224,0.3)"
                                position="relative"
                                bg="gray.100"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {teacher.image && !teacher.image.startsWith("data:") ? (
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <Text fontSize="3xl" color="#00A3E0" fontWeight="bold">
                                        {teacher.name?.charAt(0) || "م"}
                                    </Text>
                                )}
                            </Box>

                            {/* Info */}
                            <VStack gap={1} align="center" w="100%">
                                <Text fontSize="xl" fontWeight="bold" color="#00A3E0" textAlign="center">
                                    م/ {teacher.name}
                                </Text>
                                <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")} textAlign="center">
                                    {teacher.subject}
                                </Text>
                                {teacher.language && (
                                    <Text fontSize="xs" color={useColorModeValue("gray.400", "gray.500")} textAlign="center">
                                        لغة الشرح: {teacher.language}
                                    </Text>
                                )}
                            </VStack>

                            {/* Stats */}
                            <Flex gap={4} w="100%" justify="center" flexWrap="wrap">
                                <Flex
                                    align="center"
                                    gap={1}
                                    bg={useColorModeValue("#FFF3E0", "#3E3B30")}
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    <Text fontSize="sm" fontWeight="bold" color="#FF9800">
                                        {teacher.rating > 0 ? teacher.rating : "—"}
                                    </Text>
                                    <MdStar size={16} color="#FF9800" />
                                </Flex>
                                <Flex
                                    align="center"
                                    gap={1}
                                    bg={badgeBg}
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    <Text fontSize="sm" fontWeight="bold" color="#00A3E0">
                                        {teacher.students}
                                    </Text>
                                    <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>طالب</Text>
                                </Flex>
                            </Flex>

                            <Button
                                w="100%"
                                bg="linear-gradient(135deg, #00A3E0 0%, #0088C0 100%)"
                                color="white"
                                borderRadius="xl"
                                py={6}
                                fontSize="md"
                                fontWeight="bold"
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 20px rgba(0,163,224,0.4)"
                                }}
                                _active={{ transform: "translateY(0)" }}
                                transition="all 0.2s"
                                onClick={() => onSubscribe({ type: "teacher", teacher })}
                            >
                                اشترك الآن
                            </Button>
                        </Box>
                    ))}
                </Flex>
            )}
        </VStack>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────
export default function SubscriptionsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [generalPlans, setGeneralPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);

    // Dialog state
    const [dialog, setDialog] = useState({ open: false, message: "", pendingData: null });
    const [confirming, setConfirming] = useState(false);
    const [toast, setToast] = useState(null); // { message, type }

    const pageBg = useColorModeValue("#FAFAFA", "#0F172A");
    const headingColor = useColorModeValue("black", "white");
    const descColor = useColorModeValue("gray.600", "gray.300");

    // Show a simple toast
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Fetch plans from DB
    useEffect(() => {
        const fetchPlans = async () => {
            setLoadingPlans(true);
            try {
                const snap = await get(ref(rtdb, "plans"));
                if (snap.exists()) {
                    const data = snap.val();
                    const arr = Object.values(data)
                    .filter((p) => p.type === "general")
                    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
                    setGeneralPlans(arr);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    // Called when user clicks "اشترك الآن"
    const handleSubscribeClick = ({ type, plan, teacher }) => {
        let message = "";
        let pendingData = {};

        if (type === "general") {
            message = `هل أنت متأكد أنك تريد الاشتراك في باقة "${plan.name}" بسعر ${plan.price} جنيه لكل ${plan.period}؟`;
            pendingData = {
                type: "general",
                planId: plan.id,
                planName: plan.name,
                price: plan.price,
                period: plan.period,
            };
        } else {
            message = `هل أنت متأكد أنك تريد الاشتراك مع المدرس "${teacher.name}" في مادة "${teacher.subject}"؟`;
            pendingData = {
                type: "teacher",
                teacherId: teacher.id,
                teacherName: teacher.name,
                subject: teacher.subject,
            };
        }

        setDialog({ open: true, message, pendingData });
    };

    // Called when user confirms in dialog
    const handleConfirm = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            showToast("يجب تسجيل الدخول أولاً", "error");
            setDialog({ open: false, message: "", pendingData: null });
            return;
        }

        setConfirming(true);
        try {
            const { pendingData } = dialog;
            const now = new Date().toISOString();

            if (pendingData.type === "general") {
                const subKey = `plan_${pendingData.planId}_${Date.now()}`;
                await update(ref(rtdb, `users/${user.uid}/subscriptions/${subKey}`), {
                    planId: pendingData.planId,
                    planName: pendingData.planName,
                    price: pendingData.price,
                    period: pendingData.period,
                    type: "general",
                    status: "pending",
                    subscribedAt: now,
                });
                showToast(`تم إرسال طلب الاشتراك في باقة "${pendingData.planName}" بنجاح`);
            } else {
                const subKey = `teacher_${pendingData.teacherId}_${Date.now()}`;
                await update(ref(rtdb, `users/${user.uid}/subscriptions/${subKey}`), {
                    teacherId: pendingData.teacherId,
                    teacherName: pendingData.teacherName,
                    subject: pendingData.subject,
                    type: "teacher",
                    status: "pending",
                    subscribedAt: now,
                });
                showToast(`تم إرسال طلب الاشتراك مع المدرس "${pendingData.teacherName}" بنجاح`);
            }
        } catch (e) {
            console.error(e);
            showToast("حدث خطأ أثناء الاشتراك، يرجى المحاولة مرة أخرى", "error");
        } finally {
            setConfirming(false);
            setDialog({ open: false, message: "", pendingData: null });
        }
    };

    const tabs = [
        { id: "general", label: "باقات عامة", icon: MdLocalOffer },
        { id: "teacher", label: "باقات حسب المدرس", icon: MdStar }
    ];

    return (
        <Box minH="100vh" bg={pageBg} dir="rtl">
            <Box mr={{ base: 0, md: 5 }} minH="100vh">
                <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 2, md: 4 }}>
                    {/* Title */}
                    <VStack gap={2} mb={8} textAlign="center">
                        <Heading
                            size={{ base: "2xl", md: "4xl" }}
                            color={headingColor}
                            bgGradient="linear-gradient(135deg, #00a4e0, #ff5a7e7e)"
                            bgClip="text"
                        >
                            اختر باقتك المثالية
                        </Heading>
                        <Text fontSize={{ base: "md", md: "lg" }} color={descColor}>
                            خطط مرنة تناسب احتياجاتك التعليمية
                        </Text>
                    </VStack>

                    {/* Tabs */}
                    <Flex justify="center" gap={{ base: 2, md: 4 }} mb={10} flexWrap="wrap">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <Button
                                    key={tab.id}
                                    bg={activeTab === tab.id ? "linear-gradient(135deg, #00A3E0 0%, #0088C0 100%)" : useColorModeValue("white", "#1A202C")}
                                    color={activeTab === tab.id ? "white" : useColorModeValue("gray.600", "white")}
                                    borderRadius="2xl"
                                    px={{ base: 4, md: 8 }}
                                    py={7}
                                    fontSize={{ base: "sm", md: "lg" }}
                                    fontWeight="bold"
                                    onClick={() => setActiveTab(tab.id)}
                                    _hover={{
                                        transform: "translateY(-4px)",
                                        boxShadow: activeTab === tab.id
                                            ? "0 12px 28px rgba(0,163,224,0.4)"
                                            : useColorModeValue("0 8px 20px rgba(0,0,0,0.1)", "0 8px 20px rgba(0,163,224,0.2)")
                                    }}
                                    _active={{ transform: "translateY(-2px)" }}
                                    transition="all 0.3s"
                                    border="2px solid"
                                    borderColor={activeTab === tab.id ? "transparent" : useColorModeValue("gray.200", "gray.600")}
                                    boxShadow={activeTab === tab.id ? "0 8px 24px rgba(0,163,224,0.3)" : "none"}
                                    leftIcon={<Icon size={24} />}
                                >
                                    {tab.label}
                                </Button>
                            );
                        })}
                    </Flex>

                    {/* Content */}
                    <Box w="100%" animation="fadeIn 0.5s ease-in-out">
                        {activeTab === "general" ? (
                            loadingPlans ? (
                                <Text textAlign="center" color="gray.500" py={10}>جاري التحميل...</Text>
                            ) : (
                                <GeneralPackagesTab plans={generalPlans} onSubscribe={handleSubscribeClick} />
                            )
                        ) : (
                            <TeacherPackagesTab onSubscribe={handleSubscribeClick} />
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={dialog.open}
                onClose={() => !confirming && setDialog({ open: false, message: "", pendingData: null })}
                onConfirm={handleConfirm}
                message={dialog.message}
                loading={confirming}
            />

            {/* Simple Toast */}
            {toast && (
                <Box
                    position="fixed"
                    bottom={6}
                    left="50%"
                    transform="translateX(-50%)"
                    bg={toast.type === "error" ? "#E53E3E" : "#38A169"}
                    color="white"
                    px={6}
                    py={3}
                    rounded="xl"
                    shadow="lg"
                    zIndex={2000}
                    fontSize="sm"
                    fontWeight="medium"
                    textAlign="center"
                    maxW="90vw"
                >
                    {toast.message}
                </Box>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Box>
    );
}