import { createStyles, Text, Card, RingProgress, Group, ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconTrash, IconPencil } from "@tabler/icons";
import { Polygon, Ethereum } from "@thirdweb-dev/chain-icons";
import { useEffect, useState } from "react";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1,
  },

  inner: {
    display: "flex",

    [theme.fn.smallerThan(350)]: {
      flexDirection: "column",
    },
  },
}));

export function Server({ server }) {
  // eslint-disable-next-line no-unused-vars
  const { classes, theme } = useStyles();
  const [opened, setOpened] = useState(false);

  const openNewServerModal = () => {
    setOpened(true);
  };

  return (
    <Link href={`/dashboard/status/${server.id}`}>
      <Card withBorder p="xl" radius="md" className={classes.card}>
        <Group position="apart">
          <Group>
            <div className={classes.inner}>
              <div>
                <Ethereum />
              </div>
              <div>
                <Text size="xl" className={classes.label}>
                  {server.id}
                </Text>
              </div>
              <div>
                <Text size="xl" className={classes.label}>
                  {server.address}
                </Text>
              </div>
              <div>
                <Text size="xl" className={classes.label}>
                  {server.network}
                </Text>
              </div>
            </div>
          </Group>
          <Group>
            <div className={classes.inner}>
              <Menu shadow="md" position="left-start">
                <Menu.Target>
                  <ActionIcon>
                    <IconDotsVertical />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    onClick={() => openNewServerModal()}
                    <Group>
                      <ActionIcon>
                        <IconPencil />
                      </ActionIcon>
                      <Text>Edit</Text>
                    </Group>
                  </Menu.Item>
                  <Menu.Item>
                    onClick={() => openNewServerModal()}
                    <Group>
                      <ActionIcon>
                        <IconTrash />
                      </ActionIcon>
                      <Text>Delete</Text>
                    </Group>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </Group>
        </Group>
      </Card>
    </Link>
  );
}
