import { Button, Flex, ScrollArea, Table, Tooltip } from "@mantine/core";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import Alert from "@/models/alert";

import classes from "./ContractAlertTable.module.css";

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
  return (
    <ScrollArea h="100%" type="never">
      <Table highlightOnHover verticalSpacing="lg" horizontalSpacing="lg">
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th>Updated At</Table.Th>
            <Table.Th>
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
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {alerts?.map(
            (alert) =>
              (
                <Table.Tr key={alert.id} className={classes.row}>
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
                </Table.Tr>
              ) ?? [],
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
