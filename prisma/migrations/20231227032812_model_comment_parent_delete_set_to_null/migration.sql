-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_upvoteId_fkey";

-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_userId_fkey";

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_upvoteId_fkey" FOREIGN KEY ("upvoteId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
