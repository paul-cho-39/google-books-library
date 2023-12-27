-- CreateTable
CREATE TABLE "Upvotes" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "upvoteId" INTEGER NOT NULL,

    CONSTRAINT "Upvotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upvotes_userId_upvoteId_key" ON "Upvotes"("userId", "upvoteId");

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_upvoteId_fkey" FOREIGN KEY ("upvoteId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
