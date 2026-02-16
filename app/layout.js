// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/authProvider";
import { TeacherProvider } from "@/providers/teacherProvider";
import { AppProvider } from "@/providers/appProvider";
import { Cairo } from "next/font/google";
import { Provider } from "@/components/ui/provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const cairo = Cairo({
    subsets: ["arabic"],
    weight: ["400", "500", "700"],
    variable: "--font-cairo", 
  });
  return (
<html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className={`${cairo.variable} ${geistSans.variable} ${geistMono.variable}`}>
        {/* Chakra Provider OUTERMOST */}
        <Provider>
          <AuthProvider>
            <TeacherProvider>
              <AppProvider>
                {children}
              </AppProvider>
            </TeacherProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}