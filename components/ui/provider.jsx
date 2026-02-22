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

import {ChakraProvider, createSystem, defaultConfig} from "@chakra-ui/react"
import {ColorModeProvider} from "./color-mode"


// 1. تعريف الـ System المخصص بتاعك لتوحيد الخط والاتجاه
const customSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: {value: "var(--font-cairo), sans-serif"},
        body: {value: "var(--font-cairo), sans-serif"},
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: {value: {_light: "white", _dark: "{colors.gray.950}"}},
          panel: {value: {_light: "white", _dark: "{colors.gray.900}"}},
          subtle: {value: {_light: "{colors.gray.50}", _dark: "{colors.gray.800}"}},
          muted: {value: {_light: "{colors.gray.100}", _dark: "{colors.gray.700}"}},
        },
        fg: {
          DEFAULT: {value: {_light: "{colors.gray.900}", _dark: "white"}},
          muted: {value: {_light: "{colors.gray.600}", _dark: "{colors.gray.400}"}},
          subtle: {value: {_light: "{colors.gray.500}", _dark: "{colors.gray.500}"}},
        },
        border: {
          DEFAULT: {value: {_light: "{colors.gray.200}", _dark: "{colors.gray.800}"}},
          subtle: {value: {_light: "{colors.gray.100}", _dark: "{colors.gray.700}"}},
        }
      }
    }
  },
})

export function Provider({children}) {
  return (
    // 2. بنمرر الـ customSystem بدلاً من defaultSystem
    <ChakraProvider value={customSystem}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}