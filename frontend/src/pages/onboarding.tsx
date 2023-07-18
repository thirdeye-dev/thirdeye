import useCurrentUser from "@/hooks/use-current-user";
import Organization from "@/models/organization";
import { createOrganization } from "@/services/organizations";
import {
  Button,
  Divider,
  Flex,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CgOrganisation } from "react-icons/cg";

export default function Onboarding() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const form = useForm({});

  useEffect(() => {
    form.setFieldValue("organizationName", `${user?.username}'s Organization`);
  }, [isUserLoading]);

  const handleSubmit = async (organizationName: string) => {
    if (!organizationName) return;

    const org: Organization = await createOrganization({
      name: organizationName,
    });

    router.push(`/org/${org.id}`);
  };

  return (
    <Flex h="80vh" m="lg" align={"center"} justify="center">
      <Paper radius="md" p="xl" w="40%" withBorder>
        <form
          onSubmit={form.onSubmit((values) =>
            handleSubmit(values.organizationName as string)
          )}
        >
          <Stack>
            <Stack justify={"space-between"}>
              <Text size="2rem" weight={700} color="coral">
                Create your first organization
              </Text>

              <Divider />
            </Stack>

            <Stack justify={"end"}>
              <TextInput
                py="lg"
                size="lg"
                placeholder="Organization Name"
                icon={<CgOrganisation />}
                {...form.getInputProps("organizationName")}
              />

              <Button
                type="submit"
                size="lg"
                color="orange.4"
                variant="outline"
                sx={(_) => ({
                  alignSelf: "flex-end",
                })}
              >
                Create Organization
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Flex>
  );
}
