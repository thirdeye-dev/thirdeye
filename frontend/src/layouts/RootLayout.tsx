import { usePathname } from "next/navigation";

import { AppShell } from "@mantine/core";

import Header from "@/components/header/Header";
import Navbar from "@/components/navbar/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname() ?? "";

  const isNavbarVisible = !pathName.includes("/auth");

  return (
    <AppShell header={{ height: 80 }} navbar={{ width: 80 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      {isNavbarVisible && (
        <AppShell.Navbar p="md">
          <Navbar activePathname={pathName} />
        </AppShell.Navbar>
      )}

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
