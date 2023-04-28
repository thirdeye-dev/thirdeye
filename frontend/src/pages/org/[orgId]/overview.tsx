import { ReactNode } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";
import {
  Box,
  Card,
  Divider,
  Flex,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import AlertGraph from "@/components/overview/AlertGraph";
import AlertHeatmap from "@/components/overview/AlertHeatmap";

export default function Overview() {
  return (
    <Flex direction="column" gap="md" h="88vh">
      <Flex direction="row" justify="space-between" gap="md" h="70%" w="100%">
        <Box w="70%" h="100%">
          <Paper withBorder w="100%" h="100%" p="md">
            <AlertGraph />
          </Paper>
        </Box>

        <Box w="30%" h="100%">
          <Paper withBorder h="100%" w="100%"></Paper>
        </Box>
      </Flex>

      <Paper withBorder w="100%" h="30%">
        <AlertHeatmap />
      </Paper>
    </Flex>
  );
}

Overview.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="overview">{page}</AppShellLayout>;
};
