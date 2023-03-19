import { AppProps } from "next/app";
import Head from "next/head";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineThemeOverride,
} from "@mantine/core";
import "../styles/globals.css";
import { NextPage } from "next";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import RootLayout from "@/layouts/RootLayout";
import { ModalsProvider } from "@mantine/modals";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props;

  // Track the color scheme
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  // Load the color scheme from local storage
  useEffect(() => {
    const storedColorScheme = localStorage.getItem("colorScheme");

    if (storedColorScheme && colorScheme !== storedColorScheme) {
      setColorScheme(storedColorScheme as ColorScheme);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to run this once
  }, []);

  // Update the color scheme in local storage if it changes
  useEffect(() => {
    const storedColorScheme = localStorage.getItem("colorScheme");

    if (colorScheme !== storedColorScheme && colorScheme) {
      localStorage.setItem("colorScheme", colorScheme);
    }
  }, [colorScheme]);

  const mantineTheme: MantineThemeOverride = {
    colorScheme: colorScheme,
    fontFamily: "Inter, sans-serif",
  };

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

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
          <ModalsProvider>
            <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
