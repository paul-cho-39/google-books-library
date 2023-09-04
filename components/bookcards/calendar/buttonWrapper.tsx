import Button from "./button";

interface WrapperProps {
  skipSubmit: () => void;
  submitWithDates: () => void;
  isLoading?: boolean;
}

const ButtonWrapper = ({
  skipSubmit,
  submitWithDates,
  isLoading,
}: WrapperProps) => {
  return (
    <div className="mt-6 -mb-3.5 px-1 flex flex-row justify-between border-t-[1px] pt-3">
      <Button
        handleSubmit={skipSubmit}
        name="Do not know"
        isLoading={isLoading}
      />
      <Button
        handleSubmit={submitWithDates}
        name="I know"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ButtonWrapper;
