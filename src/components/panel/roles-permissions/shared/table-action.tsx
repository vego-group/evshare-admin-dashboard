import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TableAction(props: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  permission?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      onClick={props.onClick}
      title={props.label}
      aria-label={props.label}
      className={cn(
        "size-10 rounded-lg",
        props.destructive ? "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600" :
          props.permission ? "bg-violet-50 text-violet-600 hover:bg-violet-100" :
          props.label === "عرض" ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-amber-50 text-orange-500 hover:bg-amber-100",
      )}
    >
      {props.icon}
    </Button>
  );
}
