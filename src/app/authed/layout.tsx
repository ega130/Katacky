import { Inter } from "next/font/google";
import supabase from "~/lib/supabase";
import { Suspense } from "react";
import BottomNav from "~/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ticketer",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await supabase.auth.getSession();
  console.log(data);
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
