/*
  Warnings:

  - The primary key for the `ratings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,bookId]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_userId_bookId_fkey";

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_pkey",
ADD COLUMN     "comment" VARCHAR(500),
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "reviewTitle" VARCHAR(150),
ADD CONSTRAINT "ratings_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_bookId_key" ON "ratings"("userId", "bookId");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
