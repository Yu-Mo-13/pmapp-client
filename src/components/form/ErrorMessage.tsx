type ErrorMessageProps = {
  message: string;
  className?: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
}) => {
  return (
    <div className={`mt-1 text-sm text-red-500 ${className}`}>{message}</div>
  );
};
