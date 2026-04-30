import React from 'react';

type MobileEmptyStateProps = {
  message: string;
};

const MobileEmptyState: React.FC<MobileEmptyStateProps> = ({ message }) => {
  return <p className="py-6 text-center text-sm text-gray-600">{message}</p>;
};

export default MobileEmptyState;
