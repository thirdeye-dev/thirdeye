import ContractAlertTable from "@/components/contracts/detail/ContractAlertTable";
import ContractInfo from "@/components/contracts/detail/ContractInfo";
import AppShellLayout from "@/layouts/AppShellLayout";
import Alert from "@/models/alert";
import Contract from "@/models/contract";
import { fetchContract } from "@/services/contracts";
import { Box, Breadcrumbs, Flex, Paper, Stack } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

export default function ContractDetailed() {
  const router = useRouter();

  const organizationId = router.query.orgId as string;
  const contractId = router.query.contractId as string;

  const breadcrumbItems = [
    { title: "contracts", href: `/org/${organizationId}/contracts` },
    {
      title: contractId,
      href: `/org/${organizationId}/contracts/${contractId}`,
    },
  ].map((item, idx) => (
    <Link href={item.href} key={idx}>
      {item.title}
    </Link>
  ));

  const [contract, setContract] = useState<Contract | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const assignContract = async () => {
    if (!organizationId || !contractId) return;

    const contract = await fetchContract(contractId, organizationId);

    setContract(contract);
  };

  const assignAlerts = () => {
    const alerts = Array(100);
    for (let i = 0; i < 100; i++) {
      alerts[i] = {
        id: i,
        name: `Alert ${i}`,
        description: `Alert ${i} description`,
        created_at: "2021-08-01T00:00:00.000Z",
        updated_at: "2021-08-01T00:00:00.000Z",
        alert_yaml: "alert: test",
      };
    }

    setAlerts(alerts);
  };

  useEffect(() => {
    assignContract();
    assignAlerts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, contractId]);

  const addNewAlert = () => {};

  return (
    <Stack>
      <Breadcrumbs
        mb="md"
        styles={{
          root: {
            fontSize: "1.5rem",
          },
          separator: {
            fontSize: "1.5rem",
          },
        }}
      >
        {breadcrumbItems}
      </Breadcrumbs>

      <Flex w="100%" h="82vh" justify="space-between" gap="md">
        <Stack w="60%" h="100%">
          <Paper w="100%" h="40%">
            <ContractInfo contract={contract} />
          </Paper>

          <Paper withBorder w="100%" h="60%">
            <ContractAlertTable
              alerts={alerts}
              addNewAlert={addNewAlert}
              editAlert={() => {}}
              deleteAlert={() => {}}
            />
          </Paper>
        </Stack>

        <Box w="40%" h="100%">
          <Paper withBorder h="100%" w="100%">
            <Flex justify="center" align="center" h="100%">
              Nothing to see here
            </Flex>
          </Paper>
        </Box>
      </Flex>
    </Stack>
  );
}

ContractDetailed.getLayout = (page: ReactNode) => {
  return <AppShellLayout activeLink="contracts">{page}</AppShellLayout>;
};
