import { getGreeting } from '@/lib/data-utils';

interface DashboardHeaderProps {
  onBack?: () => void;
  onAdd?: () => void;
  onNotifications?: () => void;
  notificationCount?: number;
}

export function DashboardHeader({
  onBack,
  onAdd,
  onNotifications,
  notificationCount = 0,
}: DashboardHeaderProps) {
  const greeting = getGreeting();

  return (
    <div className="bg-bg-beige text-text-primary relative overflow-hidden border-b border-border/30">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="px-6 py-5 flex items-center justify-between relative z-10">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20"
          aria-label="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>

        <div className="flex-1 text-center">
          <div className="text-sm text-text-secondary mb-1 font-medium">{greeting}</div>
          <div className="text-2xl font-bold tracking-tight text-text-primary">ፍሬ ሃይማኖት መዝገብ</div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onNotifications}
            className="relative p-2.5 rounded-lg hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full" />
            )}
          </button>
          <button
            onClick={onAdd}
            className="p-2.5 rounded-lg hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20"
            aria-label="Add"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
