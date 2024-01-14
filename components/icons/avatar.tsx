import classNames from 'classnames';
import Image from 'next/image';

export type UserAvatarProps = {
   avatarUrl: string | null | undefined;
   size: {
      height: number;
      width: number;
   };
   className?: string;
};

const UserAvatar = ({ avatarUrl, size, className }: UserAvatarProps) => {
   const imageHref = !avatarUrl ? '/avatar.png' : avatarUrl;

   return (
      <Image
         alt='User Avatar'
         height={size.height}
         width={size.width}
         objectFit='contain'
         className={classNames(className, 'rounded-full')}
         src={imageHref}
      />
   );
};

export default UserAvatar;
