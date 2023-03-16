import { Box, Stack } from "@mantine/core";

import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack>
      <Header />
      {children}
    </Stack>
  );
}
