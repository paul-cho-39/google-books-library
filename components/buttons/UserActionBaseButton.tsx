export {};

interface UserActionBasicButtonProps {
   isDisplayed: boolean;
   onClick: (variables: any | void) => void;
   name: string;
   isLoading: boolean;
   className?: string;
}

const Button = ({
   isDisplayed,
   onClick,
   name,
   isLoading,
   className,
}: UserActionBasicButtonProps) => {
   return (
      <button
         type='button'
         onClick={onClick}
         disabled={!isDisplayed || isLoading}
         className={`${
            isDisplayed ? `${className}` : 'hidden'
         } btn-primary text-base w-72 p-3 bg-indigo-600 text-slate-100 text justify-center focus:bg-indigo-400 focus:ring-black hover:ring-black sm:hover:ring-2 focus:ring-2`}
      >
         {isLoading ? '' : name}
         <span
            className={`p-2 rounded-full ${
               isLoading
                  ? 'animate-spin h-5 w-5 bg-blue-100 border-t-2 border-b-2 bg-clip-content '
                  : 'hidden'
            }
      `}
         ></span>
         <span className='sr-only'>{name}</span>
      </button>
   );
};

export default Button;
