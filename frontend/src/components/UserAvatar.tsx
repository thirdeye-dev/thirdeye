import useCurrentUser from "@/hooks/use-current-user";
import { Avatar } from "@mantine/core";

export default function UserAvatar({
  radius = 36,
  ...props
}: {
  radius?: number;
}) {
  const { user } = useCurrentUser();

  return <Avatar src={user?.avatar} radius={radius} {...props} />;
}
