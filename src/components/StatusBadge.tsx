import type { ProjectStatus } from '../types';
import clsx from 'clsx';

const statusColors: Record<ProjectStatus, string> = {
  Planned: 'bg-gray-100 text-gray-700',
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Blocked: 'bg-red-100 text-red-800',
  'On Hold': 'bg-orange-100 text-orange-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-rose-100 text-rose-700',
};

interface BadgeProps {
  status: ProjectStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        statusColors[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
