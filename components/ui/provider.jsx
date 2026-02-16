// components/ui/provider.jsx
// "use client"

// import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

// export function Provider({ children }) {
//   return (
//     <ChakraProvider value={defaultSystem}>
//       {children}
//     </ChakraProvider>
//   )
// }

// components/ui/provider.jsx
"use client"

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react"

// 1. تعريف الـ System المخصص بتاعك لتوحيد الخط والاتجاه
const customSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        // بنخلي الخط الأساسي هو المتغير اللي عرفناه في layout.jsx
        heading: { value: "var(--font-cairo), sans-serif" },
        body: { value: "var(--font-cairo), sans-serif" },
      },
    },
  },
})

export function Provider({ children }) {
  return (
    // 2. بنمرر الـ customSystem بدلاً من defaultSystem
    <ChakraProvider value={customSystem}>
      {/* 3. بنلف الـ children في Box بـ dir="rtl" لضمان ثبات الاتجاه */}
      <div dir="rtl" style={{ fontFamily: "var(--font-cairo)" }}>
        {children}
      </div>
    </ChakraProvider>
  )
}