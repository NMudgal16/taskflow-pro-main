const PageHeader = ({ eyebrow, title, description, action }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
