
"use client"

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react"

const customSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-cairo), sans-serif" },
        body: { value: "var(--font-cairo), sans-serif" },
      },
    },
  },
})

export function Provider({ children }) {
  return (
    <ChakraProvider value={customSystem}>
      <div dir="rtl" style={{ fontFamily: "var(--font-cairo)" }}>
        {children}
      </div>
    </ChakraProvider>
  )
}