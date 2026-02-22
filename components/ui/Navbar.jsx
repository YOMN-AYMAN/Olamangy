"use client"
import {Flex, Image, Spacer} from "@chakra-ui/react"
import {ColorModeButton} from "./color-mode"

export default function Navbar() {
  return (
    <Flex
      as="nav"
      w="100%"
      h="70px"
      px={8}
      align="center"
      justify="space-between"
      bg="bg.panel"
      boxShadow="sm"
    >
      <Image src="/Union.svg" alt="Logo" h="40px" />
      <Spacer />
      <ColorModeButton />
    </Flex>
  )
}
