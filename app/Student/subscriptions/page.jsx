"use client"
import {useState, useEffect} from "react";
import {Box, Container, Text, Flex, Button, VStack, Heading} from "@chakra-ui/react";
import {rtdb} from "@/auth/firebase";
import {ref, get, update, set} from "firebase/database";
import {MdStar, MdLocalOffer} from "react-icons/md";
import TeacherPackagesTab from "./TeacherPackagesTab";
import GeneralPackagesTab from "./GeneralPackagesTab";
import SelectTeachersView from "./SelectTeachersView";
import ConfirmDialog from "./ConfirmDialog";
import {useAuth} from "@/providers/AuthContext";
// Subject labels map


export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [generalPlans, setGeneralPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const {user} = useAuth();
  // Subscription status
  const [hasPendingPackage, setHasPendingPackage] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeGeneralSub, setActiveGeneralSub] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [pendingNotifVisible, setPendingNotifVisible] = useState(true);

  // Dialog state
  const [dialog, setDialog] = useState({open: false, message: "", pendingData: null});
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }



  // Show a simple toast
  const showToast = (message, type = "success") => {
    setToast({message, type});
    setTimeout(() => setToast(null), 3500);
  };

  // Check if user has context-loaded subscriptions
  useEffect(() => {
    if (!user) return;
    const checkStatus = () => {
      try {
        if (user.subscriptions) {
          const subsEntries = Object.entries(user.subscriptions);
          const subs = subsEntries.map(([key, val]) => ({ ...val, key }));
          
          const hasPending = subs.some(s => s.status === "pending");
          const hasActive = subs.some(s => s.status === "active");
          const activeGen = subs.find(s => s.status === "active" && s.type === "general");
          
          setHasPendingPackage(hasPending);
          setIsSubscribed(hasActive || hasPending);
          setActiveGeneralSub(activeGen);
        } else {
          setHasPendingPackage(false);
          setIsSubscribed(false);
          setActiveGeneralSub(null);
        }
      } catch (e) {
        console.error("Error checking subscription status:", e);
      }
    };
    checkStatus();
  }, [user]);

  // Match active general sub with its plan details
  useEffect(() => {
    if (activeGeneralSub && generalPlans.length > 0) {
        const plan = generalPlans.find(p => p.id === activeGeneralSub.planId);
        setActivePlan(plan);
    } else {
        setActivePlan(null);
    }
  }, [activeGeneralSub, generalPlans]);

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
  const handleSubscribeClick = ({type, plan, teacher}) => {
    if (isSubscribed) {
      showToast("عذراً، لا يمكنك الاشتراك في أكثر من باقة في نفس الوقت", "error");
      return;
    }

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

    setDialog({open: true, message, pendingData});
  };

  // Called when user confirms in dialog
  const handleConfirm = async () => {

    if (!user) {
      showToast("يجب تسجيل الدخول أولاً", "error");
      setDialog({open: false, message: "", pendingData: null});
      return;
    }

    setConfirming(true);
    try {
      const {pendingData} = dialog;
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
        await set(ref(rtdb, `admin/sub/${user.uid}/${subKey}`), {
          planId: pendingData.planId,
          id: user.uid,
          planName: pendingData.planName,
          price: pendingData.price,
          period: pendingData.period,
          type: "general",
          status: "pending",
          subscribedAt: now,
        });
        showToast(`تم إرسال طلب الاشتراك في باقة "${pendingData.planName}" بنجاح`);
      } else {
        const subKey = `${pendingData.teacherId}`;
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
      setDialog({open: false, message: "", pendingData: null});
    }
  };

  const tabs = [
    {id: "general", label: "باقات عامة", icon: MdLocalOffer},
    {id: "teacher", label: "باقات حسب المدرس", icon: MdStar}
  ];

  return (
    <Box minH="100vh" bg="bg.canvas" dir="rtl">
      {/* Pending Package Notification Banner */}
      {hasPendingPackage && pendingNotifVisible && (
        <Box
          position="sticky"
          top={0}
          zIndex={1500}
          bg="linear-gradient(135deg, #ff8c00, #ff5a7e)"
          color="white"
          px={{base: 4, md: 8}}
          py={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
          boxShadow="0 4px 20px rgba(255,90,126,0.35)"
          dir="rtl"
        >
          <Flex align="center" gap={3} flex={1}>
            <Box
              as="span"
              fontSize="1.5rem"
              lineHeight={1}
              flexShrink={0}
            >
              🔔
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize={{base: "sm", md: "md"}}>
                لديك باقة في انتظار التفعيل
              </Text>
              <Text fontSize={{base: "xs", md: "sm"}} opacity={0.92}>
                في اقل من 24 ساعة سنتواصل معك لتفعليها
              </Text>
            </Box>
          </Flex>
          <Button
            size="sm"
            variant="ghost"
            color="white"
            _hover={{bg: "whiteAlpha.300"}}
            _active={{bg: "whiteAlpha.400"}}
            borderRadius="full"
            minW={8}
            h={8}
            p={0}
            fontSize="lg"
            onClick={() => setPendingNotifVisible(false)}
            aria-label="إغلاق الإشعار"
          >
            ✕
          </Button>
        </Box>
      )}

      <Box mr={{base: 0, md: 5}} minH="100vh">
        <Container maxW="container.xl" py={{base: 6, md: 10}} px={{base: 2, md: 4}}>
          {/* Title */}
          <VStack gap={2} mb={8} textAlign="center">
            <Heading
              size={{base: "2xl", md: "4xl"}}
              color="fg.DEFAULT"
              bgGradient="linear-gradient(135deg, #00a4e0, #ff5a7e7e)"
              bgClip="text"
            >
              اختر باقتك المثالية
            </Heading>
            <Text fontSize={{base: "md", md: "lg"}} color="fg.muted">
              خطط مرنة تناسب احتياجاتك التعليمية
            </Text>
          </VStack>

          {/* Tabs - Only show if NO active general sub */}
          {!activeGeneralSub && (
            <Flex justify="center" gap={{base: 2, md: 4}} mb={10} flexWrap="wrap">
                {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <Button
                    key={tab.id}
                    bg={activeTab === tab.id ? "linear-gradient(135deg, #00A3E0 0%, #0088C0 100%)" : "bg.panel"}
                    color={activeTab === tab.id ? "white" : "fg.muted"}
                    borderRadius="2xl"
                    px={{base: 4, md: 8}}
                    py={7}
                    fontSize={{base: "sm", md: "lg"}}
                    fontWeight="bold"
                    onClick={() => setActiveTab(tab.id)}
                    _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: activeTab === tab.id
                        ? "0 12px 28px rgba(0,163,224,0.4)"
                        : "0 8px 20px rgba(0,163,224,0.2)"
                    }}
                    _active={{transform: "translateY(-2px)"}}
                    transition="all 0.3s"
                    border="2px solid"
                    borderColor={activeTab === tab.id ? "transparent" : "border.DEFAULT"}
                    boxShadow={activeTab === tab.id ? "0 8px 24px rgba(0,163,224,0.3)" : "none"}
                    leftIcon={<Icon size={24} />}
                    >
                    {tab.label}
                    </Button>
                );
                })}
            </Flex>
          )}
          {/* Content */}
          <Box w="100%" animation="fadeIn 0.5s ease-in-out">
            {activeGeneralSub ? (
                <SelectTeachersView 
                    activeSub={activeGeneralSub} 
                    plan={activePlan} 
                    showToast={showToast} 
                />
            ) : (
                activeTab === "general" ? (
                    loadingPlans ? (
                        <Text textAlign="center" color="gray.500" py={10}>جاري التحميل...</Text>
                    ) : (
                        <GeneralPackagesTab plans={generalPlans} onSubscribe={handleSubscribeClick} />
                    )
                ) : (
                    <TeacherPackagesTab onSubscribe={handleSubscribeClick} />
                )
            )}
          </Box>
        </Container>
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={dialog.open}
        onClose={() => !confirming && setDialog({open: false, message: "", pendingData: null})}
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