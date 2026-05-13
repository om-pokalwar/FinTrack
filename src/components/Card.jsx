export default function Card({ children, className = '', noPadding = false }) {
  return (
    <div className={`glass-panel ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
}
