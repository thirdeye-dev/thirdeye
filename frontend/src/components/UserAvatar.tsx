import { Avatar } from "@mantine/core";

export default function UserAvatar({
  src,
  radius = 36,
  ...props
}: {
  src?: string;
  radius?: number;
}) {
  return <Avatar src={src} radius={radius} {...props} />;
}
