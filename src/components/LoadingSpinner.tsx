export default function LoadingSpinner({ 
  size = 'default',
  message = 'Loading...'
}: {
  size?: 'small' | 'default' | 'large';
  message?: string;
}) {
  const sizeClasses = {
    small: 'spinner-border-sm',
    default: '',
    large: 'spinner-border-lg'
  };

  return (
    <div className="container-fluid w-50 text-center h-100 justify-content-center align-items-center d-flex">
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">{message}</span>
      </div>
    </div>
  );
}
