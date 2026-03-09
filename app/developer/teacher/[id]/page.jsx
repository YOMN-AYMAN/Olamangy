"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, Flex, Text, VStack, Icon, Image, Badge, Collapsible, Spinner, Center, Menu, Portal } from "@chakra-ui/react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { rtdb } from "@/auth/firebase";
import { ref, get, update } from "firebase/database";

// Status configuration matching Students page
const STATUS_CONFIG = {
    approved: { 
        label: "مفعل", 
        color: "blue"
    },
    pending: { 
        label: "انتظار", 
        color: "orange"
    },
    rejected: { 
        label: "مغلق", 
        color: "red"
    }
};

const ActivityItem = ({ title, time, isPayment, amount }) => (
    <Flex justify="space-between" align="center" p={4} borderBottom="1px solid #EDF2F7">
        <Box>
            <Text color={isPayment ? "blue.500" : "blue.400"} fontWeight="medium">
                {title}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={1}>
                {amount} ج.م
            </Text>
        </Box>
        <Text color="blue.300" fontSize="sm">{time}</Text>
    </Flex>
);

// Format date to Arabic format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// Format time from timestamp
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function TeacherDetailsPage() {
    const params = useParams();
    const id = params.id;
    
    const [teacher, setTeacher] = useState(null);
    const [userData, setUserData] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [studentNames, setStudentNames] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch student name by ID
    const fetchStudentName = async (studentId) => {
        if (!studentId || studentNames[studentId]) return studentNames[studentId];
        
        try {
            const studentRef = ref(rtdb, 'users/' + studentId);
            const studentSnap = await get(studentRef);
            if (studentSnap.exists()) {
                const studentData = studentSnap.val();
                const name = studentData.fullName || studentData.name || "غير معروف";
                setStudentNames(prev => ({ ...prev, [studentId]: name }));
                return name;
            }
        } catch (error) {
            console.error("Error fetching student:", error);
        }
        return "غير معروف";
    };

    useEffect(() => {
        const fetchTeacherData = async () => {
            if (!id) return;
            
            try {
                const teacherRef = ref(rtdb, 'teachers/' + id);
                const teacherSnap = await get(teacherRef);
                
                if (teacherSnap.exists()) {
                    const teacherData = teacherSnap.val();
                    setTeacher(teacherData);
                    
                    if (teacherData.userId) {
                        const userRef = ref(rtdb, 'users/' + teacherData.userId);
                        const userSnap = await get(userRef);
                        if (userSnap.exists()) {
                            setUserData(userSnap.val());
                        }
                    }
                    
                    // Fetch invoices
                    const invoicesRef = ref(rtdb, 'invoices');
                    const invoicesSnap = await get(invoicesRef);
                    
                    if (invoicesSnap.exists()) {
                        const invoicesData = [];
                        const invoicesObj = invoicesSnap.val();
                        
                        Object.entries(invoicesObj).forEach(([key, invoice]) => {
                            if (invoice.teacherId === id) {
                                invoicesData.push({
                                    id: key,
                                    ...invoice
                                });
                            }
                        });
                        
                        const studentPromises = invoicesData
                            .filter(inv => inv.type === 'subscription' && inv.studentId)
                            .map(inv => fetchStudentName(inv.studentId));
                        
                        await Promise.all(studentPromises);
                        
                        invoicesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        setInvoices(invoicesData);
                    }
                }
            } catch (error) {
                console.error("Error fetching teacher:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, [id]);

    // Handle status change
    const handleStatusChange = async (newStatus) => {
        if (!teacher || newStatus === teacher.status) return;
        
        try {
            const teacherRef = ref(rtdb, `teachers/${id}`);
            await update(teacherRef, { status: newStatus });
            setTeacher(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Group invoices by date
    const groupedInvoices = invoices.reduce((groups, invoice) => {
        const dateKey = new Date(invoice.createdAt).toISOString().split('T')[0];
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(invoice);
        return groups;
    }, {});

    // Subject names mapping
    const subjectNames = {
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

    const stageNames = {
        primary: "الابتدائي",
        preparatory: "الإعدادي",
        secondary: "الثانوي"
    };

    if (loading) {
        return (
            <>
    
                <Center py={20}>
                    <Spinner size="xl" color="#00A3E0" />
                </Center>
            </>
        );
    }

    if (!teacher) {
        return (
            <>
    
                <Center py={20}>
                    <Text color="gray.500" fontSize="lg">المدرس غير موجود</Text>
                </Center>
            </>
        );
    }

    const displayName = userData?.fullName || userData?.name || "غير معروف";
    const displayPhone = userData?.phone || "غير متوفر";
    const displayEmail = userData?.email || "غير متوفر";
    const displaySubject = subjectNames[teacher.subjectId] || teacher.subjectId;
    const displayStages = teacher.stages?.map(s => stageNames[s] || s).join("، ") || "غير محدد";
    
    const currentStatus = STATUS_CONFIG[teacher.status] || STATUS_CONFIG.pending;

    const getInvoiceTitle = (invoice) => {
        if (invoice.type === 'payment') {
            return invoice.description || `تم دفع ${invoice.amount} جنيه`;
        }
        const studentName = studentNames[invoice.studentId] || "طالب جديد";
        return `اشترك الطالب (${studentName})`;
    };

    return (
        <>

            <Box dir="rtl" p={6}>

                <Box 
                    bg="bg.subtle" 
                    p={4} 
                    borderRadius="2xl" 
                    mb={6} 
                    shadow="sm" 
                    border="2px solid"
                    borderColor={`${currentStatus.color}.500`}
                >
                    <Flex align="center" justify="space-between" direction={{ base: "column", md: "row" }} gap={4}>
                        <Flex align="center" gap={4} flexWrap="wrap">
                            <Image 
                                src={teacher.profileImage || "https://i.pravatar.cc/300?u=iu"} 
                                borderRadius="full" 
                                boxSize="60px" 
                                alt={displayName}
                            />
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" color="blue.600">م/ {displayName}</Text>
                                <Badge colorPalette="blue" variant="surface" p={1}>مدرس {displaySubject}</Badge>
                            </Box>
                            
                            {/* Status Badge - Between phone and subject */}
                            <Menu.Root>
                                <Menu.Trigger asChild>
                                    <Badge 
                                        colorPalette={currentStatus.color} 
                                        variant="subtle" 
                                        px="4" 
                                        py="2" 
                                        borderRadius="full"
                                        cursor="pointer"
                                        fontSize="sm"
                                        _hover={{ opacity: 0.8 }}
                                    >
                                        {currentStatus.label}
                                    </Badge>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.Item 
                                                value="approved"
                                                onClick={() => handleStatusChange('approved')}
                                                color="blue.600"
                                            >
                                                مفعل
                                            </Menu.Item>
                                            <Menu.Item 
                                                value="pending"
                                                onClick={() => handleStatusChange('pending')}
                                                color="orange.600"
                                            >
                                                انتظار
                                            </Menu.Item>
                                            <Menu.Item 
                                                value="rejected"
                                                onClick={() => handleStatusChange('rejected')}
                                                color="red.600"
                                            >
                                                مغلق
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                            
                            <Text fontSize="sm" color="blue.600" dir="ltr">{displayPhone}</Text>
                        </Flex>
                        <VStack align="flex-start" gap={0} fontSize="sm">
                            <Text color="fg.subtle">المراحل: <Text as="span" color="fg.subtle">{displayStages}</Text></Text>
                            <Text color="fg.subtle">الايميل: <Text as="span" color="fg.subtle">{displayEmail}</Text></Text>
                        </VStack>
                    </Flex>
                </Box>

                {Object.entries(groupedInvoices).map(([dateKey, dayInvoices]) => (
                    <Collapsible.Root defaultOpen key={dateKey}>
                        <Box borderRadius="xl" overflow="hidden" border="1px solid #E2E8F0" bg="white" shadow="sm" mb={4}>
                            
                            <Collapsible.Trigger asChild dir="rtl">
                                <Flex 
                                    bg="blue.500" 
                                    p={4} 
                                    color="white" 
                                    justify="space-between" 
                                    align="center" 
                                    cursor="pointer"
                                >
                                    <Text fontWeight="bold">سجل النشاطات - {formatDate(dateKey)}</Text>
                                    <Collapsible.Context>
                                        {(context) => (
                                            <Icon as={context.open ? MdKeyboardArrowUp : MdKeyboardArrowDown} fontSize="24px" />
                                        )}
                                    </Collapsible.Context>
                                </Flex>
                            </Collapsible.Trigger>
                            
                            <Collapsible.Content>
                                <VStack align="stretch" gap={0} dir="rtl">
                                    {dayInvoices.map((invoice) => (
                                        <ActivityItem 
                                            key={invoice.id}
                                            title={getInvoiceTitle(invoice)}
                                            time={formatTime(invoice.createdAt)}
                                            isPayment={invoice.type === 'payment'}
                                            amount={invoice.amount}
                                        />
                                    ))}
                                </VStack>
                            </Collapsible.Content>
                        </Box>
                    </Collapsible.Root>
                ))}

                {invoices.length === 0 && (
                    <Center py={10}>
                        <Text color="gray.500">لا توجد نشاطات مسجلة</Text>
                    </Center>
                )}
            </Box>
        </>
    );
}