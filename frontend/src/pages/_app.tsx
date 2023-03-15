import { AppProps } from "next/app";
import Head from "next/head";
import {
  MantineProvider,
  MantineTheme,
  MantineThemeOverride,
} from "@mantine/core";
import "../styles/globals.css";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import RootLayout from "@/layouts/root";

const mantineTheme: MantineThemeOverride = {};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props;

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

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
        <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
      </MantineProvider>
    </>
  );
}
