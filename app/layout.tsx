import type { Metadata } from "next";
import { Nunito } from "next/font/google"
import "./globals.css";

import Navbar from "./components/navbar/Navbar";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import RentModal from "./components/modals/RentModal";

import { Toaster } from "react-hot-toast";
import getCurrentUser from "./actions/getCurrentUser";
import SearchModal from "./components/modals/SearchModal";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser()
  return (
    <html lang="en">
      <body className={font.className}>
        <Toaster />
        <SearchModal />
        <RentModal />
        <LoginModal />
        <RegisterModal />
        <Navbar currentUser={currentUser}/>
        <div className="pb-20 pt-28">
          {children}
        </div>
        </body>
    </html>
  );
}
