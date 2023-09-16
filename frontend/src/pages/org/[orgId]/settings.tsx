import { Text, Flex } from "@mantine/core";

import CopyToClipboard from "@/components/CopyToClipboard";
import SettingsCategory from "@/components/settings/SettingsCategory";
import AppShellLayout from "@/layouts/AppShellLayout"

export default function Settings() {
  return (
    <Flex mih="80vh" direction="column" align="center" justify="space-evenly">
      <Text size="2.4rem" color="grey" weight="bolder">Settings</Text>

      <Flex h="100%" direction="column" align="stretch" gap="md">
        <SettingsCategory title="Wallet" subtitle="ThirdEye generates a wallet for your automation needs.">
          <CopyToClipboard label="Wallet Address" textToCopy="0xE69abdd271495248Cb41e1650fBE8F42e2Ce6c28" />
          <CopyToClipboard label="Private Key" textToCopy="******************************************" />
        </SettingsCategory>

        <SettingsCategory title="API Key" subtitle="Triggers Automations over an API">
          <CopyToClipboard textToCopy="************************************" />
        </SettingsCategory>
      </Flex>  
    </Flex>
  )
}

Settings.getLayout = (page: React.ReactNode) => {
  return <AppShellLayout activeLink="settings">{page}</AppShellLayout>;
};
