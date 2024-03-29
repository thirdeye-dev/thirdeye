import classes from "./Navbar.module.css";

import { Center, rem, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/router";

import { AiFillAlert, AiFillEye } from "react-icons/ai";
import { FaFileContract } from "react-icons/fa";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { IconType } from "react-icons/lib";

import UserAvatar from "../UserAvatar";

interface NavbarLinkProps {
  icon?: React.FC<any>;
  label?: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  Icon = Icon!; // fixes a weird typescript error

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />{" "}
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

interface NavLink {
  icon?: IconType;
  label?: string;
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { icon: AiFillEye, label: "Overview", name: "overview", href: "overview" },
  {
    icon: FaFileContract,
    label: "Smart Contracts",
    name: "contracts",
    href: "contracts",
  },
  { icon: AiFillAlert, label: "Alerts", name: "alerts", href: "alerts/create" }, // TODO: Change this to alerts when the page is created
];

export default function NavbarMinimal({
  activeLink = "contracts",
}: {
  activeLink?: string;
}) {
  const router = useRouter();
  const organizationId = router.query.orgId as string;

  const onClickLink = (link: NavLink) => {
    router.push(`/org/${organizationId}/${link.href}`);
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
    router.push(`/org/${organizationId}/settings`);
  };

  const onClickLogout = () => {
    router.push(`/logout`);
  };

  return (
    <>
      <Center>
        <UserAvatar />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink
          icon={SettingsIcon}
          label="Settings"
          onClick={onClickSettings}
        />

        <NavbarLink icon={LogoutIcon} label="Logout" onClick={onClickLogout} />
      </Stack>
    </>
  );
}
