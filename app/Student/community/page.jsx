

"use client"
import { useState, useEffect } from "react";
import { 
    Box, HStack, VStack, Text, Input, Flex, 
    IconButton, Badge, Spinner, Center, Icon, Button 
} from "@chakra-ui/react";
import { 
    MdSend, MdEdit, MdDelete, MdCheck, MdClose, MdPerson, MdChat
} from "react-icons/md";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogTitle,
    DialogActionTrigger,
} from "@/components/ui/dialog"; 

import { rtdb, auth } from "@/auth/firebase"; 
import { ref, push, onValue, remove, update, serverTimestamp, get } from "firebase/database";

export default function StudentCommunity() {
    const [myTeachers, setMyTeachers] = useState([]); 
    const [selectedTeacher, setSelectedTeacher] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const user = auth.currentUser;
    const MAX_CHARS = 5000;

    useEffect(() => {
        if (!user) return;

        get(ref(rtdb, `users/${user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) setStudentData(snapshot.val());
        });

        const subRef = ref(rtdb, `subscriptions/${user.uid}`);
        onValue(subRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const teachersList = Object.entries(data).map(([id, val]) => ({ id, ...val }));
                setMyTeachers(teachersList);
                if (teachersList.length > 0 && !selectedTeacher) {
                    setSelectedTeacher(teachersList[0]);
                }
            }
            setLoading(false);
        });
    }, [user]);

    useEffect(() => {
        if (!studentData || !selectedTeacher) return;

        const messagesRef = ref(rtdb, "community_messages");
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loaded = data ? Object.entries(data).map(([id, val]) => ({ id, ...val })) : [];
            
            const filtered = loaded.filter(m => 
                m.teacherId === selectedTeacher.id && 
                m.academicStage === studentData.academicStage && 
                m.academicYear === studentData.academicYear
            );

            setMessages(filtered.sort((a, b) => a.timestamp - b.timestamp));
        });
        return () => unsubscribe();
    }, [studentData, selectedTeacher]);

    const sendMessage = async () => {
        if (!inputText.trim() || !selectedTeacher || !studentData) return;
        
        const messagesRef = ref(rtdb, "community_messages");
        await push(messagesRef, {
            text: inputText,
            senderId: user?.uid,
            senderName: studentData.fullName,
            senderRole: "student",
            teacherId: selectedTeacher.id,
            academicStage: studentData.academicStage,
            academicYear: studentData.academicYear,
            timestamp: serverTimestamp(),
        });
        setInputText("");
    };

    const confirmDelete = () => {
        if (idToDelete) {
            remove(ref(rtdb, `community_messages/${idToDelete}`));
            setIsDeleteDialogOpen(false);
            setIdToDelete(null);
        }
    };

    if (loading) return <Center h="88vh"><Spinner color="blue.500" size="xl" /></Center>;

    return (
        <Flex h="88vh" dir="rtl" gap={4} p={{ base: 2, md: 4 }} direction={{ base: "column", md: "row" }}>
            
            <VStack w={{ base: "100%", md: "280px" }} bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border.subtle" p={3} align="stretch" shadow="sm">
                <Text fontWeight="bold" mb={4} color="blue.500" px={2}>مدرسيني</Text>
                {myTeachers.length === 0 ? (
                    <Text fontSize="xs" color="fg.muted" textAlign="center">لم تشترك مع أي مدرس بعد</Text>
                ) : (
                    myTeachers.map((t) => (
                        <HStack 
                            key={t.id} p={3} cursor="pointer" borderRadius="xl"
                            bg={selectedTeacher?.id === t.id ? "bg.muted" : "transparent"}
                            border={selectedTeacher?.id === t.id ? "1px solid" : "1px solid transparent"}
                            borderColor="blue.200"
                            onClick={() => setSelectedTeacher(t)}
                            transition="0.2s"
                            _hover={{ bg: "gray.50" }}
                        >
                            <Center w="40px" h="40px" bg="blue.500" borderRadius="full">
                                <Icon as={MdPerson} color="white" />
                            </Center>
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="bold" fontSize="sm" color="fg.muted">{t.teacherName}</Text>
                                <Text fontSize="10px" color="gray.500">{t.subject}</Text>
                            </VStack>
                        </HStack>
                    ))
                )}
            </VStack>

            <Flex flex={1} bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border.subtle" direction="column" overflow="hidden" shadow="md">
                <Box p={4} borderBottom="1px solid" borderColor="border.subtle" bg="bg.subtle">
                    <HStack>
                        <Icon as={MdChat} color="blue.500" />
                        <Text color="fg.muted">شات أ /  {selectedTeacher?.teacherName || "المدرس"}</Text>
                        <Badge variant="subtle" colorScheme="blue" p={2}>{selectedTeacher?.subject}</Badge>
                    </HStack>
                </Box>

                <VStack flex={1} p={4} overflowY="auto" bg="bg.canvas" spacing={4} align="stretch">
                    {messages.map((msg) => (
                        <Flex key={msg.id} direction="column" alignSelf={msg.senderId === user?.uid ? "flex-end" : "flex-start"} maxW="80%">
                            <Text fontSize="10px" fontWeight="bold" color={msg.senderRole === "teacher" ? "orange.500" : "blue.600"} mb={1} mr={2}>
                                {msg.senderRole === "teacher" ? `أ /  ${msg.senderName}` : msg.senderName}
                            </Text>

                            <Box p={3} borderRadius="2xl" 
                                bg={msg.senderRole === "teacher" ? "blue.600" : (msg.senderId === user?.uid ? "blue.500" : "white")} 
                                color={msg.senderId === user?.uid || msg.senderRole === "teacher" ? "white" : "black"} 
                                shadow="sm" border="1px solid" borderColor="gray.100"
                                borderBottomRightRadius={msg.senderId === user?.uid ? "0" : "2xl"}
                            >
                                <Text fontSize="sm" whiteSpace="pre-wrap">{msg.text}</Text>
                                
                                <HStack mt={1} justify="flex-end">
                                    {msg.senderId === user?.uid && (
                                        <MdDelete size="20px" cursor="pointer" color="red" onClick={() => {setIdToDelete(msg.id); setIsDeleteDialogOpen(true)}} />
                                    )}
                                </HStack>
                            </Box>
                        </Flex>
                    ))}
                </VStack>

                <Box p={4} bg="bg.subtle" borderTop="1px solid" borderColor="border.subtle">
                    <HStack gap={2}>
                        <Input 
                            placeholder="اكتب سؤالك هنا..." 
                            value={inputText} 
                            onChange={(e) => setInputText(e.target.value)} 
                            maxLength={MAX_CHARS} 
                            borderRadius="xl" 
                            bg="bg.muted"
                            p={2}
                        />
                        <MdSend style={{transform: "rotate(180deg)" , color:"blue" , fontSize:"30px"}} onClick={sendMessage} disabled={!selectedTeacher}/>
                    </HStack>
                </Box>
            </Flex>

            <DialogRoot open={isDeleteDialogOpen} onOpenChange={(e) => setIsDeleteDialogOpen(e.open)} placement="center">
                <DialogContent dir="rtl" borderRadius="2xl" p="10px">
                    <DialogHeader><DialogTitle color="fg.muted">حذف الرسالة</DialogTitle></DialogHeader>
                    <DialogBody><Text color="fg.muted">هل تريد حذف سؤالك؟</Text></DialogBody>
                    <DialogFooter gap={3}>
                        <DialogActionTrigger asChild><Button variant="outline" p={2}>إلغاء</Button></DialogActionTrigger>
                        <Button bg="red.500" color="white" onClick={confirmDelete} p={2}>حذف</Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>

        </Flex>
    );
}