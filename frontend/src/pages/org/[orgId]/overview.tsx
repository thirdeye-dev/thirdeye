import { Box, Flex, Paper, Stack, Grid } from "@mantine/core";

import AlertGraph from "@/components/overview/AlertGraph";
import AlertHeatmap from "@/components/overview/AlertHeatmap";
import ExecutionPieCharts from "@/components/overview/ExecutionPieCharts";
import AverageStats from "@/components/overview/AverageStats";
import { useRouter } from "next/router";

export default function Overview() {
  const router = useRouter();

  const organizationId = router.query.orgId as string | undefined;

  return (
    <Grid
      justify="space-between"
      gutter="md"
      styles={{
        inner: { height: "100%" },
        root: {
          height: "100%",
        },
      }}
    >
      <Grid.Col span={9}>
        <Stack h="100%">
          <Paper withBorder p="md" h="70%">
            <AlertGraph orgId={organizationId} />
          </Paper>

          <Paper withBorder p="md" h="30%">
            <AlertHeatmap orgId={organizationId} />
          </Paper>
        </Stack>
      </Grid.Col>

      <Grid.Col span={3}>
        <Stack h="100%">
          <Paper withBorder p="md" h="65%">
            <AverageStats orgId={organizationId} />
          </Paper>

          <Paper withBorder p="md" h="35%">
            <ExecutionPieCharts orgId={organizationId} />
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
