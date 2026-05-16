const EmptyState = ({ title, message }) => {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
};

export default EmptyState;
