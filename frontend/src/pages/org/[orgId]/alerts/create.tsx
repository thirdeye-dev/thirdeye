import { Button, Container, Flex, Stack, Stepper } from "@mantine/core";
import { ReactNode, useState } from "react";

import AppShellLayout from "@/layouts/AppShellLayout";
import ChoosePresetAlert from "@/components/alerts/create/ChoosePresetAlert";
import TypeSelectionStep from "@/components/alerts/create/TypeSelectionStep";
import InformationReviewStep from "@/components/alerts/create/InformationReviewStep";
import { AlertType } from "@/models/alertType";
import PresetAlert from "@/models/presetAlert";
import SetupPresetAlert from "@/components/alerts/create/SetupPresetAlert";
import { useRouter } from "next/router";
import Contract from "@/models/contract";
import { createPresetAlert } from "@/services/presetAlerts";
import { notifications } from "@mantine/notifications";
import CustomDetails from "@/components/alerts/create/CustomDetails";
import CustomBuildAlert from "@/components/alerts/create/CustomBuildAlert";
import { createAlert } from "@/services/alerts";
import useContracts from "@/hooks/use-contracts";

export default function CreateAlert() {
  const router = useRouter();

  const orgId = router.query.orgId as string;

  const { contracts } = useContracts(orgId);

  const [alertType, setAlertType] = useState<AlertType | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );

  // Preset
  const [presetAlert, setPresetAlert] = useState<PresetAlert | null>(null);
  const [presetParams, setPresetParams] = useState<Record<string, any>>({});

  // Custom
  const [customName, setCustomName] = useState<string>("");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [customYaml, setCustomYaml] = useState<string>("");

  const [activeStep, setActiveStep] = useState(0);

  const incStep = () =>
    setActiveStep((current) =>
      current < getPossibleStepsLength() ? current + 1 : current
    );

  const decStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

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
          contracts={contracts!}
          setContract={setSelectedContract}
        />
      ),
      condition: alertType == AlertType.Preset,
    },
    {
      label: "Set Details",
      description: "Set name and description",
      children: (
        <CustomDetails
          setName={setCustomName}
          setDescription={setCustomDescription}
          contracts={contracts!}
          setContract={setSelectedContract}
        />
      ),
      condition: alertType == AlertType.Custom,
    },
    {
      label: "Build Alert",
      description: "Define your custom alert",
      children: <CustomBuildAlert yaml={customYaml!} setYaml={setCustomYaml} />,
      condition: alertType == AlertType.Custom,
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
          contract={selectedContract!}
          customName={customName!}
          customDescription={customDescription!}
          customYaml={customYaml!}
        />
      ),
    },
  ];

  const getPossibleStepsLength = () => {
    const possibleSteps = steps.filter((step) => step.condition !== false);

    return possibleSteps.length;
  };

  const performCreate = async () => {
    switch (alertType) {
      case AlertType.Preset:
        await createPresetAlert(
          {
            name: presetAlert!.name,
            // @ts-ignore FIXME: fix type
            params: presetParams,
          },
          selectedContract!.id
        );
        break;

      case AlertType.Custom:
        await createAlert(
          {
            name: customName,
            description: customDescription,
            alert_yaml: customYaml,
          },
          orgId,
          selectedContract!.id
        );
        break;
    }

    notifications.show({
      title: "Alert Created",
      message: "Your alert has been created",
      color: "teal",
    });
    router.push(`/org/${orgId}/contracts/${selectedContract!.id}`);
  };

  const maybeMoveAheadOrCreate = () => {
    if (activeStep === getPossibleStepsLength() - 1) {
      performCreate();
    }

    const performCommonChecks = () => {
      if (alertType === null) return false;
    };

    const performPresetChecks = () => {
      if (activeStep === 1 && presetAlert == null) return false;

      if (activeStep === 2) {
        if (selectedContract === null) return false;

        for (const param of presetAlert!.params) {
          if (!presetParams[param.name]) return false;
        }
      }
    };

    const performCustomChecks = () => {
      if (activeStep === 1) {
        if (!customName) return false;
        if (!selectedContract) return false;
      }

      if (activeStep === 2) {
        if (!customYaml) return false;
      }
    };

    if (performCommonChecks() === false) return;

    switch (alertType) {
      case AlertType.Preset:
        if (performPresetChecks() === false) return;
        break;

      case AlertType.Custom:
        if (performCustomChecks() === false) return;
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
            if (step.condition === false) return;

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
            {activeStep === getPossibleStepsLength() - 1 ? "Create" : "Next"}
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}

CreateAlert.getLayout = (page: ReactNode) => (
  <AppShellLayout activeLink="alerts">{page}</AppShellLayout>
);
