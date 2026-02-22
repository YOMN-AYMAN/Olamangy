"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Button,
  Flex,
  Text,
  Portal,
} from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons"

export function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  disabled,
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  
  const selectedOption = options.find(opt => opt.value === value)
  const displayText = selectedOption ? selectedOption.label : placeholder

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isOpen])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <Box position="relative" width="100%" ref={triggerRef} {...props}>
      <Button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        width="100%"
        justifyContent="space-between"
        bg="white"
        border="1px solid"
        borderColor="#e2e8f0"
        rounded="lg"
        px={4}
        py={3}
        h="auto"
        fontWeight="normal"
        _hover={{ borderColor: "#cbd5e0" }}
        _disabled={{
          opacity: 0.6,
          cursor: "not-allowed"
        }}
        disabled={disabled}
      >
        <Text
          color={selectedOption ? "#535353" : "#a0aec0"}
          fontSize="sm"
          textAlign="right"
          width="100%"
        >
          {displayText}
        </Text>
        <ChevronDownIcon 
          boxSize={5} 
          color="#718096"
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
          transition="transform 0.2s"
        />
      </Button>

      {isOpen && !disabled && (
        <Portal>
          {/* Backdrop */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={999}
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown - positioned absolutely to viewport */}
          <Box
            position="absolute"
            top={`${dropdownPosition.top}px`}
            left={`${dropdownPosition.left}px`}
            width={`${dropdownPosition.width}px`}
            bg="white"
            border="1px solid"
            borderColor="#e2e8f0"
            rounded="lg"
            shadow="lg"
            maxH="300px"
            overflowY="auto"
            zIndex={1000}
          >
            {options.map((option) => (
              <Box
                key={option.value}
                px={4}
                py={3}
                cursor="pointer"
                bg={value === option.value ? "#f7fafc" : "white"}
                _hover={{ bg: "#edf2f7" }}
                onClick={() => handleSelect(option.value)}
                transition="background 0.2s"
              >
                <Text
                  color="#000"
                  fontSize="sm"
                  textAlign="right"
                  width="100%"
                >
                  {option.label}
                </Text>
              </Box>
            ))}
          </Box>
        </Portal>
      )}
    </Box>
  )
}