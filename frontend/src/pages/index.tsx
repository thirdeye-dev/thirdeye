import Head from "next/head";
import { Inter } from "next/font/google";
import { Button } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main>
        <Button>Button!</Button>
      </main>
    </>
  );
}
