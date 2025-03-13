import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/root/Navbar";
import Footer from "@/components/root/Footer";
import FooterVisibilityWrapper from "@/components/root/FooterVisibilityWrapper"; // New Wrapper
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: "400", subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: "CSConnect",
  description: "Build projects and showcase your skills.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
        <ModalProvider>
        <AuthProvider>

          <body className="antialiased">
            <Script 
              src="https://accounts.google.com/gsi/client" 
              strategy="afterInteractive"
            />
            <Navbar />
            <main tabIndex={0} className="pt-[90px]"> {/* Adjust this value based on your navbar height */}
              {children}
            </main>
            <FooterVisibilityWrapper />
          </body>
          </AuthProvider>
        </ModalProvider>
    </html>
  );
}
