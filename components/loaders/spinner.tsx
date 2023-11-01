const Spinner = () => {
   return (
      <div
         aria-busy={true}
         role='status'
         aria-label='loading'
         className='w-full inline-flex items-center justify-center mt-24'
      >
         <div className='border-t-2 border-blue-400 border-solid rounded-full h-12 w-12 animate-spin'></div>
      </div>
   );
};

export default Spinner;
