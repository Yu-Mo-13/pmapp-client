import Link from 'next/link';

interface CancelButtonProps {
  to: string;
}

export default function CancelButton(props: CancelButtonProps) {
  return (
    <Link
      href={props.to}
      className="px-8 py-3 text-[18px] border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors inline-block text-center"
    >
      キャンセル
    </Link>
  );
}
