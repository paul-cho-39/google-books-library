// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import FormSignIn, { Inputs } from '@/components/Login/credentials';
// import { SignInForm } from '@/lib/types/forms';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { changeEmail, changeNames, changePassword } from '@/lib/resolvers/accountSettings';
// import Link from 'next/link';
// import DeleteModalContent from '@/components/modal/modalContentDeletion';
// import ROUTES from '@/utils/routes';
// import { getDataApiUrl } from '@/lib/auth/onetimepassword';
// import ModalOpener from '@/components/modal/openModal';
// import { ModalInnerButton } from '@/components/buttons/modalButton';

// // the setting page may be broken into multiple components?
// export default function SettingPage({}) {
//    const { data: session, status } = useSession();

//    // what happens when router query changes? does router also require
//    // changes?
//    const router = useRouter();
//    const { id } = router?.query;
//    const userId = id as string;

//    // refactored into cleaner code?
//    const onSubmit = async (data: SignInForm) => {
//       const apiUrl = getDataApiUrl(data);
//       const body = { ...data, userId };
//       if (userId) {
//          try {
//             const res = await fetch(apiUrl as string, {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify(body),
//             });
//             return res.json();
//          } catch (e) {
//             console.log(e);
//          } finally {
//             router.reload();
//          }
//       }
//    };

//    return (
//       <main className='flex flex-1 overflow-hidden'>
//          <div className='flex flex-1 flex-col overflow-y-auto xl:overflow-hidden'>
//             {/* <!-- Breadcrumb --> */}
//             <nav
//                aria-label='Breadcrumb'
//                className='border-b border-blue-gray-200 bg-white xl:hidden'
//             >
//                <div className='mx-auto flex max-w-3xl items-start py-3 px-4 sm:px-6 lg:px-8'>
//                   <Link href={ROUTES.HOME}>
//                      <a
//                         href='#'
//                         className='-ml-1 inline-flex items-center space-x-3 text-sm font-medium text-blue-gray-900'
//                      >
//                         {/* <!-- Heroicon name: mini/chevron-left --> */}
//                         <svg
//                            className='h-5 w-5 text-blue-gray-400'
//                            xmlns='http://www.w3.org/2000/svg'
//                            viewBox='0 0 20 20'
//                            fill='currentColor'
//                            aria-hidden='true'
//                         >
//                            <path
//                               fillRule='evenodd'
//                               d='M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z'
//                               clipRule='evenodd'
//                            />
//                         </svg>
//                         <span>Settings</span>
//                      </a>
//                   </Link>
//                </div>
//             </nav>
//             {/* possibly cut this part out */}

//             {/* <!-- Main content --> */}
//             <div className='flex-1 xl:overflow-y-auto'>
//                <div className='mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8'>
//                   <h1 className='text-3xl font-bold tracking-tight text-blue-gray-900 mb-10'>
//                      Account Settings
//                   </h1>

//                   {/* rough draft */}
//                   {/* why not just use a hook? */}
//                   <div className='my-5'>
//                      <SettingsWithDisclosure disclosureName='Account Settings'>
//                         <FormSignIn
//                            resolver={yupResolver(changeNames())}
//                            isDisclosure={true}
//                            onSubmit={onSubmit}
//                            shouldReset={true}
//                         >
//                            <Inputs
//                               labelName={'First Name'}
//                               name={'firstName'}
//                               displayLabel={true}
//                            />
//                            <Inputs labelName={'Last Name'} name={'lastName'} displayLabel={true} />
//                            <button
//                               type='submit'
//                               className='inline-flex justify-center rounded-md border border-transparent bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
//                            >
//                               Update account
//                            </button>
//                         </FormSignIn>
//                      </SettingsWithDisclosure>
//                   </div>

//                   {/* email preference */}
//                   <div className='mt-5'>
//                      <SettingsWithDisclosure disclosureName='Change email'>
//                         <FormSignIn
//                            resolver={yupResolver(changeEmail())}
//                            isDisclosure={true}
//                            onSubmit={onSubmit}
//                            shouldReset={true}
//                         >
//                            <Inputs labelName={'Email'} name={'email'} displayLabel={true} />
//                            <button
//                               type='submit'
//                               className='my-4 inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
//                            >
//                               Change email
//                            </button>
//                         </FormSignIn>
//                      </SettingsWithDisclosure>
//                   </div>

//                   <div className='my-5'>
//                      <SettingsWithDisclosure disclosureName='Change password'>
//                         <FormSignIn
//                            resolver={yupResolver(changePassword())}
//                            isDisclosure={true}
//                            onSubmit={onSubmit}
//                            shouldReset={true}
//                         >
//                            <Inputs
//                               labelName={'Current password'}
//                               name={'password'}
//                               type='password'
//                               displayLabel={true}
//                            />
//                            <Inputs
//                               labelName={'New password'}
//                               name={'newPassword'}
//                               type='password'
//                               displayLabel={true}
//                            />
//                            <Inputs
//                               labelName={'Confirm password'}
//                               name={'confirmPassword'}
//                               type='password'
//                               displayLabel={true}
//                            />
//                            <button
//                               type='submit'
//                               className='inline-flex justify-center rounded-md border border-transparent bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
//                            >
//                               Change password
//                            </button>
//                         </FormSignIn>
//                      </SettingsWithDisclosure>
//                   </div>

