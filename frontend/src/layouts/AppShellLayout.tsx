import Navbar from "@/components/Navbar";
import { AppShell } from "@mantine/core";

export default function AppShellLayout({
  children,
  activeLink,
}: {
  children: React.ReactNode;
  activeLink?: string;
}) {
  return (
    <AppShell navbar={<Navbar activeLink={activeLink} />}>{children}</AppShell>
  );
}
