/*
  Warnings:

  - You are about to drop the column `ProductName` on the `product_disaggregation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product_disaggregation` DROP COLUMN `ProductName`,
    ADD COLUMN `productName` VARCHAR(191) NULL;
