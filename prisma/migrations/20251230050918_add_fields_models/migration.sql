/*
  Warnings:

  - Added the required column `codeWetravel` to the `AttractionProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Destination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttractionProduct" ADD COLUMN     "codeWetravel" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "slug" JSONB NOT NULL;
