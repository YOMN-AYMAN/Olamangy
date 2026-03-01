"use client"
import {Flex, Image, Spacer} from "@chakra-ui/react"
import {ColorModeButton} from "./color-mode"
import Link from "next/link"

export default function Navbar() {
  return (
    <Flex
      as="nav"
      w="100%"
      h="70px"
      px={8}
      align="center"
      border="1px solid"
      borderColor="border.subtle"
      justify="space-between"
      bg="bg.panel"
      boxShadow="sm"
    >
      <Link href="/">
        <Image src="/Union.svg" alt="Logo" h="40px" />
      </Link>
      <Spacer />
      <ColorModeButton />
    </Flex>
  )
}
