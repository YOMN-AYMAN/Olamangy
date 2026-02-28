"use client"

import { useState, useMemo } from "react";
import { 
    Box, 
    Container, 
    Text, 
    Flex, 
    Button, 
    VStack, 
    Input, 
    Badge, 
    Grid, 
    HStack, 
    Icon,
    Portal
} from "@chakra-ui/react";
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
} from "../../../components/ui/dialog";
import { useColorModeValue } from "../../../components/ui/color-mode";
import { 
    MdSearch,
    MdArrowBack,
    MdMoreVert,
    MdCheckCircle,
    MdCancel,
    MdPeople,
    MdEmail,
    MdPhone,
    MdPerson
} from "react-icons/md";

// Mock data for registered students
const registeredStudentsData = [
    {
        id: "1",
        name: "سالم علي",
        phone: "01019569964",
        email: "filopaterf.m@gamil.com",
        status: "مدفوع"
    },
    {
        id: "2",
        name: "ليلى خالد",
        phone: "01019569965",
        email: "laila.khaled@email.com",
        status: "مدفوع"
    },
    {
        id: "3",
        name: "عمر حسن",
        phone: "01019569966",
        email: "omar.hassan@email.com",
        status: "غير مدفوع"
    },
    {
        id: "4",
        name: "فاطمة محمود",
        phone: "01019569967",
        email: "fatma.mahmoud@email.com",
        status: "مدفوع"
    },
    {
        id: "5",
        name: "يوسف احمد",
        phone: "01019569968",
        email: "youssef.ahmed@email.com",
        status: "غير مدفوع"
    }
];

// Mock data for subscription requests
const subscriptionRequestsData = [
    {
        id: "1",
        name: "أحمد سامي",
        phone: "01019569969",
        email: "ahmed.sami@email.com",
        packageType: "عادي",
        accountStatus: "مفعل"
    },
    {
        id: "2",
        name: "سارة محمد",
        phone: "01019569970",
        email: "sara.mohamed@email.com",
        packageType: "بريميم",
        accountStatus: "غير مفعل"
    },
    {
        id: "3",
        name: "خالد عمر",
        phone: "01019569971",
        email: "khaled.omar@email.com",
        packageType: "عادي",
        accountStatus: "مفعل"
    },
    {
        id: "4",
        name: "نورا سعيد",
        phone: "01019569972",
        email: "nora.saeed@email.com",
        packageType: "مميزة",
        accountStatus: "مفعل"
    }
];

// Grid template columns - responsive
const GRID_TEMPLATE_REGISTERED = { 
    base: "2fr 1fr 1fr",  // Mobile: Name, Status, Delete
    md: "1fr 1fr 2fr 1fr 0.8fr"  // Desktop: Name, Phone, Email, Status, Delete
};

const GRID_TEMPLATE_REQUESTS = {
    base: "2fr 1fr 1fr",  // Mobile: Name, Package, Status
    md: "1fr 1fr 2fr 1fr 1fr"  // Desktop: Name, Phone, Email, Package, Status
};

const StatusButton = ({ status, onToggle }) => {
    const isActive = status === "مفعل" || status === "مدفوع";
    const activeBg = useColorModeValue("#E3F2FD", "#1E3A8A");
    const inactiveBg = useColorModeValue("#FFEBEE", "#7a2323");
    const activeHover = useColorModeValue("#BBDEFB", "#274374");
    const inactiveHover = useColorModeValue("#FFCDD2", "#8B1C1C");
    const activeBorder = useColorModeValue("#90CAF9", "#3B82F6");
    const inactiveBorder = useColorModeValue("#EF9A9A", "#EF4444");

    return (
        <Button
            size="xs"
            minW={{ base: "70px", md: "90px" }} 
            fontSize={{ base: "9px", md: "11px" }}
            height={{ base: "24px", md: "28px" }}
            px={{ base: 2, md: 3 }}
            bg={isActive ? activeBg : inactiveBg}
            color={isActive ? "#00A3E0" : "#F44336"}
            borderRadius="full"
            py={0}
            fontWeight="bold"
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            _hover={{
                transform: "scale(1.05)",
                bg: isActive ? activeHover : inactiveHover
            }}
            _active={{
                transform: "scale(0.95)"
            }}
            transition="all 0.2s"
            border="1px solid"
            borderColor={isActive ? activeBorder : inactiveBorder}
            leftIcon={
                isActive ? (
                    <Icon as={MdCheckCircle} boxSize={{ base: 3, md: 3 }} />
                ) : (
                    <Icon as={MdCancel} boxSize={{ base: 3, md: 3 }} />
                )
            }
            iconSpacing={1}
            justifySelf="center"
        >
            {isActive ? "مفعل" : "غير مفعل"}
        </Button>
    );
};