//                   {/* this part reserved for larger screens */}
//                   <form className='divide-y-blue-gray-200 mt-6 space-y-8 divide-y'>
//                      <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6'>
//                         <div className='sm:col-span-6'>
//                            <label
//                               htmlFor='photo'
//                               className='block text-sm font-medium text-blue-gray-900'
//                            >
//                               Photo
//                            </label>
//                            <div className='mt-1 flex items-center'>
//                               <img
//                                  className='inline-block h-12 w-12 rounded-full'
//                                  src='https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80'
//                                  alt=''
//                               />
//                               <div className='ml-4 flex'>
//                                  <div className='relative flex cursor-pointer items-center rounded-md border border-blue-gray-300 bg-white py-2 px-3 shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-blue-gray-50 hover:bg-blue-gray-50'>
//                                     <label
//                                        htmlFor='user-photo'
//                                        className='pointer-events-none relative text-sm font-medium text-blue-gray-900'
//                                     >
//                                        <span>Change</span>
//                                        <span className='sr-only'> user photo</span>
//                                     </label>
//                                     <input
//                                        id='user-photo'
//                                        name='user-photo'
//                                        type='file'
//                                        className='absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0'
//                                     />
//                                  </div>
//                                  <button
//                                     type='button'
//                                     className='ml-3 rounded-md border border-transparent bg-transparent py-2 px-3 text-sm font-medium text-blue-gray-900 hover:text-blue-gray-700 focus:border-blue-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-gray-50'
//                                  >
//                                     Remove
//                                  </button>
//                               </div>
//                            </div>
//                         </div>
//                      </div>

//                      <div className='grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6'>
//                         <div className='sm:col-span-6'>
//                            <h2 className='text-xl font-medium text-blue-gray-900'>
//                               Personal Information
//                            </h2>
//                            <p className='mt-1 text-sm text-blue-gray-500'>
//                               This information will be displayed publicly so be careful what you
//                               share.
//                            </p>
//                         </div>

//                         <div className='sm:col-span-3'>
//                            <label
//                               htmlFor='email-address'
//                               className='block text-sm font-medium text-blue-gray-900'
//                            >
//                               Email address
//                            </label>
//                            <input
//                               type='text'
//                               name='email-address'
//                               id='email-address'
//                               autoComplete='email'
//                               className='mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
//                            />
//                         </div>

//                         <div className='sm:col-span-3'>
//                            <label
//                               htmlFor='phone-number'
//                               className='block text-sm font-medium text-blue-gray-900'
//                            >
//                               Phone number
//                            </label>
//                            <input
//                               type='text'
//                               name='phone-number'
//                               id='phone-number'
//                               autoComplete='tel'
//                               className='mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
//                            />
//                         </div>

//                         <div className='sm:col-span-3'>
//                            <label
//                               htmlFor='country'
//                               className='block text-sm font-medium text-blue-gray-900'
//                            >
//                               Country
//                            </label>
//                            <select
//                               id='country'
//                               name='country'
//                               autoComplete='country-name'
//                               className='mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
//                            >
//                               <option></option>
//                               <option>United States</option>
//                               <option>Canada</option>
//                               <option>Mexico</option>
//                            </select>
//                         </div>

//                         <div className='sm:col-span-3'>
//                            <label
//                               htmlFor='language'
//                               className='block text-sm font-medium text-blue-gray-900'
//                            >
//                               Language
//                            </label>
//                            <input
//                               type='text'
//                               name='language'
//                               id='language'
//                               className='mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
//                            />
//                         </div>
//                      </div>

//                      {/* Modal to delete account */}
//                      {/* add CATCHPA for bots */}
//                      <div className='flex flex-col justify-start items-center'>
//                         <ModalOpener DialogTitle={`Confirm deletion of `}>
//                            <DeleteModalContent />
//                            <div className='flex justify-center items-center'>
//                               <ModalInnerButton
//                                  name='Delete Button'
//                                  id={userId}
//                                  url='/user/deleteAccount'
//                                  method='DELETE'
//                                  shouldSignOut={true}
//                               />
//                            </div>
//                         </ModalOpener>
//                      </div>
//                   </form>
//                </div>
//             </div>
//          </div>
//       </main>
//    );
// }

// // export const getServerSideProps = async (context: any) => {
// //   const getUser = await getSession(context);
// //   const user = getUserId(getUser);
// //   return {
// //     props: {
// //       user: user.id,
// //     },
// //   };
// // };
// // // helper function to avoid typescript error
// // const getUserId = (userInfo: any) => {
// //   const { user } = userInfo;
// //   return user;
// // };

export default Settings;
