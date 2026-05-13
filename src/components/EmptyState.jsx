import { FileQuestion } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ 
  icon: Icon = FileQuestion, 
  title = "No data found", 
  description = "Get started by creating a new entry.",
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-dark-600/50 rounded-2xl bg-dark-800/20">
      <div className="w-16 h-16 rounded-full bg-dark-700/50 flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
