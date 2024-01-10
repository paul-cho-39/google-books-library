const SingleComment = () => {
   return (
      <div className='antialiased mx-auto max-w-screen-sm'>
         <h3 className='mb-4 text-lg font-semibold text-gray-900'>Comments</h3>

         <div className='space-y-4'>
            <div className='flex'>
               <div className='flex-shrink-0 mr-3'>
                  <img
                     className='mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10'
                     src='https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
                     alt=''
                  />
               </div>
               <div className='flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed'>
                  <strong>Sarah</strong> <span className='text-xs text-gray-400'>3:34 PM</span>
                  <p className='text-sm'>
                     Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                     tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                  </p>
                  <div className='mt-4 flex items-center'>
                     <div className='flex -space-x-2 mr-2'>
                        <img
                           className='rounded-full w-6 h-6 border border-white'
                           src='https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80'
                           alt=''
                        />
                        <img
                           className='rounded-full w-6 h-6 border border-white'
                           src='https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80'
                           alt=''
                        />
                     </div>
                     <div className='text-sm text-gray-500 font-semibold'>5 Replies</div>
                  </div>
               </div>
            </div>

            <div className='flex'>
               <div className='flex-shrink-0 mr-3'>
                  <img
                     className='mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10'
                     src='https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
                     alt=''
                  />
               </div>
               <div className='flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed'>
                  <strong>Sarah</strong> <span className='text-xs text-gray-400'>3:34 PM</span>
                  <p className='text-sm'>
                     Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                     tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                  </p>
                  <h4 className='my-5 uppercase tracking-wide text-gray-400 font-bold text-xs'>
                     Replies
                  </h4>
                  <div className='space-y-4'>
                     <div className='flex'>
                        <div className='flex-shrink-0 mr-3'>
                           <img
                              className='mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8'
                              src='https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
                              alt=''
                           />
                        </div>
                        <div className='flex-1 bg-gray-100 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed'>
                           <strong>Sarah</strong>{' '}
                           <span className='text-xs text-gray-400'>3:34 PM</span>
                           <p className='text-xs sm:text-sm'>
                              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                              sed diam voluptua.
                           </p>
                        </div>
                     </div>
                     <div className='flex'>
                        <div className='flex-shrink-0 mr-3'>
                           <img
                              className='mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8'
                              src='https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
                              alt=''
                           />
                        </div>
                        <div className='flex-1 bg-gray-100 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed'>
                           <strong>Sarah</strong>{' '}
                           <span className='text-xs text-gray-400'>3:34 PM</span>
                           <p className='text-xs sm:text-sm'>
                              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                              sed diam voluptua.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

// CONSTANTS - for maximum comment length

// HEADERS - component
// Reviews - component + hooks
// Leave a review at the top - Beginning #Section then add link -> to the bottom

// for each comment -> (reply) -> to #Secton for comments
// comments + ratings

// adding comments section
const Comments = () => {
   return (
      <div className='relative max-w-2xl bg-white rounded-lg border pt-4 mx-auto mt-20'>
         <div className='absolute px-2 top-0 -left-[0.5] bg-indigo-200 rounded-tl-lg rounded-br-lg'>
            <h2 className='text-md font-semibold text-gray-800'>Discussion</h2>
         </div>
         <form>
            <div className='w-full px-3 mb-2 mt-6'>
               <textarea
                  className='bg-gray-100 rounded border border-gray-400 leading-normal w-full h-28 p-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white'
                  name='body'
                  placeholder='Your Review'
               ></textarea>
            </div>
            <div className='w-full flex justify-end px-3 my-3'>
               <button className='px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 text-lg'>
                  Post
               </button>
            </div>
         </form>
      </div>
   );
};

// extra features to consider:
// should it add bold, italics, and links for basic features (possibly use third-party lib?)
