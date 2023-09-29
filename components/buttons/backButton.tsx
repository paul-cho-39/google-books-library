import { ArrowLeftIcon } from "@heroicons/react/20/solid";

interface ButtonProps {
  onClick: () => void;
}

export const BackButton = ({ onClick }: ButtonProps) => {
  return (
    <div className="flex flex-col items-start -mt-1.5 mb-5 -ml-2">
      <button
        className="inline text-sm font-secondary hover:border-black"
        onClick={onClick}
      >
        <ArrowLeftIcon className="h-6 inline-flex hover:rounded-full hover:scale-125 hover:border-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:rounded-full" />
        <span className="sr-only">Back button</span>
      </button>
    </div>
  );
};
