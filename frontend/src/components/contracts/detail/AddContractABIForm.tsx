import { useState } from "react";
import dynamic from "next/dynamic";

import { Text, Group, SegmentedControl, Stack, Button } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import {
  AiOutlineCheckCircle,
  AiOutlineStop,
  AiOutlineUpload,
} from "react-icons/ai";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { addContractABI } from "@/services/contracts";

const CodeMirror = dynamic(
  () => import("@uiw/react-codemirror").then((mod) => mod.default),
  { ssr: false }
);

const FileInput = ({ submitText }: { submitText: (text: string) => void }) => {
  const handleFile = async (file: FileWithPath) => {
    const text = await file.text();

    submitText(text);
  };

  return (
    <Dropzone
      onDrop={(files) => handleFile(files[0])}
      accept={["application/json"]}
    >
      <Group mih="10rem" position="center" spacing="xl">
        <Dropzone.Accept>
          <AiOutlineCheckCircle size="3.5rem" />
        </Dropzone.Accept>

        <Dropzone.Reject>
          <AiOutlineStop size="3.5rem" />
        </Dropzone.Reject>

        <Dropzone.Idle>
          <AiOutlineUpload size="3.5rem" />
        </Dropzone.Idle>
      </Group>

      <Text size="xl" align="center">
        Drag here or click to select a file
      </Text>
    </Dropzone>
  );
};

const TextInput = ({ submitText }: { submitText: (text: string) => void }) => {
  const [text, setText] = useState("");

  return (
    <Stack>
      <CodeMirror
        placeholder="Enter the ABI here"
        height="100%"
        minHeight="30vh"
        theme={vscodeDark}
        style={{
          fontSize: 16,
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
        onChange={setText}
        // @ts-ignore
        extensions={[loadLanguage("json")]}
      />

      <Button style={{ alignSelf: "end" }} onClick={() => submitText(text)}>
        Submit
      </Button>
    </Stack>
  );
};

export default function AddContractABIForm({
  contractId,
  afterSuccess,
}: {
  contractId: string | undefined;
  afterSuccess: () => void;
}) {
  const [inputType, setInputType] = useState("file");

  const addABI = async (abi: string) => {
    await addContractABI(parseInt(contractId!), abi);

    afterSuccess();
  };

  return (
    <Stack>
      <SegmentedControl
        value={inputType}
        onChange={setInputType}
        style={{
          alignSelf: "center",
        }}
        data={[
          { label: "File", value: "file" },
          { label: "Text", value: "text" },
        ]}
      />

      {inputType == "file" ? (
        <FileInput submitText={addABI} />
      ) : (
        <TextInput submitText={addABI} />
      )}
    </Stack>
  );
}
