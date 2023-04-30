import { Flex, Group, Stack, Tabs, Text, ThemeIcon } from "@mantine/core";
import { MdAttachMoney, MdNotificationsActive } from "react-icons/md";
import { TbBrandTorchain } from "react-icons/tb";

interface AverageStat {
  title: string;
  value_today: number;
  value_weekly: number;
  value_monthly: number;
  value_annually: number;
  icon: any;
  color: string;
}

// Maybe a hack? Fix later
type SingleValueAverageStat = Omit<
  AverageStat,
  "value_today" | "value_weekly" | "value_monthly" | "value_annually"
> & { value: number };

function StatsCard({ title, value, icon, color }: SingleValueAverageStat) {
  return (
    <Flex
      p="xl"
      align="center"
      justify="space-between"
      sx={(theme) => ({
        borderBottom: `0.5px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon size="xl" color={color} variant="outline">
          {icon}
        </ThemeIcon>
        <Text size="lg" weight="bold">
          {title}
        </Text>
      </Group>

      <Text size="1.8em" weight="bold">
        {value}
      </Text>
    </Flex>
  );
}

export default function AverageStats() {
  const stats: AverageStat[] = [
    {
      title: "Notifications",
      value_today: 15,
      value_weekly: 100,
      value_monthly: 500,
      value_annually: 1000,
      icon: <MdNotificationsActive />,
      color: "yellow",
    },
    {
      title: "On-Chain Triggers",
      value_today: 3,
      value_weekly: 20,
      value_monthly: 100,
      value_annually: 200,
      icon: <TbBrandTorchain />,
      color: "blue",
    },
    {
      title: "Transactions",
      value_today: 5,
      value_weekly: 30,
      value_monthly: 150,
      value_annually: 300,
      icon: <MdAttachMoney />,
      color: "red",
    },
  ];

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
          <Tabs.Tab value="annually">Annually</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="today" pt="xs">
          <Stack>
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value_today}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="weekly" pt="xs">
          <Stack>
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value_weekly}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="monthly" pt="xs">
          <Stack>
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value_monthly}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="annually" pt="xs">
          <Stack>
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value_annually}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
