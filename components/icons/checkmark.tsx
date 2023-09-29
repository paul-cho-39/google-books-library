interface CheckmarkProps {
  setUnknown: (update: unknown) => void;
}

const Checkmark = ({ setUnknown }: CheckmarkProps) => {
  return (
    <div className="w-full flex items-end justify-end">
      <span className="font-bold text-sm pr-2">
        Check here if you cannot recall
      </span>
      <input
        onClick={setUnknown}
        aria-describedby="is-date-known"
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-indigo-500"
      />
    </div>
  );
};

export default Checkmark;
