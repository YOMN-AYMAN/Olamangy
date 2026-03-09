"use client";
import {
  Box, Text, VStack, HStack, Icon, Input, Button,
  NativeSelect, Badge, Separator,
} from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster";
import React, { useState } from 'react';
import {
  MdAdd, MdDelete, MdCheckCircle, MdRadioButtonUnchecked,
  MdQuiz, MdTimer, MdClose,
} from 'react-icons/md';
import { LuPlus } from 'react-icons/lu';
import { ref, update } from 'firebase/database';
import { rtdb } from "@/auth/firebase";

// ── الأوقات المتاحة للاختبار ─────────────────────────────────────────
const TIME_OPTIONS = [
  { label: "دقيقة واحدة", value: 1 },
  { label: "دقيقتان", value: 2 },
  { label: "3 دقائق", value: 3 },
  { label: "5 دقائق", value: 5 },
  { label: "10 دقائق", value: 10 },
  { label: "15 دقيقة", value: 15 },
  { label: "20 دقيقة", value: 20 },
  { label: "30 دقيقة", value: 30 },
  { label: "45 دقيقة", value: 45 },
  { label: "ساعة كاملة", value: 60 },
];

const COLORS = {
  primary: "rgb(255, 68, 102)",
  primaryHover: "pink.600",
};

// ── نموذج سؤال فارغ ──────────────────────────────────────────────────
const emptyQuestion = () => ({
  id: Date.now() + Math.random(),
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});

