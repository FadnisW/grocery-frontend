"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/footer/Footer";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_Context/_UpdateCartContext";
import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Grocery Store",
//   description: "General Purpose Store",
// };

export default function RootLayout({ children }) {
  const params=usePathname();
  const [updateCart, setUpdateCart] = useState(false);
  const showHeader=params=='/sign-in'||params=='/create-account'?false:true;
  return (
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture"
    }}>
    <html lang="en">
      <body className={inter.className}>
        <UpdateCartContext.Provider value={{updateCart, setUpdateCart}}>
        {showHeader&&<Header />}
        {children}
        <Toaster />
        </UpdateCartContext.Provider>
        <Footer />
      </body>
    </html>
    </PayPalScriptProvider>
  );
}