const TruncatedText = ({ children, fontSize = "sm", fontWeight = "normal", color, textAlign = "center" }) => {
    const defaultColor = useColorModeValue("gray.800","gray.200");
    return (
        <Text
            fontSize={{ base: "11px", md: "sm" }}
            fontWeight={fontWeight}
            color={color || defaultColor}
            textAlign={textAlign}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            px={2}
        >
            {children}
        </Text>
    );
};

const StudentDetailsDialog = ({
  student,
  isOpen,
  onClose,
  onToggleStatus,
  isRequest = false,
}) => {
  const isActive = isRequest
    ? student?.accountStatus === "مفعل"
    : student?.status === "مدفوع";

  const dialogBg = useColorModeValue("white", "gray.800");
  const itemBg = useColorModeValue("gray.50", "gray.700");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const headerGradient = useColorModeValue(
    "linear(to-l, blue.50, white)",
    "linear(to-l, gray.700, gray.800)"
  );

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="md"
      placement="center"
    >
      <Portal>
        <DialogContent
          bg={dialogBg}
          borderRadius="2xl"
          m={15}
          boxShadow="0 25px 60px rgba(0,0,0,0.15)"
          overflow="hidden"
        >
          {/* ================= HEADER ================= */}
          <Box bgGradient={headerGradient} px={2} py={5} mt={6}  alignSelf="center">
            <DialogHeader p={0}>
              <DialogTitle
                textAlign="center"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="bold"
                color={useColorModeValue("gray.800", "white")}
              >
                معلومات الطالب
              </DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />
          </Box>

          {/* ================= BODY ================= */}
          <DialogBody px={6} py={6}>
            {student && (
              <VStack spacing={5} align="stretch" dir="rtl">
                
                {/* NAME + PACKAGE */}
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  
                  {/* Name Card */}
                  <Flex
                    align="center"
                    gap={4}
                    p={4}
                    m={3}
                    bg={itemBg}
                    borderRadius="xl"
                    flex={1}
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
                  >
                    <Icon as={MdPerson} boxSize={6} color={iconColor} />
                    <Box flex={1}>
                      <Text fontSize="xs" color={labelColor} mb={1}>
                        الاسم
                      </Text>
                      <Text fontSize="md" fontWeight="bold" color={useColorModeValue("gray.800", "white")}>
                        {student.name}
                      </Text>
                    </Box>
                  </Flex>

                  {/* Package Type */}
                  {isRequest && (
                    <Flex
                      align="center"
                      gap={4}
                      p={4}
                      m={3}
                      bg={itemBg}
                      borderRadius="xl"
                      minW={{ base: "auto", md: "220px" }}
                      boxShadow="sm"
                      transition="all 0.2s"
                      _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
                    >
                      <Icon as={MdPeople} boxSize={6} color={iconColor} />
                      <Box>
                        <Text fontSize="xs" color={labelColor} mb={1}>
                          نوع الاشتراك
                        </Text>
                        <Badge
                          px={4}
                          py={1}
                          borderRadius="full"
                          fontSize="sm"
                          fontWeight="bold"
                          bg={
                            student.packageType === "مميزة"
                              ? "purple.100"
                              : "blue.100"
                          }
                          color={
                            student.packageType === "مميزة"
                              ? "purple.600"
                              : "blue.600"
                          }
                        >
                          {student.packageType}
                        </Badge>
                      </Box>
                    </Flex>
                  )}
                </Flex>

                {/* PHONE + EMAIL */}
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  
                  {/* Phone */}
                  <Flex
                    align="center"
                    gap={4}
                    p={4}
                    m={3}
                    bg={itemBg}
                    borderRadius="xl"
                    flex={1}
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
                  >
                    <Icon as={MdPhone} boxSize={5} color={iconColor} />
                    <Box flex={1}>
                      <Text fontSize="xs" color={labelColor} mb={1}>
                        رقم الهاتف
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="semibold"
                        dir="ltr"
                        textAlign="right"
                        color={useColorModeValue("gray.800", "white")}
                      >
                        {student.phone}
                      </Text>
                    </Box>
                  </Flex>

                  {/* Email */}
                  <Flex
                    align="center"
                    gap={4}
                    p={4}
                    m={3}
                    bg={itemBg}
                    borderRadius="xl"
                    flex={1}
                    boxShadow="sm"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
                  >
                    <Icon as={MdEmail} boxSize={5} color={iconColor} />
                    <Box flex={1}>
                      <Text fontSize="xs" color={labelColor} mb={1}>
                        البريد الإلكتروني
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="semibold"
                        wordBreak="break-word"
                        color={useColorModeValue("gray.800", "white")}
                      >
                        {student.email}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>

                {/* STATUS SECTION */}
                <Box
                  p={5}
                  m={3}
                  borderRadius="xl"
                  bg={isActive ? "grey.200" : "grey.200"}
                  border="1px solid"
                  borderColor={isActive ? "green.200" : "red.200"}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Icon
                        as={isActive ? MdCheckCircle : MdCancel}
                        boxSize={6}
                        color={isActive ? "green.500" : "red.500"}
                      />
                      <Box>
                        <Text fontSize="xs" color={labelColor} mb={1}>
                          الحالة
                        </Text>
                        <Text fontWeight="bold" fontSize="md" color={useColorModeValue("gray.800", "white")}>
                          {isActive ? "نشط" : "غير نشط"}
                        </Text>
                      </Box>
                    </Flex>

                    <StatusButton
                      status={
                        isRequest
                          ? student.accountStatus
                          : student.status
                      }
                      onToggle={() => onToggleStatus(student.id)}
                    />
                  </Flex>
                </Box>
              </VStack>
            )}
          </DialogBody>

          {/* ================= FOOTER ================= */}
          <DialogFooter
            px={6}
            py={4}
            borderTop="1px solid"
            borderColor="gray.200"
            bg={useColorModeValue("gray.50", "gray.900")}
          >
            <DialogActionTrigger>
              <Button
                bg="blue.500"
                color="white"
                borderRadius="full"
                px={6}
                _hover={{ bg: "blue.600" }}
              >
                إغلاق
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

const StudentCard = ({ student, onToggleStatus, isRequest = false, onRowClick }) => {
    if (isRequest) {
        return (
            <Grid
                templateColumns={GRID_TEMPLATE_REQUESTS}
                gap={{ base: 2, md: 2 }}
                px={{ base: 2, md: 4 }}
                py={{ base: 3, md: 3 }}
                borderBottom="1px solid"
                borderColor={useColorModeValue("gray.200","gray.400")}
                _hover={{ bg: useColorModeValue("gray.100","gray.700"), cursor: "pointer" }}
                transition="all 0.2s"
                alignItems="center"
                w={'100%'}
                onClick={() => onRowClick(student)}
            >
                {/* Name */}
                <TruncatedText fontWeight="bold" color={useColorModeValue("gray.500","gray.300")}>{student.name}</TruncatedText>
                
                {/* Phone - Hidden on mobile */}
                <Box display={{ base: "none", md: "block" }}>
                    <TruncatedText color={useColorModeValue("gray.700","gray.400")} textAlign="center" dir="ltr">
                        {student.phone}
                    </TruncatedText>
                </Box>
                
                {/* Email - Hidden on mobile */}
                <Box display={{ base: "none", md: "block" }}>
                    <TruncatedText color={useColorModeValue("gray.500","gray.300")}>
                        {student.email}
                    </TruncatedText>
                </Box>
                
                {/* Package Type */}
                {(() => {
                    const bgLight = student.packageType === "مميزة" ? "#F3E8FF" : student.packageType === "بريميم" ? "#f4ebfc" : "#E0F2FE";
                    const bgDark = student.packageType === "مميزة" ? "#6B21A8" : student.packageType === "بريميم" ? "#FF4466" : "#0284C7";
                    const colorLight = student.packageType === "مميزة" ? "#9333EA" : student.packageType === "بريميم" ? "#895fb0" : "#0284C7";
                    const colorDark = student.packageType === "مميزة" ? "#E9D5FF" : student.packageType === "بريميم" ? "#EDE9FE" : "#ffffff";
                    const pkgBg = useColorModeValue(bgLight, bgDark);
                    const pkgColor = useColorModeValue(colorLight, colorDark);
                    return (
                        <Badge
                            bg={pkgBg}
                            color={pkgColor}
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize={{ base: "8px", md: "10px" }}
                            fontWeight="bold"
                            textAlign="center"
                            minW={{ base: "50px", md: "60px" }} 
                            justifySelf="center"
                        >
                            {student.packageType}
                        </Badge>
                    );
                })()}
                
                {/* Status Button */}
                <StatusButton
                    status={student.accountStatus}
                    onToggle={() => onToggleStatus(student.id)}
                />
            </Grid>
        );
    }

    return (
        <Grid
            templateColumns={GRID_TEMPLATE_REGISTERED}
            gap={{ base: 2, md: 2 }}
            px={{ base: 2, md: 4 }}
            py={3}
            borderBottom="1px solid"
            borderColor={useColorModeValue("gray.200","gray.400")}
            _hover={{ bg: useColorModeValue("gray.100","gray.700"), cursor: "pointer" }}
            transition="all 0.2s"
            alignItems="center"
            onClick={() => onRowClick(student)}
        >
            {/* Name */}
            <TruncatedText fontWeight="bold" color={useColorModeValue("gray.500","gray.300")}>
                {student.name}
            </TruncatedText>
            
            {/* Phone - Hidden on mobile */}
            <Box display={{ base: "none", md: "block" }}>
                <TruncatedText color={useColorModeValue("gray.700","gray.400")} textAlign="center" dir="ltr">
                    {student.phone}
                </TruncatedText>
            </Box>
            
            {/* Email - Hidden on mobile */}
            <Box display={{ base: "none", md: "block" }}>
                <TruncatedText color={useColorModeValue("gray.500","gray.300")}>
                    {student.email}
                </TruncatedText>
            </Box>
            
            {/* Status Button */}
            <StatusButton
                status={student.status}
                onToggle={() => onToggleStatus(student.id)}
            />
            
            {/* Delete Button */}
            <Button
                size="xs"
                minW={{ base: "60px", md: "90px" }} 
                fontSize={{ base: "9px", md: "11px" }}
                height={{ base: "24px", md: "28px" }}
                px={{ base: 2, md: 3 }}
                variant="outline"
                color="#EF4444"
                borderColor="#EF4444"
                borderRadius="full"
                py={0}
                fontWeight="bold"
                onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                }}
                _hover={{
                    bg: "#FEF2F2",
                    transform: "scale(1.05)",
                    borderColor: "#DC2626"
                }}
                _active={{
                    transform: "scale(0.95)"
                }}
                transition="all 0.2s"
                leftIcon={<Icon as={MdArrowBack} boxSize={{ base: 3, md: 3 }} />}
                iconSpacing={1}
                justifySelf="center"
            >
                طرد
            </Button>
        </Grid>
    );
};

