import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Skill Swap Platform",
  description: "A premium platform to swap skills with others",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.className} bg-background text-text-primary antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
