const EmptyState = ({ title, message }) => {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{message}</p>
    </div>
  );
};

export default EmptyState;
