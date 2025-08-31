interface SubmitButtonProps {
  onSubmit: () => void;
  text: string;
}

export default function SubmitButton(props: SubmitButtonProps) {
  return (
    <form action={props.onSubmit}>
      <button
        className="text-white w-36 px-6 py-3 rounded bg-[#3CB371] text-[18px] font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-200"
      >
        {props.text}
      </button>
    </form>
  );
}
