import { ReactNode } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";
import {
  Box,
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
    <Flex direction="row" justify="space-between" gap="md" h="88vh" w="100%">
      <Box w="60%" h="100%">
        <Paper withBorder w="100%" h="100%">
          <Stack p="md" justify="space-between" h="100%">
            <Paper h="65%">
              <AlertGraph />
            </Paper>
            <Paper withBorder h="35%">
              <AlertHeatmap />
            </Paper>
          </Stack>
        </Paper>
      </Box>

      <Box w="40%" h="100%">
        <Paper withBorder h="100%" w="100%">
          <Stack p="md" h="100%">
            <Text size="2em" weight="bold" align="center" color="orange">
              Live Alerts
            </Text>
            <Divider />

            <ScrollArea mah="100%" w="100%">
              {Array.from({ length: 100 }).map((_, i) => (
                <Box key={i} p="md">
                  <Text size="lg">Alert {i}</Text>
                </Box>
              ))}
            </ScrollArea>
          </Stack>
        </Paper>
      </Box>
    </Flex>
  );
}

Overview.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="overview">{page}</AppShellLayout>;
};
