interface ButtonProps<T> {
  handleSubmit?: () => void;
  name: string;
  isLoading?: boolean;
}

export default function Button<T>({
  handleSubmit,
  name,
  isLoading,
}: ButtonProps<T>) {
  return (
    <button
      disabled={isLoading}
      className="font-normal text-[14px] py-2 -mx-1 bg-white border-blue-gray-100 z-50 w-full border-2 hover:bg-blue-gray-200 focus:outline-none"
      onClick={handleSubmit}
    >
      {isLoading ? "Loading" : name}
      <span className="sr-only">{isLoading ? "Loading" : name}</span>
    </button>
  );
}
