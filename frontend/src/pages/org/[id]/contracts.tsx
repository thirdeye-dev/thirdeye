import { ReactNode } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";

export default function Contracts() {
  return <p>Contracts</p>;
}

Contracts.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="contracts">{page}</AppShellLayout>;
};
