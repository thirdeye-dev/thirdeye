import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Box, Breadcrumbs, Flex, Paper, Stack, Divider } from "@mantine/core";

import ContractAlertTable from "@/components/contracts/detail/ContractAlertTable";
import ContractInfo from "@/components/contracts/detail/ContractInfo";
import useContract from "@/hooks/use-contract";
import AppShellLayout from "@/layouts/AppShellLayout";
import useAlerts from "@/hooks/use-alerts";
import ContractABIControls from "@/components/contracts/detail/ContractABIControls";
import ContractABIViewer from "@/components/contracts/detail/ContractABIViewer";

export default function ContractDetailed() {
  const router = useRouter();

  const organizationId = router.query.orgId as string;
  const contractId = router.query.contractId as string;

  const { contract } = useContract(contractId, organizationId);
  const { alerts } = useAlerts(contractId);

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

  const addNewAlert = () => {
    router.push(`/org/${organizationId}/alerts/create`);
  };

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
          <Paper w="100%">
            <ContractInfo contract={contract} numAlerts={alerts?.length ?? 0} />
          </Paper>

          <Paper withBorder w="100%" h="100%">
            <ContractAlertTable
              alerts={alerts}
              addNewAlert={addNewAlert}
              editAlert={() => {}} // TODO
              deleteAlert={() => {}} // TODO
            />
          </Paper>
        </Stack>

        <Box w="40%">
          <Paper withBorder h="100%" w="100%">
            <Flex direction="column" h="100%">
              <ContractABIControls contractId={contractId} />
              <Divider />
              <ContractABIViewer contractId={contractId} />
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
