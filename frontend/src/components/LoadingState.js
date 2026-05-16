const LoadingState = ({ label = "Loading..." }) => {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100" />
      <span className="ml-3 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  );
};

export default LoadingState;
