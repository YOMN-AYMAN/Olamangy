'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  Badge,
  IconButton,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import {Moon, Sun} from 'lucide-react'
import Wave from './Wave'
import {useState, useEffect} from 'react'
import {useColorMode} from '@/components/ui/color-mode'
import {useAuth} from '@/providers/AuthContext'

export default function LandingPage() {
  const {colorMode, toggleColorMode} = useColorMode()
  const [mounted, setMounted] = useState(false)
  const [showAllTeachers, setShowAllTeachers] = useState(false)
  const {user} = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const allTeachers = [
    {name: "م/ أحمد محمد", subject: "مدرس الكيمياء", img: "https://bit.ly/kent-c-dodds"},
    {name: "م/ خالد شوقي", subject: "مدرس اللغة الإنجليزية", img: "https://bit.ly/kent-c-dodds"},
    {name: "م/ محمد محمد", subject: "مدرس اللغة العربية", img: "https://bit.ly/kent-c-dodds"},
    {name: "م/ سارة أحمد", subject: "مدرس الرياضيات", img: "https://bit.ly/kent-c-dodds"},
    {name: "م/ عمر حسن", subject: "مدرس الفيزياء", img: "https://bit.ly/kent-c-dodds"},
    {name: "م/ نور الدين", subject: "مدرس الأحياء", img: "https://bit.ly/kent-c-dodds"},
  ]

  const displayedTeachers = showAllTeachers ? allTeachers : allTeachers.slice(0, 3)

  const features = [
    {
      title: "وفر وقتك وذاكر من مكانك!",
      image: "/bi_camera-video-fill.svg",
      bg: "#00B0F0"
    },
    {
      title: "امتحانات دورية وأسئلة كتير!",
      image: "/ph_exam-fill.svg",
      bg: "#00B0F0"
    },
    {
      title: "فيديوهات كتير ومتاحة وقت ما تحب",
      image: "/bi_clock-fill.svg",
      bg: "#00B0F0"
    }
  ]

  return (
    <Box
      bg="bg.canvas"
      fontFamily="'Cairo', sans-serif"
      minH="100vh"
      transition="background 0.3s ease"
    >

      {/* 1. Enhanced Navbar */}
      <Box
        bg="bg.panel/95"
        boxShadow="0 2px 20px rgba(0,0,0,0.08)"
        position="sticky"
        top={0}
        zIndex={100}
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="border.subtle"
        transition="all 0.3s ease"
      >
        <Container
          maxW="2180px"
          py="clamp(0.75rem, 2vh, 1.25rem)"
          px="clamp(1rem, 3vw, 2rem)"
        >
          <Flex justify="space-between" align="center">

            {/* Left side - Dark mode toggle */}
            <Box
              display="flex"
              alignItems="center"
              css={{
                '@media (max-width: 768px)': {
                  display: 'none'
                }
              }}
            >
              <Box
                bg="bg.subtle"
                borderRadius="full"
                p="0.25rem"
                display="flex"
                alignItems="center"
                gap="0.25rem"
                boxShadow="sm"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: "md"
                }}
              >
                <IconButton
                  onClick={() => colorMode === 'light' && toggleColorMode()}
                  variant="ghost"
                  size="sm"
                  borderRadius="full"
                  aria-label="Dark mode"
                  bg={mounted && colorMode === 'dark' ? 'bg.muted' : 'transparent'}
                  color={mounted && colorMode === 'dark' ? 'blue.300' : 'gray.600'}
                  _hover={{
                    bg: "bg.muted",
                    transform: 'scale(1.05)'
                  }}
                  transition="all 0.2s ease"
                >
                  <Moon size={18} />
                </IconButton>
                <IconButton
                  onClick={() => colorMode === 'dark' && toggleColorMode()}
                  variant="ghost"
                  size="sm"
                  borderRadius="full"
                  aria-label="Light mode"
                  bg={mounted && colorMode === 'light' ? 'bg.panel' : 'transparent'}
                  color={mounted && colorMode === 'light' ? 'orange.400' : 'gray.600'}
                  _hover={{
                    bg: "bg.panel",
                    transform: 'scale(1.05)'
                  }}
                  transition="all 0.2s ease"
                >
                  <Sun size={18} />
                </IconButton>
              </Box>
            </Box>

            {/* Center - Logo */}
            <Box
              display="flex"
              alignItems="center"
              transition="transform 0.3s ease"
              _hover={{transform: 'scale(1.02)'}}
            >
              <Image
                src="/Union.svg"
                alt="العلومانجي"
                h="clamp(2rem, 5vw, 3rem)"
                objectFit="contain"
                loading="eager"
              />
            </Box>

            {/* Right side - Auth buttons or Dashboard link */}
            <HStack
              gap="clamp(0.5rem, 1vw, 0.75rem)"
              flexShrink={0}
            >
              {!user ? (
                <>
                  <Button
                    as={NextLink}
                    href="/Onboarding/login"
                    variant="ghost"
                    color="#00B0F0"
                    fontSize="clamp(0.875rem, 1.2vw, 1rem)"
                    fontWeight="600"
                    borderRadius="full"
                    px="clamp(1rem, 2vw, 1.5rem)"
                    h="clamp(2.375rem, 4.5vw, 2.75rem)"
                    position="relative"
                    overflow="hidden"
                    _hover={{
                      bg: "bg.subtle",
                      transform: 'translateY(-2px)',
                      _before: {
                        transform: 'scaleX(1)'
                      }
                    }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      bg: '#00B0F0',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease'
                    }}
                    transition="all 0.3s ease"
                  >
                    سجل دخول
                  </Button>

                  <Button
                    as={NextLink}
                    href="/Onboarding/signup1"
                    bg="linear-gradient(135deg, #00B0F0 0%, #0090D0 100%)"
                    color="white"
                    borderRadius="full"
                    px="clamp(1rem, 2.5vw, 1.75rem)"
                    h="clamp(2.375rem, 4.5vw, 2.75rem)"
                    fontSize="clamp(0.875rem, 1.2vw, 1rem)"
                    fontWeight="600"
                    position="relative"
                    overflow="hidden"
                    boxShadow="0 4px 14px rgba(0,176,240,0.35)"
                    _hover={{
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 20px rgba(0,176,240,0.45)",
                      _after: {
                        opacity: 1
                      }
                    }}
                    _after={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bg: 'linear-gradient(135deg, #0090D0 0%, #007AB8 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    transition="all 0.3s ease"
                    css={{
                      '& > *': {
                        position: 'relative',
                        zIndex: 1
                      }
                    }}
                  >
                    <Text
                      display="inline"
                      css={{
                        '@media (max-width: 480px)': {
                          display: 'none'
                        }
                      }}
                    >
                      أنشئ حسابك
                    </Text>
                    <Text
                      display="none"
                      css={{
                        '@media (max-width: 480px)': {
                          display: 'inline'
                        }
                      }}
                    >
                      أنشئ
                    </Text>
                  </Button>
                </>
              ) : (
                <Button
                  as={NextLink}
                  href={user.role === 'teacher' ? '/Teacher/home' : (user.role === 'developer' ? '/developer/teacher' : '/Student/home')}
                  bg="linear-gradient(135deg, #00B0F0 0%, #0090D0 100%)"
                  color="white"
                  borderRadius="full"
                  px="clamp(1rem, 2.5vw, 1.75rem)"
                  h="clamp(2.375rem, 4.5vw, 2.75rem)"
                  fontSize="clamp(0.875rem, 1.2vw, 1rem)"
                  fontWeight="600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 14px rgba(0,176,240,0.35)"
                  }}
                >
                  لوحة التحكم
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* 2. Enhanced Hero Section */}
      <Container maxW="container.xl" pt={[6, 10, 16]} pb={[10, 14, 20]} px={[3, 6, 8]}>
        <SimpleGrid columns={[1, 2]} gap={[8, 12, 16]} alignItems="center">

          {/* Right side - Text content */}
          <VStack
            align={['center', 'flex-end']}
            gap={[5, 7, 8]}
            order={[2, 1]}
            textAlign={['center', 'right']}
          >
            <VStack align={['center', 'flex-end']} gap={[2, 3]} w="full">
              <Image
                src="/Unionnnn.svg"
                alt="العلمونجي"
                h="clamp(45px, 8vw, 90px)"
                mx={['auto', 0]}
              />

              <Heading
                fontSize="clamp(24px, 5vw, 42px)"
                color="#FF4466"
                fontWeight="bold"
                textAlign={['center', 'right']}
                fontFamily="Cairo, sans-serif"
              >
                د / محمود سعيد
              </Heading>
            </VStack>

            <Text
              fontSize="clamp(16px, 2.5vw, 24px)"
              color="fg.muted"
              textAlign={['center', 'right']}
              lineHeight="1.8"
              fontWeight="500"
              px={[4, 0]}
            >
              العلمونجي دايمًا في ضهرك خطوة بخطوة
            </Text>

            <Button
              as={NextLink}
              href="/Onboarding/signup1"
              bg="#00B0F0"
              color="white"
              borderRadius="full"
              px={[5, 8, 10]}
              h="clamp(48px, 5.5vh, 64px)"
              fontSize="clamp(14px, 2vw, 20px)"
              fontWeight="700"
              _hover={{
                bg: "#0090C0",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 24px rgba(0,176,240,0.4)"
              }}
              transition="all 0.3s"
              boxShadow="0 8px 16px rgba(0,176,240,0.3)"
              mt={[3, 2, 0]}
            >
              ☢️ استر نفسك بأكونت
            </Button>
          </VStack>

          {/* Left side - Hero image */}
          <Box
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            order={[1, 2]}
          >
            <Box
              w="100%"
              h="clamp(250px, 60vw, 150%)"
              pt={[4, 8, 12]}
              position="relative"
              overflow="hidden"
            >
              <Image
                src="/Clip path group.png"
                alt="Dr. Mahmoud"
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>
          </Box>
        </SimpleGrid>
      </Container>

      {/* 3. Enhanced Why Us Section */}
      <Box position="relative" w="100%" dir="rtl">
        <Box
          bg="bg.canvas"
          py="clamp(3rem, 8vw, 6rem)"
          px="clamp(1rem, 3vw, 2rem)"
        >
          <Container maxW="100%">
            {/* Heading */}
            <VStack gap="clamp(1rem, 3vw, 2rem)" mb="clamp(3rem, 8vw, 5rem)">
              <Heading
                textAlign="center"
                color="#FF4466"
                fontSize="clamp(1.75rem, 6vw, 3.25rem)"
                fontWeight="bold"
                position="relative"
                letterSpacing="-0.02em"
                css={{
                  textShadow: '0 2px 10px rgba(255, 68, 102, 0.1)'
                }}
              >
                ليه تختار منصتنا؟
              </Heading>

              {/* Decorative underline */}
              <Box
                w="clamp(5rem, 10vw, 7rem)"
                h="0.25rem"
                bg="linear-gradient(90deg, transparent, #FF4466, transparent)"
                borderRadius="full"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '0.75rem',
                  height: '0.75rem',
                  bg: '#FF4466',
                  borderRadius: 'full',
                  boxShadow: '0 0 20px rgba(255, 68, 102, 0.5)'
                }}
              />
            </VStack>

            {/* Cards Grid */}
            <Box
              display="grid"
              gridTemplateColumns="1fr"
              gap="clamp(3rem, 6vw, 5rem)"
              css={{
                '@media (min-width: 768px)': {
                  gridTemplateColumns: 'repeat(3, 1fr)'
                }
              }}
            >
              {features.map((item, index) => (
                <Box
                  key={index}
                  position="relative"
                  transition="transform 0.3s ease"
                  _hover={{
                    transform: 'translateY(-0.5rem)',
                    '& > div': {
                      boxShadow: '0 20px 50px rgba(0,176,240,0.3)'
                    }
                  }}
                >
                  {/* Icon Circle - Positioned Above Card */}
                  <Box
                    position="absolute"
                    top="clamp(-0.9rem, -8vw, -19rem)"
                    left="50%"
                    transform="translateX(-50%)"
                    w="clamp(6rem, 18vw, 10rem)"
                    h="clamp(6rem, 15vw, 8rem)"
                    borderRadius="full"
                    bg="bg.panel"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={2}
                    border="2px solid"
                    borderColor="border.subtle"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      w="clamp(3rem, 8vw, 4.5rem)"
                      h="clamp(3rem, 8vw, 4.5rem)"
                      objectFit="contain"
                    />
                  </Box>

                  {/* Wavy Card */}
                  <Box
                    position="relative"
                    mt="clamp(3.5rem, 8vw, 4rem)"
                    mx="clamp(2rem, 4vw, 0rem)"
                    overflow="hidden"
                    borderRadius="clamp(1.5rem, 3vw, 2rem)"
                  >


                    {/* Card Content */}
                    <VStack
                      bg="#00B0F0"
                      pt="clamp(3rem, 6vw, 4rem)"
                      pb="clamp(2rem, 4vw, 3rem)"
                      px="clamp(0.5rem, 2vw, 2rem)"
                      minH="clamp(10rem, 20vw, 12rem)"
                      justify="center"
                      w="100%"
                      position="relative"
                      transition="all 0.3s ease"
                      boxShadow="0 10px 30px rgba(0,176,240,0.2)"
                    >
                      <Text
                        fontWeight="bold"
                        color="white"
                        textAlign="center"
                        fontSize="clamp(1.125rem, 2vw, 1.3rem)"
                        fontFamily="'Cairo', sans-serif"
                        lineHeight="1.6"
                      >
                        {item.title}
                      </Text>
                    </VStack>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

      </Box>

      {/* Wave Transition to Next Section */}
      <Box
        position="relative"
        h="clamp(3rem, 18vh, 3rem)"
        w="200%"
        top={{base: '-6px', md: '-120px', sm: '-50px'}}//
        transform="scaleY(-1)"
        mt="35px"
      >
        <Wave defaultColor="#00B0F0" speed={0.012} />
      </Box>
      {/* 4. Enhanced Teachers Section */}
      <Box
        py="clamp(80px, 15vh, 120px)" // زيادة الـ padding لترك مساحة للأمواج
        bg="#00B0F0"
        dir="rtl"
        px={[4, 8]}
        position="relative" // ضروري جداً لثبات الأمواج بالداخل
        overflow="visible"
      >

        <Container maxW="container.xl" position="relative" zIndex={2}>
          <VStack gap="clamp(1rem, 3vw, 2rem)" mb="clamp(3rem, 8vw, 5rem)">
            <Heading
              textAlign="center"
              color="#ffffff"
              fontSize="clamp(1.75rem, 6vw, 3.25rem)"
              fontWeight="bold"
              position="relative"
              letterSpacing="-0.02em"
              css={{
                textShadow: '0 2px 10px rgba(255, 68, 102, 0.1)'
              }}
            >
              اتعرف على مدرسينا
            </Heading>

            {/* Decorative underline */}
            <Box
              w="clamp(5rem, 10vw, 7rem)"
              h="0.25rem"
              bg="linear-gradient(90deg, transparent, #ffffff, transparent)"
              borderRadius="full"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '0.75rem',
                height: '0.75rem',
                bg: '#ffffff',
                borderRadius: 'full',
                boxShadow: '0 0 20px rgba(255, 68, 102, 0.5)'
              }}
            />
          </VStack>

          <SimpleGrid
            columns={[1, 2, 3]}
            gap={[8, 10, 12]}
            mb={[8, 12]}
          >
            {displayedTeachers.map((teacher, index) => (
              <VStack
                key={index}
                p={[6, 8]}
                bg="bg.panel"
                borderRadius="3xl"
                mx={4}
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  transform: "translateY(-12px)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                }}
                spacing={[4, 5]}
              >
                <Box
                  borderRadius="full"
                  overflow="hidden"
                  boxSize="clamp(120px, 20vw, 180px)" // جعل الحجم أكثر مرونة
                  border="clamp(4px, 1vw, 7px) solid"
                  borderColor="#00B0F0"
                  bg="bg.panel"
                >
                  <Image
                    src={teacher.img}
                    alt={teacher.name}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize="clamp(18px, 2vw, 22px)"
                  textAlign="center"
                  color="fg"
                >
                  {teacher.name}
                </Text>
                <Badge
                  bg="#00B0F0"
                  color="white"
                  px={[6, 8]}
                  py={[2, 2.5]}
                  borderRadius="full"
                  fontSize="clamp(12px, 1vw, 15px)"
                >
                  {teacher.subject}
                </Badge>
              </VStack>
            ))}
          </SimpleGrid>

          <Flex justify="center" mt={[6, 8]}>
            <Button
              onClick={() => setShowAllTeachers(!showAllTeachers)}
              variant="outline"
              borderColor="white"
              color="white"
              borderRadius="full"
              px={[8, 10]}
              h="clamp(45px, 5vh, 55px)"
              _hover={{bg: "white", color: "#00B0F0"}}
            >
              {showAllTeachers ? 'عرض أقل' : 'عرض المزيد'}
            </Button>
          </Flex>
        </Container>

        {/* --- الموجة السفلية (نهاية السكشن) --- */}
        <Box
          position="absolute"
          bottom={{base: '-65px', md: '-170px', sm: '-80px'}}// التصاق تام بالأسفل
          left={0}
          right={0}
          w="200%"
          h="clamp(60px, 10vh, 100px)"
          transform="scaleY(1)" // قلب الموجة لتناسب الخروج من السكشن
          zIndex={1}
          pointerEvents="none"
        >
          <Wave defaultColor="#00B0F0" speed={0.012} />
        </Box>
      </Box>

      {/* 5. Enhanced Join Us Section */}
      <Box
        py={[16, 20, 24]}
        bg="bg.canvas"
        px={[4, 8]}
      >
        <Container maxW="container.xl" pt={[8, 12, 16]}>
          <VStack gap={[6, 8, 10]}>
            <Heading
              fontSize="clamp(24px, 5vw, 48px)"
              textAlign="center"
              fontWeight="bold"
              lineHeight="1.6"
              color="fg"
              px={[4, 0]}
            >
              انضم لأكثر من{" "}
              <Text as="span" color="#FF4466">+1000</Text>{" "}
              طالب مميز
              <br />
              وابدأ معانا عشان تتفوق وتتميز وسط زمايلك!
            </Heading>
            <Button
              as={NextLink}
              href="/Onboarding/signup1"
              bg="#00B0F0"
              color="white"
              borderRadius="full"
              px={[10, 14, 16]}
              h="clamp(56px, 7vh, 72px)"
              fontSize="clamp(18px, 2.5vw, 24px)"
              fontWeight="bold"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "0 15px 40px rgba(0,176,240,0.4)"
              }}
              transition="all 0.3s"
              boxShadow="0 10px 30px rgba(0,176,240,0.3)"
            >
              سجل دلوقتي!
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer spacing */}
      <Box h="clamp(40px, 4vh, 60px)" bg="bg.canvas" />
    </Box>
  )
}