const LoadingState = ({ label = "Loading..." }) => {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-md border border-slate-200 bg-white">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <span className="ml-3 text-sm font-semibold text-slate-600">{label}</span>
    </div>
  );
};

export default LoadingState;
