import dynamic from "next/dynamic";

import AlertCreateStepLayout from "@/layouts/AlertCreateStepLayout";
import { Paper } from "@mantine/core";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

// @ts-ignore
import { EditorView } from "@codemirror/view";
import { useEffect } from "react";

const PLACEHOLDER_ALERT = `blockchain_alerts:
- alert_type: every_transaction # alert_type can be: every_transaction & cron
  alerts:
    AlertName: # alert name can be arbitrary
      condition: 'txn_gasPrice >= 100000' # condition (boolean) runs like python, but is not
      notifications: # options are: send_webhook, send_email, send_sms
      - send_webhook
      webhook_url: https://example.com/webhook # only if send_webhook is added above`;

const CodeMirror = dynamic(
  () => import("@uiw/react-codemirror").then((mod) => mod.default),
  { ssr: false }
);

export default function CustomBuildAlert({
  yaml,
  setYaml,
}: {
  yaml: string;
  setYaml: (alert: string) => void;
}) {
  const onChange = (value: string) => {
    setYaml(value);
  };

  useEffect(() => {
    setYaml(PLACEHOLDER_ALERT);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AlertCreateStepLayout title="Build Alert">
      <Paper withBorder>
        <CodeMirror
          theme={vscodeDark}
          height="100%"
          style={{
            width: "50vw",
            height: "50vh",
            fontSize: 16,
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
          value={PLACEHOLDER_ALERT}
          onChange={onChange}
          // @ts-ignore
          extensions={[loadLanguage("yaml"), EditorView.lineWrapping]}
        />
      </Paper>
    </AlertCreateStepLayout>
  );
}
