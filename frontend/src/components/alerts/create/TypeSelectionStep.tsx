import { ReactNode, useState } from "react";

import { Flex, Paper, ThemeIcon, Text } from "@mantine/core";
import { BsFillCartCheckFill, BsFillGearFill } from "react-icons/bs";

import AlertCreateStepLayout from "@/layouts/AlertCreateStepLayout";
import { AlertType } from "@/models/alertType";

import classes from "./TypeSelectionStep.module.css";

export default function TypeSelectionStep({
  alertType,
  setAlertType,
}: {
  alertType: AlertType | null;
  setAlertType: (type: AlertType) => void;
}) {
  const TypeCard = ({
    title,
    icon,
    isSelected,
    onClick,
  }: {
    title: string;
    icon: ReactNode;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    return (
      <Paper
        className={classes.main}
        w="25%"
        h="70%"
        radius="md"
        opacity={isSelected ? 0.8 : 1}
        withBorder={isSelected}
        onClick={onClick}
      >
        <ThemeIcon
          size="100%"
          variant="light"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {icon}

          <Text ta="center" size="1.5em" mt="md">
            {title}
          </Text>
        </ThemeIcon>
      </Paper>
    );
  };

  return (
    <AlertCreateStepLayout title="Select an Alert Type">
      <Flex direction="row" h="100%" w="100%" justify="center" gap="lg">
        <TypeCard
          isSelected={alertType === AlertType.Preset}
          title="Preset"
          icon={<BsFillCartCheckFill size="60%" />}
          onClick={() => setAlertType(AlertType.Preset)}
        />
        <TypeCard
          isSelected={alertType === AlertType.Custom}
          title="Build It Yourself"
          icon={<BsFillGearFill size="60%" />}
          onClick={() => setAlertType(AlertType.Custom)}
        />
      </Flex>
    </AlertCreateStepLayout>
  );
}
