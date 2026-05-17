import { Loader2 } from 'lucide-react';

export default function Loader({ fullScreen = false, size = 32 }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 
        size={size} 
        className="animate-spin text-brand-500" 
      />
      <span className="text-sm text-gray-400 font-medium animate-pulse">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-8">
      {content}
    </div>
  );
}
