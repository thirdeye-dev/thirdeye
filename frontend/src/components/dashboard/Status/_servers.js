import { Text, SimpleGrid, Paper, ActionIcon, Group, Modal, TextInput, Grid, Button } from "@mantine/core";
import { IconPlus, IconCheck } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { fetchServers } from "../../../api/servers";
import { Server } from "./_server";

const showSuccessNotification = () => {
  showNotification({
    title: "Contract Added Successfully",
    icon: <IconCheck />,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.blue[6],
        borderColor: theme.colors.blue[6],

        "&::before": { backgroundColor: theme.white },
      },

      title: { color: theme.white },
      description: { color: theme.white },
      closeButton: {
        color: theme.white,
        "&:hover": { backgroundColor: theme.colors.blue[7] },
      },
    }),
  });
};

function NewServerModal({ closeModal }) {
  const addContract = (data) => {
    fetch("/api//smartcontract/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((json) => {
        closeModal();
        showSuccessNotification();
      })
      .catch((e) => console.error(e));
  };

  const form = useForm({
    initialValues: {
      address: "",
      id: "",
    },
    validate: {
      address: (value) => (value.length !== 64 ? "Address must be 64 characters long" : null),
      chain: (value) => (value.length < 1 ? "Enter Valid Chain" : null),
      network: (value) => (value.length < 1 ? "Enter Valid Network" : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => addContract(values))}>
      <Grid>
        <Grid.Col>
          <TextInput
            placeholder="Contract Address"
            variant="filled"
            radius="md"
            withAsterisk
            required
            data-autofocus
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("addres")}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            placeholder="Chain ID"
            variant="filled"
            radius="md"
            withAsterisk
            required
            data-autofocus
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("chain")}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            placeholder="Network"
            variant="filled"
            radius="md"
            withAsterisk
            required
            data-autofocus
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("network")}
          />
        </Grid.Col>
      </Grid>

      <Button
        variant="gradient"
        gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
        type="submit"
        sx={(theme) => ({
          marginTop: theme.spacing.md,
          float: "right",
        })}
      >
        ADD
      </Button>
    </form>
  );
}

export function Servers() {
  const [newServerModalOpened, setNewServerModalOpened] = useState(false);
  const [servers, setServers] = useState([]);

  useEffect(() => {
    fetchServers().then((json) => setServers(json.results));
  }, []);

  const openNewServerModal = () => {
    setNewServerModalOpened(true);
  };

  const onCloseNewServerModal = async () => {
    setNewServerModalOpened(false);

    fetchServers().then((json) => {
      setServers(json.results);
    });
  };

  return (
    <>
      <Modal opened={newServerModalOpened} onClose={onCloseNewServerModal} title="Add Contract" centered>
        <NewServerModal closeModal={setNewServerModalOpened} />
      </Modal>
      <Group position="apart">
        <Text size="36px" weight={900}>
          CONTRACTS
        </Text>
        <ActionIcon onClick={openNewServerModal}>
          <IconPlus />
        </ActionIcon>
      </Group>

      <Paper
        sx={(theme) => ({
          padding: theme.spacing.md,
          marginTop: theme.spacing.md,
        })}
      >
        {/* {servers.length > 0 ? (
          <SimpleGrid cols={2}>
            {servers.map((server) => (
              <Server server={server} />
            ))}
          </SimpleGrid>
        ) : (
          <Text>No contracts available.</Text>
        )} */}
      </Paper>
    </>
  );
}
