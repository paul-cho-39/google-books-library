import prisma from '@/lib/prisma';

// import prisma from './../../../lib/prisma';

class Users {
   constructor() {}

   async findAllUsersEmailAndUsername() {
      return await prisma.user.findMany({
         select: {
            email: true,
            username: true,
         },
      });
   }
}

const getUsers = new Users();
export default getUsers;
