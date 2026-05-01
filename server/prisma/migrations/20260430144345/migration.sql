/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Question_sessionId_idx" ON "Question"("sessionId");