const ColumnHeaders = ({ isRequest = false }) => {
    const headers = isRequest
        ? { 
            base: ["الاسم", "نوع الاشتراك", "الحالة"],
            md: ["الاسم", "رقم الهاتف", "الايميل", "نوع الاشتراك", "الحالة"]
          }
        : { 
            base: ["الاسم", "الحالة", ""],
            md: ["الاسم", "رقم الهاتف", "الايميل", "الحالة", ""]
          };

    return (
        <Grid
            templateColumns={isRequest ? GRID_TEMPLATE_REQUESTS : GRID_TEMPLATE_REGISTERED}
            gap={{ base: 5, md: 2 }}
            px={{ base: 2, md: 4 }}            
            py={2}
            alignItems="center"
            color={useColorModeValue("#00A3E0","#6ac8ff")}
            borderBottom={`2px solid ${useColorModeValue("#39393934","#ffffff22")}`}
            mb={2}
        >
            {/* Mobile headers */}
            <Box display={{ base: "contents", md: "none" }} as={Grid} templateColumns={isRequest ? GRID_TEMPLATE_REQUESTS.base : GRID_TEMPLATE_REGISTERED.base} gap={2} gridColumn="1 / -1">
                {headers.base.map((text, idx) => (
                    <Text
                        key={idx}
                        fontSize="9px"
                        fontWeight="bold"
                        color={useColorModeValue("gray.500","gray.300")}
                        textAlign="center"
                        letterSpacing="wide"
                        px={2}
                    >
                        {text}
                    </Text>
                ))}
            </Box>
            
            {/* Desktop headers */}
            <Box display={{ base: "none", md: "contents" }}>
                {headers.md.map((text, idx) => (
                    <Text
                        key={idx}
                        fontSize="xs"
                        fontWeight="bold"
                        color={useColorModeValue("gray.500","gray.300")}
                        textAlign="center"
                        letterSpacing="wide"
                        px={2}
                    >
                        {text}
                    </Text>
                ))}
            </Box>
        </Grid>
    );
};

