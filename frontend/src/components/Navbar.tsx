import {
  Avatar,
  Center,
  createStyles,
  Navbar,
  rem,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/router";
import { AiFillAlert, AiFillEye, AiFillHome } from "react-icons/ai";
import { FaFileContract } from "react-icons/fa";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { IconType } from "react-icons/lib";

const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface NavbarLinkProps {
  icon: React.FC<any>;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon size="1.2rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const SettingsIcon = () => {
  return <FiSettings />;
};

const LogoutIcon = () => {
  return <FiLogOut />;
};

const navLinks = [
  { icon: AiFillEye, label: "Overview", name: "overview" },
  { icon: FaFileContract, label: "Smart Contracts", name: "contracts" },
  { icon: AiFillAlert, label: "Alerts", name: "alerts" },
];

export default function NavbarMinimal({
  activeLink = "contracts",
}: {
  activeLink?: string;
}) {
  const router = useRouter();

  const onClickLink = (link: {
    icon?: IconType;
    label?: string;
    name: any;
  }) => {
    router.push(`/org/${router.query.id}/${link.name}`);
  };

  const links = navLinks.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={activeLink === link.name}
      onClick={() => onClickLink(link)}
    />
  ));

  const onClickSettings = () => {
    router.push(`/org/${router.query.id}/settings`);
  };

  const onClickLogout = () => {
    router.push(`/logout`);
  };

  return (
    <Navbar height={"92vh"} width={{ base: 80 }} p="md">
      <Center>
        <Avatar
          src="https://avatars.githubusercontent.com/u/25126241?v=4"
          radius={36}
        />
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarLink
            icon={SettingsIcon}
            label="Settings"
            onClick={onClickSettings}
          />
          <NavbarLink
            icon={LogoutIcon}
            label="Logout"
            onClick={onClickLogout}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}
