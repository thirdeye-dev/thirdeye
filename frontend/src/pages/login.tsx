import { Inter } from "next/font/google";
import { Text, Flex, Paper, Button, Space, Divider } from "@mantine/core";
import { FiGithub } from "react-icons/fi";

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  return (
    <>
      <main>
        <Flex direction={"row"} justify={"center"} align={"center"} h={"90vh"}>
          <Text align={"center"} size="1.5rem" weight={700}>
            Let&apos;s get you in:
          </Text>

          <Space w="md" />

          <Button
            variant={"subtle"}
            size="lg"
            color={"orange"}
            leftIcon={<FiGithub />}
          >
            <Text color="orange.5">Login with Github</Text>
          </Button>
        </Flex>
      </main>
    </>
  );
}
