

"use client"
import { useState, useEffect } from "react";
import { 
    Box, HStack, VStack, Text, Input, Flex, 
    Badge, Spinner, Center, Icon, Button, IconButton
} from "@chakra-ui/react";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogTitle,
    DialogActionTrigger,
} from "@/components/ui/dialog"; 

import { 
    MdSend, MdReply, MdDelete, MdClose, MdSchool, MdEdit, MdCheckCircle 
} from "react-icons/md";
import { rtdb, auth } from "@/auth/firebase";
import { ref, push, onValue, remove, update, serverTimestamp } from "firebase/database";

export default function TeacherCommunity() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState({ id: "1", name: "الاول اعدادى", stage: "preparatory", year: "1" });
    const [unreadCounts, setUnreadCounts] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const user = auth.currentUser;
    const MAX_CHARS = 5000;

    const levels = [
        { id: "1", name: "الاول اعدادى", stage: "preparatory", year: "1" },
        { id: "2", name: "الثانى اعدادى", stage: "preparatory", year: "2" },
        { id: "3", name: "الثالث اعدادى", stage: "preparatory", year: "3" },
        { id: "4", name: "الأول الثانوي", stage: "secondary", year: "1" },
        { id: "5", name: "الثاني الثانوي", stage: "secondary", year: "2" },
        { id: "6", name: "الثالث الثانوي", stage: "secondary", year: "3" },
    ];

    useEffect(() => {
        if (!user) return;

        const messagesRef = ref(rtdb, "community_messages");
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loaded = data ? Object.entries(data).map(([id, val]) => ({ id, ...val })) : [];
            
            const myMessages = loaded.filter(m => m.teacherId === user.uid);

            const counts = {};
            myMessages.forEach(m => {
                if (m.senderRole === "student") {
                    const key = `${m.academicStage}-${m.academicYear}`;
                    if (key !== `${selectedLevel.stage}-${selectedLevel.year}`) {
                        counts[key] = (counts[key] || 0) + 1;
                    }
                }
            });
            setUnreadCounts(counts);

            const currentLevelMessages = myMessages.filter(m => 
                m.academicStage === selectedLevel.stage && 
                m.academicYear === selectedLevel.year
            );

            setMessages(currentLevelMessages.sort((a, b) => a.timestamp - b.timestamp));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [selectedLevel, user]);

    const sendMessage = async () => {
        if (!inputText.trim() || !user) return;

        const messagesRef = ref(rtdb, "community_messages");
        await push(messagesRef, {
            text: inputText,
            senderId: user.uid,
            senderName: user.displayName || "المدرس", 
            senderRole: "teacher",
            teacherId: user.uid,
            subjectId: "physics",
            academicStage: selectedLevel.stage,
            academicYear: selectedLevel.year,
            replyTo: replyingTo ? replyingTo.id : null,
            replyToText: replyingTo ? replyingTo.text : null,
            replyToName: replyingTo ? replyingTo.senderName : null,
            timestamp: serverTimestamp(),
        });

        setInputText("");
        setReplyingTo(null);
    };

    const confirmDelete = () => {
        if (idToDelete) {
            remove(ref(rtdb, `community_messages/${idToDelete}`));
            setIsDeleteDialogOpen(false);
            setIdToDelete(null);
        }
    };

    const saveEdit = async (id) => {
        if (editText.length > MAX_CHARS) return;
        await update(ref(rtdb, `community_messages/${id}`), {
            text: editText,
            isEdited: true
        });
        setEditingId(null);
    };

    return (
        <Flex h="88vh" dir="rtl" gap={4} p={{ base: 2, md: 4 }} direction={{ base: "column", md: "row" }}>
            
            {/* Sidebar مع نظام البادج (العدادات) */}
            <VStack w={{ base: "100%", md: "250px" }} bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border.subtle" p={3} align="stretch" shadow="sm">
                <Text fontWeight="bold" mb={4} color="blue.500" fontSize="lg" px={2}>المستويات الدراسية</Text>
                {levels.map((lvl) => {
                    const countKey = `${lvl.stage}-${lvl.year}`;
                    const count = unreadCounts[countKey] || 0;
                    const isActive = selectedLevel.id === lvl.id;

                    return (
                        <HStack 
                            key={lvl.id} p={3} cursor="pointer" borderRadius="xl" justify="space-between"
                            bg={isActive ? "bg.muted" : "transparent"}
                            onClick={() => setSelectedLevel(lvl)}
                            _hover={{ bg: "gray.50" }}
                            transition="0.2s"
                        >
                            <HStack>
                                <Icon as={MdSchool} color={isActive ? "blue" : "fg.muted"}/>
                                <Text fontSize="sm" fontWeight={isActive ? "bold" : "normal"} color={isActive ? "fg.muted" : "fg.muted"}>
                                    {lvl.name}
                                </Text>
                            </HStack>
                            {count > 0 && !isActive && (
                                <Badge borderRadius="full" fontSize="15px" minW="20px">
                                    {count}
                                </Badge>
                            )}
                        </HStack>
                    );
                })}
            </VStack>

            {/* منطقة الشات */}
            <Flex flex={1} bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border.subtle" direction="column" overflow="hidden" shadow="md">
                <Box p={4} borderBottom="1px solid" borderColor="border.subtle" bg="bg.subtle">
                    <HStack justify="space-between">
                        <HStack><Icon as={MdSchool} color="blue.500" /><Text fontWeight="bold" color="fg.muted">شات المستوى  {selectedLevel.name}</Text></HStack>
                    </HStack>
                </Box>

                <VStack flex={1} p={4} overflowY="auto" bg="bg.canvas" spacing={4} align="stretch">
                    {loading ? <Center h="full"><Spinner color="blue.500" /></Center> : (
                        messages.length === 0 ? (
                            <Center h="full"><Text color="fg.muted" fontSize="sm">لا توجد رسائل في هذا المستوى بعد</Text></Center>
                        ) : (
                            messages.map((msg) => (
                                <Flex key={msg.id} direction="column" alignSelf={msg.senderRole === "teacher" ? "flex-end" : "flex-start"} maxW="80%">
                                    {msg.senderRole === "student" && (
                                        <Text fontSize="10px" fontWeight="bold" color="blue.600" mb={1} mr={2}>
                                            {msg.senderName}
                                        </Text>
                                    )}
                                    
                                    <Box p={3} borderRadius="2xl" 
                                        bg={msg.senderRole === "teacher" ? "blue.600" : "white"} 
                                        color={msg.senderRole === "teacher" ? "white" : "black"} 
                                        shadow="sm" border="1px solid" borderColor="gray.100"
                                        borderBottomRightRadius={msg.senderRole === "teacher" ? "0" : "2xl"}
                                    >
                                        {msg.replyToText && (
                                            <Box bg="blackAlpha.200" p={2} borderRadius="lg" mb={2} fontSize="xs" borderRight="4px solid" borderColor="orange.300">
                                                <Text fontWeight="bold" fontSize="10px">{msg.replyToName}</Text>
                                                <Text noOfLines={1}>{msg.replyToText}</Text>
                                            </Box>
                                        )}
                                        
                                        {editingId === msg.id ? (
                                            <Flex alignItems="center" gap={1}>
                                                <Input size="sm" value={editText} onChange={(e) => setEditText(e.target.value)} color="black" bg="white" autoFocus />
                                                <MdCheckCircle onClick={() => saveEdit(msg.id)} style={{ cursor: "pointer", color:"blue" , fontSize:"25px"}} />
                                            </Flex>
                                        ) : (
                                            <Text fontSize="sm" whiteSpace="pre-wrap">{msg.text}</Text>
                                        )}

                                        <HStack mt={2} spacing={2} justify="flex-end">
                                            {msg.senderRole === "student" && <MdReply onClick={() => setReplyingTo(msg)} color={msg.senderRole === "teacher" ? "whiteAlpha.800" : "blue"} cursor="pointer" fontSize="20px" />}
                                            {msg.senderId === user?.uid && (
                                                <>
                                                    <MdEdit onClick={() => { setEditingId(msg.id); setEditText(msg.text); }} style={{ cursor: "pointer" , color:"blue" , fontSize:'20px' }}/>

                                                    <MdDelete onClick={() => { setIdToDelete(msg.id); setIsDeleteDialogOpen(true); }} style={{ cursor: "pointer", color:"red" , fontSize:"20px" }}/>
                                                </>
                                            )}
                                        </HStack>
                                    </Box>
                                    <Text fontSize="9px" color="gray.400" mt={1} mr={1}>
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'}) : ''}
                                    </Text>
                                </Flex>
                            ))
                        )
                    )}
                </VStack>

                <Box p={4} bg="bg.subtle" borderTop="1px solid" borderColor="border.subtle">
                    <VStack align="stretch" spacing={2}>
                        {replyingTo && (
                            <Flex bg="blue.50" p={2} borderRadius="lg" borderRight="4px solid" borderColor="blue.500" justify="space-between" align="center">
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="xs" fontWeight="bold" color="blue.600">الرد على {replyingTo.senderName}</Text>
                                    <Text fontSize="xs" color="gray.600" noOfLines={1}>{replyingTo.text}</Text>
                                </VStack>
                                <Icon as={MdClose} cursor="pointer" onClick={() => setReplyingTo(null)} />
                            </Flex>
                        )}

                        <HStack gap={2}>
                            <Input 
                                placeholder={replyingTo ? "اكتب ردك..." : "اكتب رسالة للمستوى..."}
                                value={inputText} 
                                onChange={(e) => setInputText(e.target.value)} 
                                maxLength={MAX_CHARS} 
                                borderRadius="xl" 
                                bg="bg.muted"
                                p={2}
                            />
                                <MdSend onClick={sendMessage} style={{transform: "rotate(180deg)" , color:"blue" , fontSize:"30px"}} />
                        </HStack>
                    </VStack>
                </Box>
            </Flex>

            <DialogRoot open={isDeleteDialogOpen} onOpenChange={(e) => setIsDeleteDialogOpen(e.open)} placement="center">
                <DialogContent dir="rtl" borderRadius="2xl" p="10px">
                    <DialogHeader><DialogTitle color="fg.muted">حذف الرسالة</DialogTitle></DialogHeader>
                    <DialogBody><Text color="fg.muted">سيتم حذف الرسالة نهائياً من قاعدة البيانات. هل أنت متأكد؟</Text></DialogBody>
                    <DialogFooter gap={3}>
                        <DialogActionTrigger asChild><Button p={2}>إلغاء</Button></DialogActionTrigger>
                        <Button bg="red.500" color="white" onClick={confirmDelete} p={2}>حذف نهائي</Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>

        </Flex>
    );
}