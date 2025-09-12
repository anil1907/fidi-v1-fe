import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2" data-testid="empty-state-title">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto" data-testid="empty-state-description">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
