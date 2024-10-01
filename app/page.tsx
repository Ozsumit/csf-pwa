"use client";
import { useState, useEffect } from "react";
import PWAInstallAndNotifications from "@/components/ui/install";
import SweatshirtFactory from "@/components/ui/game";
// import DonationClicker from "@/components/ui/game";s
// import { toast, Toaster } from "sonner";
import Welcome from "@/components/ui/welcome";

const siteFeatures = ["Offline capability", "Reset Game", "Harder Gameplay"];

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);

  // Retrieve the userName from localStorage on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("userName");
      setUserName(storedName);
    }
  }, []);

  return (
    <>
      <Welcome features={siteFeatures} />
      <PWAInstallAndNotifications />
      {/* <Toaster /> */}
      <div className="select-none">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <h1 className="text-4xl mt-10 md:text-6xl font-mono w-full md:w-6/12 justify-center items-center flex flex-col mb-6 md:mb-12 font-bold text-green-500">
            The Donation Game
          </h1>
          <h1 className="text-2xl w-auto border-b-2 p-[1%] border-yellow-400 md:text-4xl font-sans justify-center items-center flex flex-col font-bold text-yellow-400">
            {userName ? `Welcome, ${userName}` : "Welcome to the Donation Game"}
          </h1>
          <SweatshirtFactory />
        </main>
      </div>
    </>
  );
}
