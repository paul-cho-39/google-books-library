import react from 'react';

interface DropdownProps {
   value: string;
   options: { value: string; label: string }[];
   // onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, field: string) => void;
   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
   label: string;
   htmlFor: string;
   ariaLabel?: string;
}

const Dropdown: React.FunctionComponent<DropdownProps> = ({
   value,
   options,
   onChange,
   label,
   htmlFor,
   ariaLabel,
}) => (
   <label className='block mb-2' htmlFor={htmlFor}>
      {label}
      <select
         id={htmlFor}
         aria-label={ariaLabel}
         className='block w-full bg-white dark:bg-gray-800 text-black dark:text-white mt-1 rounded'
         value={value}
         onChange={onChange}
      >
         {options.map((option) => (
            <option key={option.value} value={option.value}>
               {option.label}
            </option>
         ))}
      </select>
   </label>
);

export default Dropdown;
