export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-slate-400 text-sm">Loading…</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="glass-card p-8 text-center max-w-md mx-auto mt-12">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="font-semibold text-slate-800 mb-2">Something went wrong</h3>
      <p className="text-sm text-slate-500 mb-4">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-primary">Try Again</button>}
    </div>
  );
}

export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="glass-card p-12 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-5">{description}</p>}
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    PLACED:            'badge-blue',
    VERIFIED:          'badge-blue',
    PROCESSING:        'badge-yellow',
    OUT_FOR_DELIVERY:  'badge-yellow',
    DELIVERED:         'badge-green',
    CANCELLED:         'badge-red',
    PENDING:           'badge-yellow',
    PAID:              'badge-green',
    FAILED:            'badge-red',
    ASSIGNED:          'badge-blue',
    PICKED_UP:         'badge-yellow',
    IN_TRANSIT:        'badge-yellow',
    IN_STOCK:          'badge-green',
    LOW_STOCK:         'badge-yellow',
    OUT_OF_STOCK:      'badge-red',
    EXPIRED:           'badge-red',
    REJECTED:          'badge-red',
  };
  const label = status?.replace(/_/g, ' ');
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{label}</span>;
}

export function StatCard({ icon, label, value, color = 'blue', sub }) {
  const colorMap = {
    blue:   { bg: 'bg-primary-50',  text: 'text-primary-600',  icon: 'bg-primary-100' },
    green:  { bg: 'bg-emerald-50',  text: 'text-emerald-600',  icon: 'bg-emerald-100' },
    yellow: { bg: 'bg-amber-50',    text: 'text-amber-600',    icon: 'bg-amber-100'   },
    red:    { bg: 'bg-red-50',      text: 'text-red-600',      icon: 'bg-red-100'     },
    cyan:   { bg: 'bg-cyan-50',     text: 'text-cyan-600',     icon: 'bg-cyan-100'    },
  };
  const c = colorMap[color];
  return (
    <div className="stat-card">
      <div className={`stat-icon ${c.icon} ${c.text}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}
