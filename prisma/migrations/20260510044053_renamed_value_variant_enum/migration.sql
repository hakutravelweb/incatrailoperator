/*
  Warnings:

  - The values [ATTRACTION] on the enum `Variant` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Variant_new" AS ENUM ('JOURNEY', 'PACKAGE');
ALTER TABLE "Journey" ALTER COLUMN "variant" TYPE "Variant_new" USING ("variant"::text::"Variant_new");
ALTER TYPE "Variant" RENAME TO "Variant_old";
ALTER TYPE "Variant_new" RENAME TO "Variant";
DROP TYPE "public"."Variant_old";
COMMIT;
