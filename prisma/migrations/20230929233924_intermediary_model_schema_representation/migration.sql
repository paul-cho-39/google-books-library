/*
  Warnings:

  - You are about to drop the column `libraryId` on the `reading_logs` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `reading_logs` table. All the data in the column will be lost.
  - You are about to drop the column `weekday` on the `reading_logs` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `reading_logs` table. All the data in the column will be lost.
  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `library` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,bookId]` on the table `reading_logs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pagesRead` to the `reading_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reading_logs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `start` on the `reading_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end` on the `reading_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BookState" AS ENUM ('Want', 'Reading', 'Finished');

-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_libraryId_fkey";

-- DropForeignKey
ALTER TABLE "library" DROP CONSTRAINT "library_userId_fkey";

-- DropForeignKey
ALTER TABLE "reading_logs" DROP CONSTRAINT "reading_logs_bookId_fkey";

-- DropForeignKey
ALTER TABLE "reading_logs" DROP CONSTRAINT "reading_logs_libraryId_fkey";

-- DropIndex
DROP INDEX "users_id_idx";

-- AlterTable
ALTER TABLE "reading_logs" DROP COLUMN "libraryId",
DROP COLUMN "month",
DROP COLUMN "weekday",
DROP COLUMN "year",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pagesRead" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "start",
ADD COLUMN     "start" INTEGER NOT NULL,
DROP COLUMN "end",
ADD COLUMN     "end" INTEGER NOT NULL;

-- DropTable
DROP TABLE "book";

-- DropTable
DROP TABLE "library";

-- CreateTable
CREATE TABLE "ratings" (
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "ratingValue" INTEGER NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("userId","bookId")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "pub_date" TIMESTAMP(3) NOT NULL,
    "categories" TEXT[],
    "language" TEXT,
    "pageCount" INTEGER,
    "industryIdentifiers" JSONB,
    "authors" TEXT[],
    "dateDeleted" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "UserBook" (
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "state" "BookState" NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateStarted" TIMESTAMP(3),
    "dateFinished" TIMESTAMP(3),
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "finishedDate" TIMESTAMP(3),
    "totalDaysRead" INTEGER,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "primaryAdded" TIMESTAMP(3),

    CONSTRAINT "UserBook_pkey" PRIMARY KEY ("userId","bookId")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "books_id_key" ON "books"("id");

-- CreateIndex
CREATE INDEX "books_id_idx" ON "books" USING HASH ("id");

-- CreateIndex
CREATE INDEX "bookmarks_userId_idx" ON "bookmarks" USING HASH ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_name_userId_key" ON "bookmarks"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "reading_logs_userId_bookId_key" ON "reading_logs"("userId", "bookId");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users" USING HASH ("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");

-- AddForeignKey
ALTER TABLE "reading_logs" ADD CONSTRAINT "reading_logs_userId_bookId_fkey" FOREIGN KEY ("userId", "bookId") REFERENCES "UserBook"("userId", "bookId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_bookId_fkey" FOREIGN KEY ("userId", "bookId") REFERENCES "UserBook"("userId", "bookId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
