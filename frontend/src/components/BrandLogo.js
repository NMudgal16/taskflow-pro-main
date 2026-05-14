const BrandLogo = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="brand-mark">
        <span>TF</span>
      </div>
      {!compact && (
        <div>
          <div className="text-lg font-bold text-slate-950">TaskFlow Pro</div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Team command center</div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
