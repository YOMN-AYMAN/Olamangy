"use client";
import {Box, Text, VStack, SimpleGrid, Icon, Input, Progress, Button} from '@chakra-ui/react'
import {toaster} from "@/components/ui/toaster"
import React, {useState, useRef} from 'react'
import {LuUpload, LuVideo, LuImage} from 'react-icons/lu';
import {MdCheckCircle} from 'react-icons/md';
import {getUploadLink, uploadVideo} from '@/components/ui/UploadVideo';
import {uploadFileToB2} from '@/components/ui/UploadImg';

function VideoCompent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleUploadAll = async () => {
    if (!title) {
      toaster.create({title: "العنوان مطلوب", type: "error"});
      return;
    }
    setIsUploading(true);
    try {
      // 1. Upload Video if exists
      if (videoFile) {
        const {uploadURL, videoGuid} = await getUploadLink(title);
        await uploadVideo(uploadURL, videoFile, (p) => setVideoProgress(p));
        setVideoUrl(videoGuid);
      }

      // 2. Upload Image if exists
      if (imageFile) {
        const url = await uploadFileToB2(imageFile, (p) => setImageProgress(p));
        setImageUrl(url);
      }

      toaster.create({
        title: "تم الرفع بنجاح",
        type: "success"
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "فشل الرفع",
        description: error.message,
        type: "error"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box width="100%" py={4}>
      <VStack gap={4} mb={6} align="stretch">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="اسم الفيديو"
          bg="bg.panel"
          borderRadius="xl"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="وصف الفيديو"
          bg="bg.panel"
          borderRadius="xl"
        />
      </VStack>

      <SimpleGrid columns={{base: 1, md: 2}} gap={6}>
        {/* Video Upload Card */}
        <Box
          onClick={() => videoInputRef.current.click()}
          cursor="pointer"
          bg="bg.panel"
          _dark={{
            bg: "bg.panel",
            border: "1px solid",
            borderColor: "whiteAlpha.100"
          }}
          borderRadius="35px"
          height="180px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-5px)",
            boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.12)",
            borderColor: "pink.200"
          }}
          boxShadow="0 8px 20px -6px rgba(0, 0, 0, 0.06)"
          border="1px solid"
          borderColor={videoFile ? "pink.400" : "gray.100"}
          bgGradient="linear(to-b, #fdfdff, #f5f8ff)"
          position="relative"
        >
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            style={{display: 'none'}}
            onChange={handleVideoSelect}
          />
          <VStack gap={2}>
            <Box mb={1}>
              <Icon as={videoFile ? MdCheckCircle : LuVideo} boxSize={10} color="rgb(255, 68, 102)" />
            </Box>
            <Text fontWeight="extrabold" fontSize="md" color="rgb(255, 68, 102)" dir="rtl">
              {videoFile ? videoFile.name : "اسحب الفيديو هنا"}
            </Text>
            {videoProgress > 0 && videoProgress < 100 && (
              <Progress.Root value={videoProgress} width="120px" size="xs" colorPalette="pink">
                <Progress.Track />
              </Progress.Root>
            )}
          </VStack>
        </Box>

        {/* Image Upload Card */}
        <Box
          onClick={() => imageInputRef.current.click()}
          cursor="pointer"
          bg="bg.panel"
          _dark={{
            bg: "bg.panel",
            border: "1px solid",
            borderColor: "whiteAlpha.100"
          }}
          borderRadius="35px"
          height="180px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-5px)",
            boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.12)",
            borderColor: "pink.200"
          }}
          boxShadow="0 8px 20px -6px rgba(0, 0, 0, 0.06)"
          border="1px solid"
          borderColor={imageFile ? "pink.400" : "gray.100"}
          bgGradient="linear(to-b, #fdfdff, #f5f8ff)"
          position="relative"
        >
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            style={{display: 'none'}}
            onChange={handleImageSelect}
          />
          <VStack gap={2}>
            <Box mb={1}>
              <Icon as={imageFile ? MdCheckCircle : LuImage} boxSize={10} color="rgb(255, 68, 102)" />
            </Box>
            <Text fontWeight="extrabold" fontSize="md" color="rgb(255, 68, 102)" dir="rtl">
              {imageFile ? imageFile.name : "اسحب الصورة هنا"}
            </Text>
            {imageProgress > 0 && imageProgress < 100 && (
              <Progress.Root value={imageProgress} width="120px" size="xs" colorPalette="pink">
                <Progress.Track />
              </Progress.Root>
            )}
          </VStack>
        </Box>
      </SimpleGrid>

      <Button
        mt={8}
        width="100%"
        size="lg"
        bg="rgb(255, 68, 102)"
        color="white"
        borderRadius="xl"
        onClick={handleUploadAll}
        loading={isUploading}
        _hover={{bg: "pink.600"}}
      >
        بدء الرفع
      </Button>
    </Box>
  )
}

export default VideoCompent