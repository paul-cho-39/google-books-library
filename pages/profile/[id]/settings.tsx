import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FormSignIn, { Inputs } from '@/components/login/credentials';
import { SignInForm } from '@/lib/types/forms';
import { yupResolver } from '@hookform/resolvers/yup';
import { changeEmail, changeNames, changePassword } from '@/lib/resolvers/accountSettings';
import Link from 'next/link';
import DeleteModalContent from '@/components/modal/modalContentDeletion';
import ROUTES from '@/utils/routes';
import { getDataApiUrl } from '@/lib/auth/onetimepassword';
import ModalOpener from '@/components/modal/openModal';
import { ModalInnerButton } from '@/components/buttons/modalButton';
import Accordian from '@/components/disclosures/disclosure';
import { useState } from 'react';

export default function Settings({}) {
   // const { data: session, status } = useSession();
   const [isModalOpen, setModalOpen] = useState(false);

   const router = useRouter();
   const { id: userId } = router?.query;

   // refactored into cleaner code?
   const onSubmit = async (data: SignInForm) => {
      const apiUrl = getDataApiUrl(data);
      const body = { ...data, userId };
      if (userId) {
         try {
            const res = await fetch(apiUrl as string, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(body),
            });
            return res.json();
         } catch (e) {
            console.error(e);
         }
      }
   };

   return (
      <div className='min-h-screen mx-auto p-6 lg:p-10 dark:bg-slate-800'>
         <main className='flex flex-1 overflow-hidden dark: '>
            <div className='flex flex-1 flex-col overflow-y-auto xl:overflow-hidden'>
               <div className='flex-1 xl:overflow-y-auto'>
                  <div className='mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8'>
                     <h1 className='text-3xl font-bold tracking-tight text-blue-gray-900 mb-10 dark:text-slate-300'>
                        Account Settings
                     </h1>

                     <div className='my-5'>
                        <Accordian disclosureName='Account Settings'>
                           <FormSignIn
                              resolver={yupResolver(changeNames())}
                              isDisclosure={true}
                              onSubmit={onSubmit}
                              shouldReset={true}
                           >
                              <Inputs
                                 labelName={'First Name'}
                                 name={'firstName'}
                                 displayLabel={true}
                              />
                              <Inputs
                                 labelName={'Last Name'}
                                 name={'lastName'}
                                 displayLabel={true}
                              />
                              <button
                                 type='submit'
                                 className='inline-flex justify-center rounded-md border border-transparent bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                              >
                                 Update account
                              </button>
                           </FormSignIn>
                        </Accordian>
                     </div>
                     <div className='mt-5'>
                        <Accordian disclosureName='Change email'>
                           <FormSignIn
                              resolver={yupResolver(changeEmail())}
                              isDisclosure={true}
                              onSubmit={onSubmit}
                              shouldReset={true}
                           >
                              <Inputs labelName={'Email'} name={'email'} displayLabel={true} />
                              <button
                                 type='submit'
                                 className='my-4 inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                              >
                                 Change email
                              </button>
                           </FormSignIn>
                        </Accordian>
                     </div>
                     <div className='my-5'>
                        <Accordian disclosureName='Change password'>
                           <FormSignIn
                              resolver={yupResolver(changePassword())}
                              isDisclosure={true}
                              onSubmit={onSubmit}
                              shouldReset={true}
                           >
                              <Inputs
                                 labelName={'Current password'}
                                 name={'password'}
                                 type='password'
                                 displayLabel={true}
                              />
                              <Inputs
                                 labelName={'New password'}
                                 name={'newPassword'}
                                 type='password'
                                 displayLabel={true}
                              />
                              <Inputs
                                 labelName={'Confirm password'}
                                 name={'confirmPassword'}
                                 type='password'
                                 displayLabel={true}
                              />
                              <button
                                 type='submit'
                                 className='inline-flex justify-center rounded-md border border-transparent bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                              >
                                 Change password
                              </button>
                           </FormSignIn>
                        </Accordian>
                     </div>
                     <div className='flex flex-col justify-start items-center'>
                        <button
                           onClick={(e) => {
                              // e.preventDefault();
                              setModalOpen(true);
                           }}
                           className='text-red-500 text-xl my-6 lg:my-10 border-black rounded-md'
                        >
                           Delete Your Account
                        </button>
                        <ModalOpener
                           DialogTitle={`Confirm to delete your account`}
                           isOpen={isModalOpen}
                           setIsOpen={setModalOpen}
                        >
                           <DeleteModalContent />
                           <div className='flex justify-center items-center'>
                              <ModalInnerButton id={userId as string} shouldSignOut={true} />
                           </div>
                        </ModalOpener>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
