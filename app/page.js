"use client"
import { Provider } from "@/components/ui/provider"
import Login from "./Onboarding/login/page"
import MainPage from "./Onboarding/mainPage/page"

export default function Page() {
  return (
    <Provider>
      <MainPage />
    </Provider>
  )
}
