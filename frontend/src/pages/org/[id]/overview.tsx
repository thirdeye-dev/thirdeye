import { ReactNode } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";

export default function Overview() {
  return <p>Overview</p>;
}

Overview.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="overview">{page}</AppShellLayout>;
};
