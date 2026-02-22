// src/app/layout.js
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/providers/AuthContext";
import {TeacherProvider} from "@/providers/teacherProvider";
import {AppProvider} from "@/providers/appProvider";
import {Cairo} from "next/font/google";
import {Provider} from "@/components/ui/provider";

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"]});
const geistMono = Geist_Mono({variable: "--font-geist-mono", subsets: ["latin"]});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-cairo",
});

export default function RootLayout({children}) {

  return (
    <html lang="ar" suppressHydrationWarning dir="rtl" translate="no" className={cairo.variable} >
      <body className={`${cairo.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
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