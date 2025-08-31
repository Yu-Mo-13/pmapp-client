import { redirect } from 'next/navigation';

interface CancelButtonProps {
  to: string;
}

export default function CancelButton(props: CancelButtonProps) {
  const handleCancelClick = async () => {
    "use server";
    redirect(props.to);
  };

  return (
    <form action={handleCancelClick}>
      <button className="px-8 py-3 text-[18px] border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
        キャンセル
      </button>
    </form>
  );
}
