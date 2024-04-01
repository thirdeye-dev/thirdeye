import { ReactNode } from "react";
import AppShellLayout from "@/layouts/AppShellLayout";
import { Box, Flex, Paper, Stack } from "@mantine/core";

import AlertGraph from "@/components/overview/AlertGraph";
import AlertHeatmap from "@/components/overview/AlertHeatmap";
import ExecutionPieCharts from "@/components/overview/ExecutionPieCharts";
import AverageStats from "@/components/overview/AverageStats";
import { useRouter } from "next/router";

export default function Overview() {
  const router = useRouter();

  const organizationId = router.query.orgId as string | undefined;

  return (
    <Flex direction="row" gap="md" h="88vh">
      <Box w="70%" h="100%">
        <Stack h="100%">
          <Paper withBorder w="100%" h="70%" p="md">
            <AlertGraph orgId={organizationId} />
          </Paper>

          <Paper withBorder w="100%" h="30%" p="md">
            <AlertHeatmap orgId={organizationId} />
          </Paper>
        </Stack>
      </Box>

      <Box w="30%" h="100%">
        <Stack h="100%">
          <Paper withBorder w="100%" h="65%" p="md">
            <AverageStats orgId={organizationId} />
          </Paper>
          <Paper withBorder w="100%" h="35%" p="md">
            <ExecutionPieCharts orgId={organizationId} />
          </Paper>
        </Stack>
      </Box>
    </Flex>
  );
}

Overview.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="overview">{page}</AppShellLayout>;
};
