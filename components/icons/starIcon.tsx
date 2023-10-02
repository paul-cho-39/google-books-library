import { StarIcon } from '@heroicons/react/20/solid';

export type Size = 'small' | 'medium' | 'large';

export interface StarProps {
   fillPercentage: number;
   size?: Size;
}

const sizes = {
   small: { container: 'w-4 h-4', icon: 'w-3 h-3' },
   medium: { container: 'w-6 h-6', icon: 'w-5 h-5' },
   large: { container: 'w-10 h-10', icon: 'w-8 h-8' },
};

const Star: React.FunctionComponent<StarProps> = ({ fillPercentage, size = 'small' }) => {
   const { container, icon } = sizes[size];
   return (
      <div className={`${container} relative`}>
         <StarIcon className={`absolute text-gray-600 dark:text-gray-800 ${icon}`} />
         <div style={{ width: `${fillPercentage}` }} className={`overflow-hidden absolute ${icon}`}>
            <StarIcon className={`text-yellow-400 ${icon}`} />
         </div>
      </div>
   );
};

export default Star;
