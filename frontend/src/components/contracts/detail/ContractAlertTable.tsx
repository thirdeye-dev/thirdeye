import Alert from "@/models/alert";
import {
  Button,
  Flex,
  ScrollArea,
  Table,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    transition: "box-shadow 150ms ease",
  },
}));

export default function ContractAlertTable({
  alerts,
  addNewAlert,
  editAlert,
  deleteAlert,
}: {
  alerts: Alert[] | undefined;
  addNewAlert: () => void;
  editAlert: (alert: Alert) => void;
  deleteAlert: (alert: Alert) => void;
}) {
  const { classes } = useStyles();

  return (
    <ScrollArea h="100%" type="never">
      <Table highlightOnHover verticalSpacing="lg" horizontalSpacing="lg">
        <thead className={classes.header}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>
              <Flex justify="flex-end">
                <Button
                  onClick={addNewAlert}
                  color="green"
                  variant="gradient"
                  p="xs"
                >
                  Create Alert
                </Button>
              </Flex>
            </th>
          </tr>
        </thead>

        <tbody>
          {alerts?.map(
            (alert) =>
              (
                <tr key={alert.id}>
                  <td>{alert.id}</td>
                  <td>{alert.name}</td>
                  <td>{alert.created_at}</td>
                  <td>{alert.updated_at}</td>

                  <td>
                    <Flex gap="4px" justify="flex-end">
                      <Tooltip label="Edit">
                        <Button
                          color="blue"
                          variant="subtle"
                          p="xs"
                          onClick={() => {}}
                        >
                          <AiOutlineEdit size="1.2rem" />
                        </Button>
                      </Tooltip>

                      <Tooltip label="Delete">
                        <Button
                          color="red"
                          variant="subtle"
                          p="xs"
                          onClick={() => {}}
                        >
                          <AiOutlineDelete size="1.2rem" />
                        </Button>
                      </Tooltip>
                    </Flex>
                  </td>
                </tr>
              ) ?? []
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
