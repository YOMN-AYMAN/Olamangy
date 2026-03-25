

"use client"
import {useState, useEffect} from "react";
import {
  Box, HStack, VStack, Text, Input, Flex,
  Badge, Spinner, Center, Icon, Button
} from "@chakra-ui/react";
import {
  MdSend, MdReply, MdDelete, MdSchool, MdClose, MdEdit, MdCheckCircle
} from "react-icons/md";
import {
  DialogRoot, DialogContent, DialogHeader, DialogBody,
  DialogFooter, DialogTitle, DialogActionTrigger,
} from "@/components/ui/dialog";

import {rtdb, auth} from "@/auth/firebase";
import {ref, onValue, remove, set} from "firebase/database";
import {onAuthStateChanged} from "firebase/auth";

export default function TeacherCommunity() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState({id: "1", name: "الاول اعدادى", stage: "preparatory", year: "1"});
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const SPLITTER = "//$%";
  const MAX_CHARS = 5000;

  const levels = [
    {id: "1", name: "الاول اعدادى", stage: "preparatory", year: "1"},
    {id: "2", name: "الثانى اعدادى", stage: "preparatory", year: "2"},
    {id: "3", name: "الثالث اعدادى", stage: "preparatory", year: "3"},
    {id: "4", name: "الأول الثانوي", stage: "secondary", year: "1"},
    {id: "5", name: "الثاني الثانوي", stage: "secondary", year: "2"},
    {id: "6", name: "الثالث الثانوي", stage: "secondary", year: "3"},
  ];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const sectionId = `sec${selectedLevel.year}`;
    const messagesRef = ref(rtdb, `teachers/${currentUser.uid}/communities/${sectionId}`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.entries(data).map(([id, val]) => {
          const parts = val.split(SPLITTER);
          return {
            id,
            text: parts[0] || "",
            senderName: parts[1] || "مجهول",
            senderRole: parts[2] || "student",
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
      setLoading(false);
    });
    return () => unsubscribe();
  }, [selectedLevel, currentUser]);

  const sendMessage = async () => {
    if (!inputText.trim() || !currentUser) return;
    const sectionId = `sec${selectedLevel.year}`;
    const timestamp = Date.now();
    const msgRef = ref(rtdb, `teachers/${currentUser.uid}/communities/${sectionId}/${timestamp}`);

    const rText = replyingTo ? replyingTo.text.replace(SPLITTER, " ") : "none";
    const rName = replyingTo ? replyingTo.senderName : "none";

    const combinedValue = `${inputText}${SPLITTER}${currentUser.displayName || "المدرس"}${SPLITTER}teacher${SPLITTER}${currentUser.uid}${SPLITTER}${rText}${SPLITTER}${rName}`;

    await set(msgRef, combinedValue);
    setInputText("");
    setReplyingTo(null);
  };

  const saveEdit = async (msgId) => {
    if (!editText.trim() || !currentUser) return;

    const sectionId = `sec${selectedLevel.year}`;
    const msgRef = ref(rtdb, `teachers/${currentUser.uid}/communities/${sectionId}/${msgId}`);

    const oldMsg = messages.find(m => m.id === msgId);
    const rText = oldMsg?.replyToText || "none";
    const rName = oldMsg?.replyToName || "none";

    const updatedValue = `${editText}${SPLITTER}${currentUser.displayName || "المدرس"}${SPLITTER}teacher${SPLITTER}${currentUser.uid}${SPLITTER}${rText}${SPLITTER}${rName}`;

    await set(msgRef, updatedValue);
    setEditingId(null);
    setEditText("");
  };

  const confirmDelete = () => {
    if (idToDelete && currentUser) {
      const sectionId = `sec${selectedLevel.year}`;
      remove(ref(rtdb, `teachers/${currentUser.uid}/communities/${sectionId}/${idToDelete}`));
      setIsDeleteDialogOpen(false);
    }
  };

  if (!currentUser && loading) return <Center h="88vh"><Spinner color="blue.500" /></Center>;

  return (
    <Flex h="88vh" dir="rtl" gap={4} p={{base: 2, md: 4}} direction={{base: "column", md: "row"}}>
      <VStack w={{base: "100%", md: "250px"}} bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border.subtle" p={3} align="stretch" shadow="sm">
        <Text fontWeight="bold" mb={4} color="blue.500" fontSize="lg" px={2}>المستويات الدراسية</Text>
        {levels.map((lvl) => (
          <HStack key={lvl.id} p={3} cursor="pointer" borderRadius="xl" bg={selectedLevel.id === lvl.id ? "blue.50" : "transparent"} onClick={() => setSelectedLevel(lvl)} _hover={{bg: "gray.50"}}>
            <Icon as={MdSchool} color={selectedLevel.id === lvl.id ? "blue.500" : "gray.400"} />
            <Text color="fg.muted" fontSize="sm" fontWeight={selectedLevel.id === lvl.id ? "bold" : "normal"}>{lvl.name}</Text>
          </HStack>
        ))}
      </VStack>

      <Flex flex={1} bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border.subtle" direction="column" overflow="hidden" shadow="md">
        <Box p={4} borderBottom="1px solid" borderColor="border.subtle" bg="bg.subtle">
          <HStack><Icon as={MdSchool} color="blue.500" /><Text fontWeight="bold" color="fg.muted">شات المستوى {selectedLevel.name}</Text></HStack>
        </Box>

        <VStack flex={1} p={4} overflowY="auto" bg="bg.canvas" spacing={4} align="stretch">
          {loading ? <Center h="full"><Spinner color="blue.500" /></Center> : (
            messages.map((msg) => (
              <Flex key={msg.id} direction="column" alignSelf={msg.senderRole === "teacher" ? "flex-end" : "flex-start"} maxW="80%">
                {msg.senderRole === "student" && <Text fontSize="10px" fontWeight="bold" color="blue.600" mb={1} mr={2}>{msg.senderName}</Text>}

                <Box p={3} borderRadius="2xl" bg={msg.senderRole === "teacher" ? "blue.600" : "white"} color={msg.senderRole === "teacher" ? "white" : "black"} shadow="sm" border="1px solid" borderColor="gray.100" borderBottomRightRadius={msg.senderRole === "teacher" ? "0" : "2xl"}>

                  {msg.replyToText && (
                    <Box bg="blackAlpha.200" p={2} borderRadius="lg" mb={2} fontSize="xs" borderRight="4px solid" borderColor="orange.300">
                      <Text fontWeight="bold" fontSize="10px">{msg.replyToName}</Text>
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
                      <MdCheckCircle color="blue" cursor="pointer" size="20px" onClick={() => saveEdit(msg.id)} />

                      <MdClose color="red" cursor="pointer" size="20px" onClick={() => setEditingId(null)} />
                    </HStack>
                  ) : (
                    <>
                      <Text fontSize="sm">{msg.text}</Text>
                      <HStack mt={2} justify="flex-end">
                        {msg.senderRole === "student" && <MdReply onClick={() => setReplyingTo(msg)} color="blue" cursor="pointer" fontSize="20px" />}
                        {msg.senderId === currentUser?.uid && (
                          <>
                            <MdEdit color="blue" fontSize="20px" onClick={() => {setEditingId(msg.id); setEditText(msg.text);}} />

                            <MdDelete color="red" fontSize="20px" onClick={() => {setIdToDelete(msg.id); setIsDeleteDialogOpen(true);}} />
                          </>
                        )}
                      </HStack>
                    </>
                  )}
                </Box>
                <Text fontSize="9px" color="gray.400" mt={1}>{new Date(msg.timestamp).toLocaleTimeString('ar-EG')}</Text>
              </Flex>
            ))
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
              <Input placeholder="اكتب رسالة..." value={inputText} onChange={(e) => setInputText(e.target.value)} borderRadius="xl" bg="bg.muted" />
              <MdSend onClick={sendMessage} style={{transform: "rotate(180deg)", color: "blue", fontSize: "30px", cursor: "pointer"}} />
            </HStack>
            <HStack justify="end" px={2}>
              <Text fontSize="10px" color="gray.500">
                {inputText.length} / {MAX_CHARS - inputText.length}
              </Text>
            </HStack>
          </VStack>
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