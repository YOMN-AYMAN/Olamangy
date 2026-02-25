"use client"

import {Accordion, HStack} from "@chakra-ui/react"
import * as React from "react"
import {LuChevronDown} from "react-icons/lu"

export const AccordionRoot = Accordion.Root
export const AccordionItem = Accordion.Item

export const AccordionItemTrigger = React.forwardRef(
  function AccordionItemTrigger(props, ref) {
    const {children, ...rest} = props
    return (
      <Accordion.ItemTrigger {...rest} ref={ref}>
        <HStack gap="4" flex="1" textAlign="start" width="full">
          {children}
        </HStack>
        <Accordion.ItemIndicator>
          <LuChevronDown />
        </Accordion.ItemIndicator>
      </Accordion.ItemTrigger>
    )
  },
)

export const AccordionItemContent = React.forwardRef(
  function AccordionItemContent(props, ref) {
    return (
      <Accordion.ItemContent>
        <Accordion.ItemBody {...props} ref={ref} />
      </Accordion.ItemContent>
    )
  },
)
