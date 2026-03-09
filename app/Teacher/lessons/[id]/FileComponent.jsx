"use client";
import { Box, Text, VStack, HStack, Icon, Input, Progress, Button } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster";
import React, { useState, useRef } from 'react';
import { LuFileText, LuDownload } from 'react-icons/lu';
import { MdCheckCircle } from 'react-icons/md';
import { uploadFileToB2 } from '@/components/ui/UploadImg';
import { ref, update } from 'firebase/database';
import { rtdb } from "@/auth/firebase";

function FileComponent({ lesson, path, currentPart, teacherId, partIndex }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const pdfInputRef = useRef(null);

  const handlePdfSelect = (e) => {
    const file = e.target.files[0];
    if (file) setPdfFile(file);
  };

  const handleUpload = async () => {
    if (!title) {
      toaster.create({ title: "العنوان مطلوب", type: "error" });
      return;
    }
    if (!pdfFile) {
      toaster.create({ title: "الرجاء اختيار ملف PDF", type: "error" });
      return;
    }

    setIsUploading(true);
    try {
      // رفع الـ PDF على B2
      const fileUrl = await uploadFileToB2(pdfFile, (p) => setPdfProgress(p));

      // حفظ في Firebase
      if (lesson.id && teacherId) {
        const pageRef = ref(rtdb, `teachers/${teacherId}/lessons/${path}/${lesson.id}/pages/${partIndex}`);
        await update(pageRef, {
          type: "file",
          title: title,
          description: description,
          fileUrl: fileUrl,
          updatedAt: new Date().toISOString(),
        });
      }

      toaster.create({ title: "تم رفع الملف بنجاح ✅", type: "success" });
      // إعادة تهيئة
      setPdfFile(null);
      setPdfProgress(0);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      toaster.create({ title: "فشل الرفع", description: error.message, type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  // ── عرض الملف الموجود ──────────────────────────────────────────────
  if (currentPart) {
    return (
      <VStack align="stretch" gap={4} dir="rtl">
        {/* عنوان ووصف */}
        <Text fontWeight="extrabold" fontSize="lg" color="rgb(255, 68, 102)">
          {currentPart.title}
        </Text>
        {currentPart.description && (
          <Text fontSize="sm" color="gray.500">{currentPart.description}</Text>
        )}

        {/* عارض PDF */}
        {currentPart.fileUrl ? (
          <Box
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="border.subtle"
            boxShadow="0 4px 20px -4px rgba(0,0,0,0.1)"
          >
            {/* شريط الملف العلوي */}
            <HStack
              bg="rgb(255,68,102)"
              px={4}
              py={3}
              justify="space-between"
            >
              <HStack gap={2}>
                <Icon as={LuFileText} boxSize={5} color="white" />
                <Text fontWeight="bold" color="white" fontSize="sm">
                  {currentPart.title}
                </Text>
              </HStack>
              <Box
                as="a"
                href={currentPart.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                display="flex"
                alignItems="center"
                gap={1}
                color="white"
                fontSize="sm"
                fontWeight="semibold"
                _hover={{ opacity: 0.8 }}
              >
                <Icon as={LuDownload} boxSize={4} />
                تنزيل
              </Box>
            </HStack>

            {/* iframe للـ PDF */}
            <iframe
              src={currentPart.fileUrl}
              title={currentPart.title}
              width="100%"
              height="600px"
              style={{ border: "none", display: "block" }}
            />
          </Box>
        ) : (
          <Box p={6} bg="bg.muted" borderRadius="xl" textAlign="center">
            <Text color="gray.400">لا يوجد ملف مرفق</Text>
          </Box>
        )}
      </VStack>
    );
  }

  // ── رفع ملف جديد ────────────────────────────────────────────────────
  return (
    <Box width="100%" py={4}>
      {/* حقول البيانات */}
      <VStack gap={3} mb={6} align="stretch">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="اسم الملف"
          bg="bg.panel"
          borderRadius="xl"
          dir="rtl"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف الملف (اختياري)"
          bg="bg.panel"
          borderRadius="xl"
          dir="rtl"
        />
      </VStack>

      {/* بطاقة رفع PDF */}
      <Box
        onClick={() => pdfInputRef.current.click()}
        cursor="pointer"
        bg={pdfFile ? "pink.50" : "bg.panel"}
        _dark={{
          bg: pdfFile ? "whiteAlpha.100" : "bg.panel",
          border: "1px solid",
          borderColor: pdfFile ? "pink.500" : "whiteAlpha.100",
        }}
        borderRadius="3xl"
        height="200px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "0 16px 40px -10px rgba(255,68,102,0.2)",
          borderColor: "pink.300",
        }}
        boxShadow="0 8px 20px -6px rgba(0,0,0,0.06)"
        border="2px dashed"
        borderColor={pdfFile ? "pink.400" : "gray.200"}
        position="relative"
      >
        <input
          type="file"
          accept=".pdf"
          ref={pdfInputRef}
          style={{ display: "none" }}
          onChange={handlePdfSelect}
        />

        <Box
          bg={pdfFile ? "rgb(255,68,102)" : "pink.50"}
          borderRadius="full"
          p={3}
          _dark={{ bg: pdfFile ? "rgb(255,68,102)" : "whiteAlpha.200" }}
        >
          <Icon
            as={pdfFile ? MdCheckCircle : LuFileText}
            boxSize={8}
            color={pdfFile ? "white" : "rgb(255,68,102)"}
          />
        </Box>

        <VStack gap={1}>
          <Text fontWeight="extrabold" fontSize="md" color="rgb(255,68,102)" dir="rtl">
            {pdfFile ? pdfFile.name : "انقر لاختيار ملف PDF"}
          </Text>
          {!pdfFile && (
            <Text fontSize="xs" color="gray.400">
              PDF فقط
            </Text>
          )}
        </VStack>

        {/* شريط التقدم */}
        {pdfProgress > 0 && pdfProgress < 100 && (
          <Box width="60%" position="absolute" bottom={4}>
            <Progress.Root value={pdfProgress} size="xs" colorPalette="pink">
              <Progress.Track borderRadius="full">
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Text fontSize="xs" color="pink.400" textAlign="center" mt={1}>
              {Math.round(pdfProgress)}%
            </Text>
          </Box>
        )}
      </Box>

      {/* زرار الرفع */}
      <Button
        mt={6}
        width="100%"
        size="lg"
        bg="rgb(255, 68, 102)"
        color="white"
        borderRadius="xl"
        onClick={handleUpload}
        loading={isUploading}
        _hover={{ bg: "pink.600" }}
        disabled={!pdfFile || !title}
      >
        <Icon as={LuFileText} mr={2} />
        رفع الملف
      </Button>
    </Box>
  );
}

export default FileComponent;