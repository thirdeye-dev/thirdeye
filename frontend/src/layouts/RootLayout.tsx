import { Inter } from "next/font/google";
import { Stack } from "@mantine/core";

import Header from "@/components/header/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack className={inter.className}>
      <Header />
      {children}
    </Stack>
  );
}
