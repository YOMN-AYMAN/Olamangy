"use client"
import { Flex, Image } from "@chakra-ui/react"

export default function Navbar() {
  return (
    <Flex
      as="nav"
      w="100%"
      h="70px"
      px={8}
      align="center"
      justify="flex-end"
      bg="white"
      boxShadow="sm"
      
    >
      <Image src="/Union.svg" alt="Logo" h="40px" />
    </Flex>
  )
}
