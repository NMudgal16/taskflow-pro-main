const BrandLogo = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="brand-mark">
        <span>TF</span>
      </div>
      {!compact && (
        <div>
          <div className="text-lg font-bold text-slate-950 transition-colors duration-300 dark:text-white">TaskFlow Pro</div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors duration-300 dark:text-slate-400">Team command center</div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
