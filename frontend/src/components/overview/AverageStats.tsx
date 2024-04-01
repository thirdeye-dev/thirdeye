import { Stack, Tabs, Text } from "@mantine/core";
import { MdAttachMoney, MdNotificationsActive } from "react-icons/md";
import { TbBrandTorchain } from "react-icons/tb";

import useOverviewStats from "@/hooks/use-overview-stats";
import { TimeMode } from "@/models/common";
import StatsCard from "@/components/overview/StatsCard";

export default function AverageStats({ orgId }: { orgId: string | undefined }) {
  const genStats = (notifsCount: number) => [
    {
      title: "Notifications",
      icon: <MdNotificationsActive />,
      color: "yellow",
      value: notifsCount,
    },
    {
      title: "On-Chain Triggers",
      icon: <TbBrandTorchain />,
      color: "blue",
      value: "Coming Soon!",
    },
  ];

  const StatPanel = ({ timeMode }: { timeMode: TimeMode }) => {
    const { data, isLoading } = useOverviewStats(orgId, timeMode);

    const stats = genStats(data?.notifications ?? 0);

    return (
      <Tabs.Panel value={timeMode} pt="xs">
        <Stack>
          {stats.map((stat, idx) => (
            <StatsCard
              key={idx}
              title={isLoading ? "Loading.." : stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </Stack>
      </Tabs.Panel>
    );
  };

  return (
    <Stack>
      <Text size="1.8em" weight="bold" color="yellow">
        Average Stats
      </Text>
      <Tabs variant="outline" defaultValue="weekly">
        <Tabs.List>
          <Tabs.Tab value="today">Today</Tabs.Tab>
          <Tabs.Tab value="weekly">Weekly</Tabs.Tab>
          <Tabs.Tab value="monthly">Monthly</Tabs.Tab>
          <Tabs.Tab value="yearly">Annually</Tabs.Tab>
        </Tabs.List>

        <StatPanel timeMode="today" />
        <StatPanel timeMode="weekly" />
        <StatPanel timeMode="monthly" />
        <StatPanel timeMode="yearly" />
      </Tabs>
    </Stack>
  );
}
