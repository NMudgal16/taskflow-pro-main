const BrandLogo = ({ compact = false, onDark = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="brand-mark">
        <span>TF</span>
      </div>
      {!compact && (
        <div>
          <div
            className={`text-lg font-bold transition-colors duration-300 ${
              onDark ? "text-white" : "text-slate-950 dark:text-white"
            }`}
          >
            TaskFlow Pro
          </div>
          <div
            className={`text-xs font-medium uppercase tracking-wide ${
              onDark ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Team command center
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
