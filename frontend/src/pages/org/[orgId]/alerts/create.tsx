import { Button, Container, Flex, Stack, Stepper } from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";

import AppShellLayout from "@/layouts/AppShellLayout";
import ChoosePresetAlert from "@/components/alerts/create/ChoosePresetAlert";
import TypeSelectionStep from "@/components/alerts/create/TypeSelectionStep";
import InformationReviewStep from "@/components/alerts/create/InformationReviewStep";
import { AlertType } from "@/models/alertType";
import PresetAlert, { PresetAlertParam } from "@/models/presetAlert";
import SetupPresetAlert from "@/components/alerts/create/SetupPresetAlert";
import { useRouter } from "next/router";
import Contract from "@/models/contract";
import { createPresetAlert } from "@/services/presetAlerts";
import { notifications } from "@mantine/notifications";

export default function CreateAlert() {
  const router = useRouter();
  const orgId = router.query.orgId as string;

  const [activeStep, setActiveStep] = useState(0);

  const incStep = () =>
    setActiveStep((current) =>
      current < steps.length ? current + 1 : current
    );

  const decStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const [alertType, setAlertType] = useState<AlertType | null>(null);
  const [presetAlert, setPresetAlert] = useState<PresetAlert | null>(null);
  const [presetParams, setPresetParams] = useState<Record<string, any>>({});
  const [contract, setContract] = useState<Contract | null>(null);

  const steps = [
    {
      label: "Select Type",
      description: "Choose between Alert types",
      children: (
        <TypeSelectionStep alertType={alertType} setAlertType={setAlertType} />
      ),
    },
    {
      label: "Select Alert",
      description: "Choose from our preset library",
      children: (
        <ChoosePresetAlert
          presetAlert={presetAlert}
          setPresetAlert={setPresetAlert}
        />
      ),
      condition: alertType == AlertType.Preset,
    },
    {
      label: "Setup Alert",
      description: "Configure your Preset",
      children: (
        <SetupPresetAlert
          presetAlert={presetAlert!}
          setParams={setPresetParams}
          orgId={orgId}
          setContract={setContract}
        />
      ),
      condition: alertType == AlertType.Preset,
    },
    // TODO: Implement this
    // {
    //   label: "Configure Notifications",
    //   description: "Where to receive notifications",
    //   children: <NotificationConfigStep />,
    // },
    {
      label: "Review",
      description: "Review and create your Alert",
      children: (
        <InformationReviewStep
          alertType={alertType!}
          presetAlert={presetAlert!}
          presetParams={presetParams}
          contract={contract!}
        />
      ),
    },
  ];

  const performCreate = async () => {
    await createPresetAlert(
      {
        name: presetAlert!.name,
        // @ts-ignore FIXME: fix type
        params: presetParams,
      },
      contract!.id
    );

    notifications.show({
      title: "Alert Created",
      message: "Your alert has been created",
      color: "teal",
    });
    router.push(`/org/${orgId}/contracts/${contract!.id}`);
  };

  const maybeMoveAheadOrCreate = () => {
    if (activeStep === steps.length - 1) {
      performCreate();
    }

    switch (activeStep) {
      case 0:
        if (alertType == null) return;
        break;
      case 1:
        if (alertType == AlertType.Preset && presetAlert == null) return;
        break;
      case 2:
        if (alertType !== AlertType.Preset) return;

        if (contract === null) return;

        for (const param of presetAlert!.params) {
          if (!presetParams[param.name]) return;
        }
        break;
    }

    incStep();
  };

  return (
    <Container size="xl" mt="md" h="100%">
      <Stack>
        <Stepper
          mih="78vh"
          active={activeStep}
          onStepClick={setActiveStep}
          allowNextStepsSelect={false}
          breakpoint="sm"
          styles={{
            root: {
              display: "flex",
              flexDirection: "column",
            },
            content: {
              display: "flex",
              height: "100%",
              flexGrow: 1,
            },
          }}
        >
          {steps.map((step, index) => {
            if (step.condition === false) return null;

            return (
              <Stepper.Step
                key={index}
                label={step.label}
                description={step.description}
              >
                {step.children}
              </Stepper.Step>
            );
          })}
        </Stepper>

        <Flex direction="row" justify="center" gap="10%" mb="lg" w="100%">
          {activeStep > 0 && (
            <Button onClick={decStep} variant="outline" color="gray" size="lg">
              Back
            </Button>
          )}

          <Button onClick={maybeMoveAheadOrCreate} color="green" size="lg">
            {activeStep === steps.length - 1 ? "Create" : "Next"}
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}

CreateAlert.getLayout = (page: ReactNode) => (
  <AppShellLayout activeLink="alerts">{page}</AppShellLayout>
);