// ══════════════════════════════════════════════════════════════════════
function Quiz({ lesson, path, currentPart, teacherId, partIndex }) {
  const [quizTitle, setQuizTitle]             = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [timeLimit, setTimeLimit]             = useState(5);
  const [questions, setQuestions]             = useState([emptyQuestion()]);
  const [isSaving, setIsSaving]               = useState(false);
  const [openQuestion, setOpenQuestion]       = useState(0); // السؤال المفتوح حالياً
  const [openViewQ, setOpenViewQ]             = useState(null); // للعرض

  // ── إضافة سؤال — يفتح الجديد تلقائياً ───────────────────────────
  const addQuestion = () => {
    setQuestions((q) => {
      const updated = [...q, emptyQuestion()];
      setOpenQuestion(updated.length - 1);
      return updated;
    });
  };

  const toggleQuestion = (idx) =>
    setOpenQuestion((prev) => (prev === idx ? null : idx));

  // ── حذف سؤال ──────────────────────────────────────────────────────
  const removeQuestion = (idx) =>
    setQuestions((q) => q.filter((_, i) => i !== idx));

  // ── تعديل نص السؤال ───────────────────────────────────────────────
  const updateQuestionText = (idx, val) =>
    setQuestions((q) =>
      q.map((item, i) => (i === idx ? { ...item, text: val } : item))
    );

  // ── تعديل خيار ──────────────────────────────────────────────────────
  const updateOption = (qIdx, oIdx, val) =>
    setQuestions((q) =>
      q.map((item, i) =>
        i === qIdx
          ? { ...item, options: item.options.map((o, j) => (j === oIdx ? val : o)) }
          : item
      )
    );

  // ── تعيين الإجابة الصحيحة ─────────────────────────────────────────
  const setCorrect = (qIdx, oIdx) =>
    setQuestions((q) =>
      q.map((item, i) => (i === qIdx ? { ...item, correctIndex: oIdx } : item))
    );

  // ── إضافة خيار ──────────────────────────────────────────────────────
  const addOption = (qIdx) =>
    setQuestions((q) =>
      q.map((item, i) =>
        i === qIdx ? { ...item, options: [...item.options, ""] } : item
      )
    );

  // ── حذف خيار ────────────────────────────────────────────────────────
  const removeOption = (qIdx, oIdx) =>
    setQuestions((q) =>
      q.map((item, i) => {
        if (i !== qIdx) return item;
        const newOptions = item.options.filter((_, j) => j !== oIdx);
        const newCorrect =
          item.correctIndex >= newOptions.length
            ? Math.max(0, newOptions.length - 1)
            : item.correctIndex === oIdx
            ? 0
            : item.correctIndex > oIdx
            ? item.correctIndex - 1
            : item.correctIndex;
        return { ...item, options: newOptions, correctIndex: newCorrect };
      })
    );

  // ── الحفظ ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!quizTitle.trim()) {
      toaster.create({ title: "عنوان الاختبار مطلوب", type: "error" });
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        toaster.create({ title: `نص السؤال ${i + 1} مطلوب`, type: "error" });
        return;
      }
      if (questions[i].options.some((o) => !o.trim())) {
        toaster.create({ title: `جميع خيارات السؤال ${i + 1} مطلوبة`, type: "error" });
        return;
      }
    }

    setIsSaving(true);
    try {
      const pageRef = ref(
        rtdb,
        `teachers/${teacherId}/lessons/${path}/${lesson.id}/pages/${partIndex}`
      );
      await update(pageRef, {
        type: "exam",
        title: quizTitle,
        description: quizDescription,
        timeLimit: Number(timeLimit),
        questions: questions.map(({ id, ...rest }) => rest), // بدون id مؤقت
        updatedAt: new Date().toISOString(),
      });
      toaster.create({ title: "تم حفظ الاختبار ✅", type: "success" });
    } catch (err) {
      console.error(err);
      toaster.create({ title: "فشل الحفظ", description: err.message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════
  // وضع العرض — لو الجزء محفوظ
  // ══════════════════════════════════════════════════════════════════
  if (currentPart?.type === "quiz") {
    return (
      <VStack align="stretch" gap={4} dir="rtl" py={2}>
        {/* رأس الاختبار */}
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <VStack align="start" gap={0}>
            <Text fontWeight="extrabold" fontSize="xl" color={COLORS.primary}>
              {currentPart.title}
            </Text>
            {currentPart.description && (
              <Text fontSize="sm" color="gray.500">{currentPart.description}</Text>
            )}
          </VStack>
          <HStack gap={2}>
            <HStack bg="pink.50" _dark={{ bg: "whiteAlpha.100" }} px={3} py={1} borderRadius="full" gap={1}>
              <Icon as={MdTimer} color={COLORS.primary} boxSize={4} />
              <Text fontSize="sm" fontWeight="bold" color={COLORS.primary}>
                {currentPart.timeLimit} دقيقة
              </Text>
            </HStack>
            <Badge colorPalette="pink" variant="subtle" borderRadius="full" px={3}>
              {currentPart.questions?.length} سؤال
            </Badge>
          </HStack>
        </HStack>

        <Separator />

        {/* الأسئلة — accordion */}
        <VStack align="stretch" gap={2}>
          {currentPart.questions?.map((q, qi) => {
            const isOpen = openViewQ === qi;
            return (
              <Box
                key={qi}
                bg="bg.panel"
                border="1px solid"
                borderColor={isOpen ? COLORS.primary : "border.subtle"}
                borderRadius="2xl"
                overflow="hidden"
                transition="border-color 0.2s"
              >
                {/* رأس قابل للنقر */}
                <HStack
                  px={4}
                  py={3}
                  justify="space-between"
                  cursor="pointer"
                  onClick={() => setOpenViewQ(isOpen ? null : qi)}
                  _hover={{ bg: "bg.muted" }}
                  transition="background 0.15s"
                >
                  <HStack gap={3} flex={1} overflow="hidden">
                    <Badge
                      bg={isOpen ? COLORS.primary : "gray.200"}
                      _dark={{ bg: isOpen ? COLORS.primary : "whiteAlpha.200" }}
                      color={isOpen ? "white" : "gray.600"}
                      borderRadius="full"
                      px={2}
                      fontSize="xs"
                      flexShrink={0}
                    >
                      {qi + 1}
                    </Badge>
                    <Text
                      fontSize="sm"
                      fontWeight={isOpen ? "bold" : "medium"}
                      color={isOpen ? COLORS.primary : "fg"}
                      noOfLines={1}
                      flex={1}
                      isTruncated
                    >
                      {q.text || "سؤال بدون نص"}
                    </Text>
                  </HStack>
                  <Icon
                    as={MdCheckCircle}
                    boxSize={4}
                    color="green.400"
                    flexShrink={0}
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                  />
                </HStack>

                {/* محتوى الخيارات */}
                {isOpen && (
                  <Box px={5} pb={4}>
                    <VStack align="stretch" gap={2}>
                      {q.options.map((opt, oi) => (
                        <HStack
                          key={oi}
                          px={4} py={2}
                          borderRadius="xl"
                          bg={oi === q.correctIndex ? "green.50" : "bg.muted"}
                          _dark={{ bg: oi === q.correctIndex ? "whiteAlpha.100" : "whiteAlpha.50" }}
                          border="1px solid"
                          borderColor={oi === q.correctIndex ? "green.300" : "transparent"}
                          gap={3}
                        >
                          <Icon
                            as={oi === q.correctIndex ? MdCheckCircle : MdRadioButtonUnchecked}
                            color={oi === q.correctIndex ? "green.500" : "gray.400"}
                            boxSize={5} flexShrink={0}
                          />
                          <Text fontSize="sm" dir="rtl">{opt}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
            );
          })}
        </VStack>
      </VStack>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // وضع الإنشاء
  // ══════════════════════════════════════════════════════════════════
  return (
    <Box width="100%" py={2} dir="rtl">

      {/* ── معلومات الاختبار ──────────────────────── */}
      <VStack gap={3} mb={6} align="stretch">
        <Input
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="عنوان الاختبار"
          bg="bg.panel"
          borderRadius="xl"
          fontWeight="bold"
          fontSize="lg"
        />
        <Input
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          placeholder="وصف الاختبار (اختياري)"
          bg="bg.panel"
          borderRadius="xl"
        />

        {/* مدة الاختبار */}
        <HStack
          bg="bg.panel"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="xl"
          px={4}
          py={3}
          justify="space-between"
        >
          <HStack gap={2}>
            <Icon as={MdTimer} color={COLORS.primary} boxSize={5} />
            <Text fontWeight="semibold" fontSize="sm">مدة الاختبار</Text>
          </HStack>
          <NativeSelect.Root size="sm" width="160px">
            <NativeSelect.Field
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              borderRadius="lg"
              bg="bg.canvas"
            >
              {TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
      </VStack>

      {/* ── الأسئلة — accordion ──────────────────────── */}
      <VStack align="stretch" gap={2}>
        {questions.map((q, qi) => {
          const isOpen = openQuestion === qi;
          const isComplete = q.text.trim() && q.options.every((o) => o.trim());
          return (
            <Box
              key={q.id}
              bg="bg.panel"
              border="1px solid"
              borderColor={isOpen ? COLORS.primary : isComplete ? "green.300" : "border.subtle"}
              borderRadius="2xl"
              overflow="hidden"
              transition="border-color 0.2s, box-shadow 0.2s"
              boxShadow={isOpen ? "0 4px 20px -4px rgba(255,68,102,0.15)" : "none"}
            >
              {/* ─ رأس السؤال ─────── */}
              <HStack
                px={4}
                py={3}
                justify="space-between"
                cursor="pointer"
                onClick={() => toggleQuestion(qi)}
                _hover={{ bg: "bg.muted" }}
                transition="background 0.15s"
              >
                <HStack gap={3} flex={1} overflow="hidden">
                  {/* رقم */}
                  <Badge
                    bg={isOpen ? COLORS.primary : isComplete ? "green.400" : "gray.300"}
                    _dark={{ bg: isOpen ? COLORS.primary : isComplete ? "green.500" : "whiteAlpha.200" }}
                    color="white"
                    borderRadius="full"
                    minW="24px"
                    textAlign="center"
                    fontSize="xs"
                    flexShrink={0}
                  >
                    {qi + 1}
                  </Badge>

                  {/* نص السؤال المختصر */}
                  <Text
                    fontSize="sm"
                    fontWeight={isOpen ? "bold" : "medium"}
                    color={isOpen ? COLORS.primary : "fg"}
                    flex={1}
                    isTruncated
                    noOfLines={1}
                  >
                    {q.text || `السؤال ${qi + 1}`}
                  </Text>
                </HStack>

                {/* أيقونات اليمين */}
                <HStack gap={2} flexShrink={0}>
                  {isComplete && !isOpen && (
                    <Icon as={MdCheckCircle} color="green.400" boxSize={4} />
                  )}
                  {questions.length > 1 && (
                    <Button
                      size="xs"
                      variant="ghost"
                      color="red.400"
                      onClick={(e) => { e.stopPropagation(); removeQuestion(qi); }}
                      _hover={{ bg: "red.50", _dark: { bg: "whiteAlpha.100" } }}
                    >
                      <Icon as={MdDelete} boxSize={4} />
                    </Button>
                  )}
                  <Icon
                    as={MdAdd}
                    boxSize={4}
                    color="gray.400"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </HStack>
              </HStack>

              {/* ─ محتوى السؤال ─── */}
              {isOpen && (
                <Box px={5} pb={5}>
                  {/* نص السؤال */}
                  <Input
                    value={q.text}
                    onChange={(e) => updateQuestionText(qi, e.target.value)}
                    placeholder={`اكتب السؤال ${qi + 1} هنا...`}
                    bg="bg.canvas"
                    borderRadius="xl"
                    mb={4}
                    fontWeight="semibold"
                  />

                  {/* الخيارات */}
                  <VStack align="stretch" gap={2}>
                    {q.options.map((opt, oi) => (
                      <HStack key={oi} gap={2}>
                        <Box
                          as="button"
                          type="button"
                          onClick={() => setCorrect(qi, oi)}
                          flexShrink={0}
                          color={q.correctIndex === oi ? "green.500" : "gray.300"}
                          _hover={{ color: "green.400" }}
                          transition="color 0.2s"
                          title="انقر لتعيينه كإجابة صحيحة"
                        >
                          <Icon
                            as={q.correctIndex === oi ? MdCheckCircle : MdRadioButtonUnchecked}
                            boxSize={6}
                          />
                        </Box>
                        <Input
                          flex={1}
                          value={opt}
                          onChange={(e) => updateOption(qi, oi, e.target.value)}
                          placeholder={`الخيار ${oi + 1}`}
                          bg={q.correctIndex === oi ? "green.50" : "bg.canvas"}
                          _dark={{ bg: q.correctIndex === oi ? "whiteAlpha.100" : "bg.canvas" }}
                          border="1px solid"
                          borderColor={q.correctIndex === oi ? "green.300" : "transparent"}
                          borderRadius="xl"
                          size="sm"
                          transition="all 0.2s"
                        />
                        {q.options.length > 2 && (
                          <Button
                            size="xs" variant="ghost" color="gray.400" px={1}
                            onClick={() => removeOption(qi, oi)}
                            _hover={{ color: "red.400" }}
                          >
                            <Icon as={MdClose} boxSize={4} />
                          </Button>
                        )}
                      </HStack>
                    ))}
                  </VStack>

                  {/* إضافة خيار */}
                  {q.options.length < 6 && (
                    <Button
                      mt={3} size="xs" variant="ghost"
                      color={COLORS.primary}
                      onClick={() => addOption(qi)}
                      _hover={{ bg: "pink.50", _dark: { bg: "whiteAlpha.100" } }}
                    >
                      <Icon as={LuPlus} boxSize={4} me={1} />
                      إضافة خيار
                    </Button>
                  )}

                  <Text fontSize="xs" color="gray.400" mt={3} textAlign="left">
                    ✅ الإجابة الصحيحة: الخيار {q.correctIndex + 1}
                  </Text>
                </Box>
              )}
            </Box>
          );
        })}
      </VStack>

      {/* ── زرار إضافة سؤال ──────────────────────────── */}
      <Button
        mt={5}
        width="100%"
        variant="outline"
        borderRadius="xl"
        borderStyle="dashed"
        borderColor={COLORS.primary}
        color={COLORS.primary}
        onClick={addQuestion}
        _hover={{ bg: "pink.50", _dark: { bg: "whiteAlpha.100" } }}
      >
        <Icon as={MdAdd} boxSize={5} me={2} />
        إضافة سؤال جديد
      </Button>

      {/* ── زرار الحفظ ──────────────────────────────── */}
      <Button
        mt={4}
        width="100%"
        size="lg"
        bg={COLORS.primary}
        color="white"
        borderRadius="xl"
        onClick={handleSave}
        loading={isSaving}
        _hover={{ bg: COLORS.primaryHover }}
        disabled={!quizTitle.trim()}
      >
        <Icon as={MdQuiz} boxSize={5} me={2} />
        حفظ الاختبار ({questions.length} سؤال)
      </Button>
    </Box>
  );
}

export default Quiz;