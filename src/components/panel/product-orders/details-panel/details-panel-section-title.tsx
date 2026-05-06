function DetailsPanelSectionTitle({ children }: { children: string }) {
  return (
    <h3 className="text-right text-sm font-medium leading-5 tracking-[0.35px] text-gray">
      {children}
    </h3>
  );
}

export default DetailsPanelSectionTitle;
