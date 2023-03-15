import { AppProps } from "next/app";
import Head from "next/head";
import {
  MantineProvider,
  MantineTheme,
  MantineThemeOverride,
} from "@mantine/core";
import "../styles/globals.css";

const mantineTheme: MantineThemeOverride = {};

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>ThirdEye</title>
        <meta
          name="description"
          content="Your smart contracts can be and will be pwned someday. You should be notified when someone does that."
        />
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
