/*
  Warnings:

  - The primary key for the `book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[libraryId]` on the table `book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,libraryId]` on the table `book` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_libraryId_fkey";

-- DropForeignKey
ALTER TABLE "reading_logs" DROP CONSTRAINT "reading_logs_bookId_fkey";

-- DropIndex
DROP INDEX "book_id_title_key";

-- AlterTable
ALTER TABLE "book" DROP CONSTRAINT "book_pkey",
ADD COLUMN     "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "finishedDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "book_libraryId_key" ON "book"("libraryId");

-- CreateIndex
CREATE UNIQUE INDEX "book_id_libraryId_key" ON "book"("id", "libraryId");

-- AddForeignKey
ALTER TABLE "reading_logs" ADD CONSTRAINT "reading_logs_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("libraryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "library"("id") ON DELETE CASCADE ON UPDATE CASCADE;
