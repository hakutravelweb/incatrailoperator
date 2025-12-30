/*
  Warnings:

  - You are about to drop the column `description` on the `Article` table. All the data in the column will be lost.
  - Added the required column `introduction` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "description",
ADD COLUMN     "introduction" JSONB NOT NULL,
ADD COLUMN     "navigation" JSONB[];

-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "navigationPrivacy" JSONB[],
ADD COLUMN     "navigationTerms" JSONB[];
