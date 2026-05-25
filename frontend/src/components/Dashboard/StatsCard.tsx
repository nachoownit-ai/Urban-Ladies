import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'primary' | 'green' | 'blue' | 'orange';
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  const iconBgClasses: Record<string, string> = {
    primary: 'bg-primary-200',
    green: 'bg-green-200',
    blue: 'bg-blue-200',
    orange: 'bg-orange-200',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${iconBgClasses[color]} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
