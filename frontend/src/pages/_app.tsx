import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/charts/styles.css";

import "@/styles/globals.css";

import { AppProps } from "next/app";
import Head from "next/head";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { SWRConfig } from "swr";

import RootLayout from "@/layouts/RootLayout";
import RouterTransition from "@/components/RouterTransition";
import axiosInstance from "@/axios";
import theme from "@/theme";

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

      <MantineProvider theme={theme} defaultColorScheme="dark">
        <RouterTransition />
        <Notifications />

        <ModalsProvider>
          <RootLayout>
            <SWRConfig
              value={{
                fetcher: (url) =>
                  axiosInstance.get(url).then((res) => res.data), // default fetcher
              }}
            >
              {getLayout(<Component {...pageProps} />)}
            </SWRConfig>
          </RootLayout>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
