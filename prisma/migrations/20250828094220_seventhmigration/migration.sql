/*
  Warnings:

  - You are about to alter the column `percentageCompletion` on the `activityreport` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `activityreport` MODIFY `percentageCompletion` INTEGER NULL;
