import { type LucideIcon } from 'lucide-react';
import { Button } from "../ui/button"

interface ButtonProps {
  icon: LucideIcon;
  label: string;
}

const IconButton = ({ icon: Icon, label }: ButtonProps) => {
  return (
    <Button aria-label={label}>
      <Icon size={16} />
    </Button>
  );
};

export default IconButton;