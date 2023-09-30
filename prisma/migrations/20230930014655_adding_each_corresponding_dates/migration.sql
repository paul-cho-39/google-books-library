/*
  Warnings:

  - You are about to drop the column `finishedDate` on the `UserBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserBook" DROP COLUMN "finishedDate",
ADD COLUMN     "dateFinishedDay" INTEGER,
ADD COLUMN     "dateFinishedMonth" INTEGER,
ADD COLUMN     "dateFinishedYear" INTEGER;
