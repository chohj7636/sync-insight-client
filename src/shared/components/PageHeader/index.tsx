interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <header className="mb-7">
      {/* Breadcrumb */}
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
};

export default PageHeader;
