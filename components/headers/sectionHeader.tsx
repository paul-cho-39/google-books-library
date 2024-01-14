import classNames from 'classnames';

interface SectionHeaderProps {
   title: string;
   className?: string;
}

const SectionHeader = ({ title, className }: SectionHeaderProps) => {
   return (
      <h2
         className={classNames(
            className,
            'text-xl md:text-2xl lg:text-3xl mt-2 mb-4 text-slate-700 dark:text-slate-200 lg:mb-4'
         )}
      >
         <strong>{title}</strong>
      </h2>
   );
};

export default SectionHeader;
