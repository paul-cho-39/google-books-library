import classNames from 'classnames';

type SpinnerColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'indigo';
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
const sizeClasses: { [key in SpinnerSize]: string } = {
   xs: 'w-4 h-4',
   sm: 'w-6 h-6',
   md: 'w-8 h-8',
   lg: 'w-10 h-10',
   xl: 'w-12 h-12',
   '2xl': 'w-16 h-16',
};

const colorClasses: { [key in SpinnerColor]: string } = {
   blue: 'border-blue-500',
   red: 'border-red-500',
   green: 'border-green-500',
   yellow: 'border-yellow-500',
   purple: 'border-purple-500',
   indigo: 'border-indigo-500',
};

interface SpinnerProps {
   size?: SpinnerSize;
   color?: SpinnerColor;
   className?: string; // for position
}

const Spinner = ({ size = 'xl', color = 'blue', className }: SpinnerProps) => {
   const spinnerSize = sizeClasses[size];
   const spinnerColor = colorClasses[color];

   return (
      <div
         aria-busy={true}
         role='status'
         aria-label='loading'
         className={classNames(`w-full inline-flex items-center justify-center`, className)}
      >
         <div
            style={{}}
            className={`border-t-2 ${spinnerColor} ${spinnerSize} border-solid rounded-full animate-spin`}
         ></div>
      </div>
   );
};

export default Spinner;
