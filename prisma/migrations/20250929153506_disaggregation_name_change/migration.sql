/*
  Warnings:

  - You are about to drop the column `productName` on the `department_disaggregation` table. All the data in the column will be lost.
  - Added the required column `departmentName` to the `department_disaggregation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `department_disaggregation` DROP COLUMN `productName`,
    ADD COLUMN `departmentName` VARCHAR(191) NOT NULL;
