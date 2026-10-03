import { UserIcon } from "./icons";

interface Props {
  name: string;
  size?: number;
}

export const Avatar = ({ name, size = 48 }: Props) => (
  <div className="avatar" style={{ width: size, height: size }} title={name}>
    <UserIcon size={size} />
  </div>
);
