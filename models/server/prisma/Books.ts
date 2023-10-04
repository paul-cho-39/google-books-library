export default class Books {
   userId: string;
   bookId: string;
   constructor(userId: string, bookId: string) {
      this.userId = userId;
      this.bookId = bookId;
   }
   get getBookId() {
      return {
         id: this.bookId,
      };
   }
   get getUserId() {
      return {
         id: this.userId,
      };
   }
   get getBothIds() {
      return {
         bookId: this.bookId,
         userId: this.userId,
      };
   }
   async findExistingBook() {
      return await prisma?.book.findUnique({
         where: this.getBookId,
      });
   }
   checkIds() {
      if (!this.bookId || !this.userId) throw Error(`Required parameter id has not been provided`);
   }
}
