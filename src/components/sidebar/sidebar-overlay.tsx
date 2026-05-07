type SidebarOverlayProps = {
  open: boolean;
  className: string;
  onClick: () => void;
};

function SidebarOverlay({ open, className, onClick }: SidebarOverlayProps) {
  return (
    <div
      className={`${className} ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClick}
    />
  );
}

export default SidebarOverlay;
