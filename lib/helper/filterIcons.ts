import { IconProps } from '@/components/icons/headerIcons';

const filterIcons = (icons: IconProps, userId: string | null) => {
   if (userId) {
      return icons;
   } else {
      // Filter out 'Profile' if userId is null or undefined
      const { profile, ...filteredIcons } = icons;
      return filteredIcons;
   }
};

export default filterIcons;
