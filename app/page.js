"use client"
import { Provider } from "@/components/ui/provider"
import Login from "./Onboarding/login/page"

export default function Page() {
  return (
    <Provider>
      <Login />
    </Provider>
  )
}
