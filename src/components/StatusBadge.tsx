import type {} from 'react';
import { OrderStatus } from '../types';
import { Clock, CheckCircle, Truck, Package, XCircle } from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    icon: <Package className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color} ${config.bg}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
