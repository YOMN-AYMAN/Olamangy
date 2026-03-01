"use client"

import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react"
import * as React from "react"

export const DialogRoot = ChakraDialog.Root
export const DialogTrigger = ChakraDialog.Trigger

export const DialogContent = React.forwardRef(
  function DialogContent(props, ref) {
    const { children, ...rest } = props
    return (
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content ref={ref} {...rest}>
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    )
  },
)

export const DialogHeader = ChakraDialog.Header
export const DialogBody = ChakraDialog.Body
export const DialogFooter = ChakraDialog.Footer
export const DialogTitle = ChakraDialog.Title
export const DialogDescription = ChakraDialog.Description
export const DialogActionTrigger = ChakraDialog.ActionTrigger

export const DialogCloseTrigger = React.forwardRef(
    function DialogCloseTrigger(props, ref) {
        return (
        <ChakraDialog.CloseTrigger
            position="absolute"
            top="2"
            insetEnd="2"
            ref={ref}
            {...props}
        />
        )
    },
)