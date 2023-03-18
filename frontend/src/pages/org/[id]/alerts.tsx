import { ReactNode } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";

export default function Alerts() {
  return <p>Alerts</p>;
}

Alerts.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="alerts">{page}</AppShellLayout>;
};
