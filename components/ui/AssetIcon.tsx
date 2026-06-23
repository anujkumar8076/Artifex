import {
  Box,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  Shapes,
  User,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Image: ImageIcon,
  Shapes,
  LayoutDashboard,
  Box,
  User,
  Heart,
};

export function AssetIcon({ name, ...props }: { name: string } & LucideProps) {
  const C = MAP[name] ?? Box;
  return <C {...props} />;
}
