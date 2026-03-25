
"use client"
import {useState, useEffect} from "react";
import {
  Box, HStack, VStack, Text, Input, Flex,
  Badge, Spinner, Center, Icon, Button
} from "@chakra-ui/react";
import {
  MdSend, MdEdit, MdDelete, MdCheckCircle, MdPerson, MdChat, MdClose
} from "react-icons/md";
import {
  DialogRoot, DialogContent, DialogHeader, DialogBody,
  DialogFooter, DialogTitle, DialogActionTrigger,
} from "@/components/ui/dialog";

import {rtdb, auth} from "@/auth/firebase";
import {ref, onValue, remove, set} from "firebase/database";

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
  const SPLITTER = "//$%";

  useEffect(() => {
    if (!user) return;
    const userRef = ref(rtdb, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setStudentData(data);
        if (data.subscriptions) {
          const subsArray = Object.entries(data.subscriptions)
            .map(([id, val]) => ({id, ...val}))
            .filter(sub => sub.type === "teacher");
          setMyTeachers(subsArray);
          if (subsArray.length > 0 && !selectedTeacher) {
            setSelectedTeacher(subsArray[0]);
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!studentData || !selectedTeacher) return;
    const sectionId = `sec${studentData.academicYear}`;
    const messagesRef = ref(rtdb, `teachers/${selectedTeacher.teacherId}/communities/${sectionId}`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.entries(data).map(([id, val]) => {
          const parts = val.split(SPLITTER);
          return {
            id,
            text: parts[0] || "",
            senderName: parts[1] || "",
            senderRole: parts[2] || "",
            senderId: parts[3] || "",
            replyToText: parts[4] === "none" ? null : parts[4],
            replyToName: parts[5] === "none" ? null : parts[5],
            timestamp: parseInt(id)
          };
        });
        setMessages(loaded.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [studentData, selectedTeacher]);

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedTeacher || !studentData) return;
    const sectionId = `sec${studentData.academicYear}`;
    const timestamp = Date.now();
    const msgRef = ref(rtdb, `teachers/${selectedTeacher.teacherId}/communities/${sectionId}/${timestamp}`);

    const combinedValue = `${inputText}${SPLITTER}${studentData.fullName}${SPLITTER}student${SPLITTER}${user.uid}${SPLITTER}none${SPLITTER}none`;

    await set(msgRef, combinedValue);
    setInputText("");
  };

  const saveEdit = async (msgId) => {
    if (!editText.trim() || !selectedTeacher || !studentData) return;

    const sectionId = `sec${studentData.academicYear}`;
    const msgRef = ref(rtdb, `teachers/${selectedTeacher.teacherId}/communities/${sectionId}/${msgId}`);

    const updatedValue = `${editText}${SPLITTER}${studentData.fullName}${SPLITTER}student${SPLITTER}${user.uid}${SPLITTER}none${SPLITTER}none`;

    await set(msgRef, updatedValue);
    setEditingId(null);
    setEditText("");
  };

  const confirmDelete = () => {
    if (idToDelete && selectedTeacher && studentData) {
      const sectionId = `sec${studentData.academicYear}`;
      remove(ref(rtdb, `teachers/${selectedTeacher.teacherId}/communities/${sectionId}/${idToDelete}`));
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) return <Center h="88vh"><Spinner color="blue.500" size="xl" /></Center>;

  return (
    <Flex h="88vh" dir="rtl" gap={4} p={{base: 2, md: 4}} direction={{base: "column", md: "row"}}>
      <VStack w={{base: "100%", md: "280px"}} bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border.subtle" p={3} align="stretch" shadow="sm">
        <Text fontWeight="bold" mb={4} color="blue.500" px={2}>مدرسيني</Text>
        {myTeachers.map((t) => (
          <HStack key={t.id} p={3} cursor="pointer" borderRadius="xl" bg={selectedTeacher?.id === t.id ? "blue.50" : "transparent"} onClick={() => setSelectedTeacher(t)} _hover={{bg: "gray.50"}}>
            <Center w="40px" h="40px" bg={selectedTeacher?.id === t.id ? "blue.500" : "gray.200"} borderRadius="full">
              <Icon as={MdPerson} color={selectedTeacher?.id === t.id ? "white" : "gray.500"} />
            </Center>
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="sm" color={selectedTeacher?.id === t.id ? "blue.700" : "fg.muted"}>{t.teacherName}</Text>
              <Text fontSize="10px" color="gray.500">{t.subject}</Text>
            </VStack>
          </HStack>
        ))}
      </VStack>

      <Flex flex={1} bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border.subtle" direction="column" overflow="hidden" shadow="md">
        <Box p={4} borderBottom="1px solid" borderColor="border.subtle" bg="bg.subtle">
          <HStack justify="space-between">
            <HStack><Icon as={MdChat} color="blue.500" /><Text color="fg.muted" fontWeight="bold">شات أ / {selectedTeacher?.teacherName}</Text></HStack>
            <Badge variant="solid" bg="blue.500" p={2} borderRadius="lg">{selectedTeacher?.subject}</Badge>
          </HStack>
        </Box>

        <VStack flex={1} p={4} overflowY="auto" bg="bg.canvas" spacing={4} align="stretch">
          {messages.map((msg) => (
            <Flex key={msg.id} direction="column" alignSelf={msg.senderId === user?.uid ? "flex-end" : "flex-start"} maxW="85%">
              <Text fontSize="10px" fontWeight="bold" color={msg.senderRole === "teacher" ? "orange.500" : "blue.600"} mb={1} mr={2}>
                {msg.senderRole === "teacher" ? `أ / ${msg.senderName}` : (msg.senderId === user?.uid ? "أنت" : msg.senderName)}
              </Text>

              <Box p={3} borderRadius="2xl" bg={msg.senderRole === "teacher" ? "gray.700" : (msg.senderId === user?.uid ? "blue.500" : "white")} color={msg.senderId === user?.uid || msg.senderRole === "teacher" ? "white" : "black"} shadow="sm" border="1px solid" borderColor="gray.100" borderBottomRightRadius={msg.senderId === user?.uid ? "0" : "2xl"} borderBottomLeftRadius={msg.senderRole === "teacher" ? "0" : "2xl"}>

                {msg.replyToText && (
                  <Box bg="blackAlpha.300" p={2} borderRadius="lg" mb={2} fontSize="xs" borderRight="3px solid" borderColor="orange.300">
                    <Text fontWeight="bold" opacity={0.9}>رد على {msg.replyToName}:</Text>
                    <Text noOfLines={1}>{msg.replyToText}</Text>
                  </Box>
                )}

                {editingId === msg.id ? (
                  <HStack gap={2}>
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      size="sm"
                      bg="white"
                      color="black"
                      borderRadius="md"
                      autoFocus
                    />
                    <MdCheckCircle size="17px" color="blue" cursor="pointer" onClick={() => saveEdit(msg.id)} />
                    <MdClose size="17px" color="red" cursor="pointer" onClick={() => setEditingId(null)} />
                  </HStack>
                ) : (
                  <>
                    <Text fontSize="sm" whiteSpace="pre-wrap">{msg.text}</Text>
                    <HStack mt={1} justify="flex-end" spacing={2}>
                      {msg.senderId === user?.uid && (
                        <>
                          <MdEdit size="17px" cursor="pointer" color="blue" opacity={0.7} onClick={() => {setEditingId(msg.id); setEditText(msg.text);}} />
                          <MdDelete size="17px" cursor="pointer" color="red" onClick={() => {setIdToDelete(msg.id); setIsDeleteDialogOpen(true)}} />
                        </>
                      )}
                    </HStack>
                  </>
                )}
              </Box>
              <Text fontSize="10px" opacity={0.6} mt={1}>{new Date(msg.timestamp).toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</Text>
            </Flex>
          ))}
        </VStack>

        <Box p={4} bg="bg.subtle" borderTop="1px solid" borderColor="border.subtle">
          <HStack gap={2}>
            <Input placeholder="اكتب سؤالك هنا..." value={inputText} onChange={(e) => setInputText(e.target.value)} maxLength={MAX_CHARS} borderRadius="xl" bg="bg.muted" p={4} isDisabled={!selectedTeacher} />
            <MdSend onClick={sendMessage} style={{transform: "rotate(180deg)", fontSize: "30px", color: "blue", cursor: "pointer"}} />
          </HStack>
          <HStack justify="end" px={2}>
            <Text fontSize="10px" color="gray.500">
              {inputText.length} / {MAX_CHARS - inputText.length}
            </Text>
          </HStack>
        </Box>
      </Flex>

      <DialogRoot open={isDeleteDialogOpen} onOpenChange={(e) => setIsDeleteDialogOpen(e.open)} placement="center">
        <DialogContent dir="rtl" borderRadius="2xl" p="10px">
          <DialogHeader><DialogTitle color="fg.muted">حذف السؤال</DialogTitle></DialogHeader>
          <DialogBody><Text color="fg.muted">هل تريد حذف سؤالك نهائياً؟</Text></DialogBody>
          <DialogFooter gap={3}>
            <DialogActionTrigger asChild><Button variant="outline">إلغاء</Button></DialogActionTrigger>
            <Button bg="red.500" color="white" onClick={confirmDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
}