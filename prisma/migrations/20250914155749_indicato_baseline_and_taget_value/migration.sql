/*
  Warnings:

  - You are about to alter the column `cumulativeValue` on the `indicator` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cumulativeTarget` on the `indicator` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `indicator` MODIFY `cumulativeValue` INTEGER NULL,
    MODIFY `cumulativeTarget` INTEGER NULL;
