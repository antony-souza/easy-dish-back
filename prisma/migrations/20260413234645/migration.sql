/*
  Warnings:

  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "categories_company_id_tag_idx" ON "categories"("company_id", "tag");

-- CreateIndex
CREATE INDEX "products_company_id_tag_idx" ON "products"("company_id", "tag");
