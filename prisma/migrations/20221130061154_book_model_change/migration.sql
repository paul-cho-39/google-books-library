/*
  Warnings:

  - You are about to drop the column `ISBN` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,title]` on the table `book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `industryIdentifiers` to the `book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "book_title_subtitle_version_key";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "ISBN",
DROP COLUMN "author",
DROP COLUMN "genre",
DROP COLUMN "version",
ADD COLUMN     "authors" TEXT[],
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "industryIdentifiers" JSONB NOT NULL,
ADD COLUMN     "language" TEXT DEFAULT 'en',
ADD COLUMN     "pageCount" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "credentials" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "book_id_idx" ON "book"("id");

-- CreateIndex
CREATE UNIQUE INDEX "book_id_title_key" ON "book"("id", "title");

-- CreateIndex
CREATE INDEX "library_userId_idx" ON "library"("userId");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");
