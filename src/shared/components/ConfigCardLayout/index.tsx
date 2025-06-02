import React from 'react';

interface ConfigCardLayoutProps {
  title: string;
  className?: string;
  optionButton?: React.ReactNode;
  children: React.ReactNode;
}

const ConfigCardLayout = ({
  title,
  className,
  optionButton,
  children,
}: ConfigCardLayoutProps) => {
  return (
    <div
      className={`flex w-full flex-col gap-4 rounded-md border border-[#D0D5DD] px-7 py-5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">{title}</p>
        {optionButton}
      </div>
      <div className="h-[1px] w-full bg-[#D0D5DD]" />
      {children}
    </div>
  );
};

export default ConfigCardLayout;
