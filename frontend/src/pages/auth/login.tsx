import Link from "next/link";

import { Text, Flex, Button, Space } from "@mantine/core";
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  return (
    <>
      <main>
        <Flex direction={"row"} justify={"center"} align={"center"} h={"90vh"}>
          <Text align={"center"} size="1.5rem" weight={700}>
            Let&apos;s get you in:
          </Text>

          <Space w="md" />

          <Link href={"/api/v1/authentication/github"}>
            <Button
              variant={"subtle"}
              size="lg"
              color={"orange"}
              leftIcon={<FiGithub />}
            >
              <Text color="orange.5">Login with Github</Text>
            </Button>
          </Link>

          <Space w="md" />

          <Link href={"/api/v1/authentication/google"}>
            <Button
              variant={"subtle"}
              size="lg"
              color={"blue"}
              leftIcon={<FcGoogle />}
            >
              <Text color="blue.5">Login with Google</Text>
            </Button>
          </Link>

        </Flex>
      </main>
    </>
  );
}
