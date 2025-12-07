export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return <div className="mt-1 ml-4 text-sm text-red-500">{message}</div>;
};
