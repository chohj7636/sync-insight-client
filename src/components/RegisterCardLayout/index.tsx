interface RegisterCardLayoutProps {
  title: string;
  optionButton?: React.ReactNode;
  children: React.ReactNode;
}

const RegisterCardLayout = ({
  title,
  optionButton,
  children,
}: RegisterCardLayoutProps) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-md border border-[#D0D5DD] px-7 py-5">
      <div className="flex items-center gap-4">
        <p className="text-xl font-bold">{title}</p>
        {optionButton}
      </div>
      <div className="h-[1px] w-full bg-[#D0D5DD]" />
      {children}
    </div>
  );
};

export default RegisterCardLayout;
