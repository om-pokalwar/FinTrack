export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClass = 'animate-pulse bg-dark-700/50';
  
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  return (
    <div className={`${baseClass} ${variants[variant]} ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-panel p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton variant="circular" className="w-10 h-10" />
      </div>
      <Skeleton variant="text" className="w-full mt-6" />
    </div>
  );
}