const SectionHeader = ({ title, count }) => {
    const hdrColor = useColorModeValue("gray.800", "gray.200");
    const hdrBadgeBg = useColorModeValue("#00A3E0", "#257BA3");
    const iconColor = useColorModeValue("black", "white");

    return (
        <Flex mb={4} justifyContent="flex-start" alignItems="center" gap={3}>
            <Box p={2} display="flex" alignItems="center" justifyContent="center">
                <MdPeople size={24} color={iconColor} />
                <Text
                    fontWeight="bold"
                    textAlign="right"
                    fontSize={{ base: "sm", md: "lg" }}
                    color={hdrColor}
                    mr={2}
                >
                    {title}
                </Text>
            </Box>
            <Badge
                bg={hdrBadgeBg}
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontWeight="bold"
                minW={{ base: "60px", md: "60px" }} 
                fontSize={{ base: "10px", md: "11px" }}
            >
                {count} {title.includes("طلاب") ? "طلاب" : "طالب"}
            </Badge>
        </Flex>
    );
};

export default function StudentsManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [registeredStudents, setRegisteredStudents] = useState(registeredStudentsData);
    const [subscriptionRequests, setSubscriptionRequests] = useState(subscriptionRequestsData);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("registered"); // "registered" or "request"

    // color mode values
    const textColor = useColorModeValue("gray.800", "gray.200");
    const cardBg = useColorModeValue("white", "gray.700");
    const searchBg = useColorModeValue("white", "gray.700");
    const searchBorder = useColorModeValue("#00A3E0", "#00A3E0");

    // Sort students alphabetically by name using localeCompare for Arabic support
    const sortedRegisteredStudents = useMemo(() => {
        return [...registeredStudents].sort((a, b) => 
            a.name.localeCompare(b.name, "ar")
        );
    }, [registeredStudents]);

    const sortedSubscriptionRequests = useMemo(() => {
        return [...subscriptionRequests].sort((a, b) => 
            a.name.localeCompare(b.name, "ar")
        );
    }, [subscriptionRequests]);

    // Filter students based on search query - case insensitive
    const filteredRegisteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return sortedRegisteredStudents;
        const query = searchQuery.toLowerCase();
        return sortedRegisteredStudents.filter(student => 
            student.name.toLowerCase().includes(query) ||
            student.phone.includes(query) ||
            student.email.toLowerCase().includes(query)
        );
    }, [sortedRegisteredStudents, searchQuery]);

    const filteredSubscriptionRequests = useMemo(() => {
        if (!searchQuery.trim()) return sortedSubscriptionRequests;
        const query = searchQuery.toLowerCase();
        return sortedSubscriptionRequests.filter(student => 
            student.name.toLowerCase().includes(query) ||
            student.phone.includes(query) ||
            student.email.toLowerCase().includes(query) ||
            student.packageType.toLowerCase().includes(query)
        );
    }, [sortedSubscriptionRequests, searchQuery]);

    const handleToggleRegisteredStatus = (id) => {
        setRegisteredStudents(prev => prev.map(student => {
            if (student.id === id) {
                const newStudent = {
                    ...student,
                    status: student.status === "مدفوع" ? "غير مدفوع" : "مدفوع"
                };
                // Update selected student if it's the same one
                if (selectedStudent?.id === id) {
                    setSelectedStudent(newStudent);
                }
                return newStudent;
            }
            return student;
        }));
    };

    const handleToggleRequestStatus = (id) => {
        setSubscriptionRequests(prev => prev.map(student => {
            if (student.id === id) {
                const newStudent = {
                    ...student,
                    accountStatus: student.accountStatus === "مفعل" ? "غير مفعل" : "مفعل"
                };
                // Update selected student if it's the same one
                if (selectedStudent?.id === id) {
                    setSelectedStudent(newStudent);
                }
                return newStudent;
            }
            return student;
        }));
    };

    const handleRowClick = (student, type) => {
        // Only open dialog on mobile screens
        if (window.innerWidth < 768) {
            setSelectedStudent(student);
            setDialogType(type);
            setIsDialogOpen(true);
        }
    };

    return (
        <Box minH="100vh" bg="bg.canvas" dir="rtl">
            <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 4 }}  color={textColor}>
              {/* Responsive Enhanced Search Bar */}
                <Box
                  w="100%"
                  maxW={{ base: "100%", sm: "90%", md: "600px" }}
                  mx="auto"
                  mb={{ base: 6, md: 10 }}
                  px={{ base: 3, md: 4 }}
                >
                  <Flex
                    bg={searchBg}
                    borderRadius={{ base: "4xl", md: "4xl" }}
                    px={{ base: 3, md: 5 }}
                    py={{ base: 2.5, md: 3 }}
                    boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                    border="2px solid"
                    borderColor={searchQuery ? searchBorder : "transparent"}
                    transition="all 0.3s"
                    align="center"
                    gap={{ base: 2, md: 3 }}
                  >
                    {/* Search Icon */}
                    <Box
                      p={{ base: 1, md: 2 }}
                      flexShrink={0}
                    >
                      <MdSearch size={18} color="#00A3E0" />
                    </Box>
                    
                    {/* Input */}
                    <Input
                      placeholder="ابحث عن طالب بالاسم أو رقم الهاتف أو البريد الإلكتروني..."
                      bg="transparent"
                      border="none"
                      textAlign="right"
                      fontSize={{ base: "xs", sm: "sm" }}
                      color={textColor}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
                      _focus={{ outline: "none" }}
                      flex="1"
                      minW={0}   // prevents overflow
                    />
                
                    {/* Results Count */}
                    {searchQuery && (
                      <Text
                        fontSize={{ base: "10px", sm: "xs" }}
                        color={useColorModeValue("gray.500", "gray.400")}
                        whiteSpace="nowrap"
                        flexShrink={0}
                        display={{ base: "none", sm: "block" }} // hide on very small screens
                      >
                        {filteredRegisteredStudents.length +
                          filteredSubscriptionRequests.length} نتيجة
                      </Text>
                    )}
                  </Flex>
                </Box>

                {/* Registered Students Section */}
                <Box 
                    bg={cardBg} 
                    borderRadius="3xl" 
                    p={{ base: 4, md: 6 }}
                    mb={8}
                    mx={{ base: 0, md: 8 }}
                    boxShadow="0 4px 24px rgba(0,0,0,0.06)"
                    overflowX="hidden"
                >
                    <SectionHeader 
                        title="طلاب السنتر المسجلين" 
                        count={filteredRegisteredStudents.length}
                    />
                    <Box w="100%">
                        <ColumnHeaders isRequest={false} />
                        <VStack align="stretch" gap={0}>
                            {filteredRegisteredStudents.length > 0 ? (
                                filteredRegisteredStudents.map((student) => (
                                    <StudentCard 
                                        key={student.id}
                                        student={student}
                                        onToggleStatus={handleToggleRegisteredStatus}
                                        isRequest={false}
                                        onRowClick={(s) => handleRowClick(s, "registered")}
                                    />
                                ))
                            ) : (
                                <Text textAlign="center" py={8} color="gray.400">
                                    لا يوجد طلاب مسجلين مطابقين للبحث
                                </Text>
                            )}
                        </VStack>
                    </Box>
                </Box>

                {/* Subscription Requests Section */}
                <Box 
                    bg={cardBg} 
                    borderRadius="3xl" 
                    p={{ base: 4, md: 6 }}
                    boxShadow="0 4px 24px rgba(0,0,0,0.06)"
                    overflowX="hidden"
                    mx={{ base: 0, md: 8 }}
                >
                    <SectionHeader 
                        title="الطلاب المسجلين" 
                        count={filteredSubscriptionRequests.length}
                    />
                    <Box w="100%">
                        <ColumnHeaders isRequest={true} />
                        <VStack align="stretch" gap={0}>
                            {filteredSubscriptionRequests.length > 0 ? (
                                filteredSubscriptionRequests.map((student) => (
                                    <StudentCard 
                                        key={student.id}
                                        student={student}
                                        onToggleStatus={handleToggleRequestStatus}
                                        isRequest={true}
                                        onRowClick={(s) => handleRowClick(s, "request")}
                                    />
                                ))
                            ) : (
                                <Text textAlign="center" py={8} color="gray.400">
                                    لا يوجد طلبات اشتراك مطابقة للبحث
                                </Text>
                            )}
                        </VStack>
                    </Box>
                </Box>
            </Container>

            {/* Student Details Dialog */}
            <StudentDetailsDialog
                student={selectedStudent}
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setSelectedStudent(null);
                }}
                onToggleStatus={dialogType === "registered" ? handleToggleRegisteredStatus : handleToggleRequestStatus}
                isRequest={dialogType === "request"}
            />
        </Box>
    );
}