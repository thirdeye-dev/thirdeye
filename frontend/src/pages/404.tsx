import { Button, Container, Flex, NavLink, Text } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Flex h="90vh" justify={"center"} align="center" direction={"column"}>
      <Text size={"8rem"} color="orange">
        404
      </Text>

      <Link href="/org">
        <Button size={"lg"} color="red">
          Go back to the Dashboard
        </Button>
      </Link>
    </Flex>
  );
}
