"use client"
import { Provider } from "@/components/ui/provider"
import Login from "./Onboarding/login/page"
import Mainpage from "./Onboarding/mainPage/page"

export default function Page() {
  return (
    <Provider>
      <Mainpage />
    </Provider>
  )
}
