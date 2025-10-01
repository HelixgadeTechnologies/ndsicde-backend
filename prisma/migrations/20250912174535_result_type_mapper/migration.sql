/*
  Warnings:

  - You are about to drop the column `resultResultId` on the `impact` table. All the data in the column will be lost.
  - You are about to drop the column `resultResultId` on the `outcome` table. All the data in the column will be lost.
  - You are about to drop the column `resultResultId` on the `output` table. All the data in the column will be lost.
  - You are about to drop the `result` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `impact` DROP FOREIGN KEY `impact_resultResultId_fkey`;

-- DropForeignKey
ALTER TABLE `outcome` DROP FOREIGN KEY `outcome_resultResultId_fkey`;

-- DropForeignKey
ALTER TABLE `output` DROP FOREIGN KEY `output_resultResultId_fkey`;

-- DropIndex
DROP INDEX `impact_resultResultId_fkey` ON `impact`;

-- DropIndex
DROP INDEX `outcome_resultResultId_fkey` ON `outcome`;

-- DropIndex
DROP INDEX `output_resultResultId_fkey` ON `output`;

-- AlterTable
ALTER TABLE `impact` DROP COLUMN `resultResultId`,
    ADD COLUMN `resultTypeId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `indicator` ADD COLUMN `resultTypeId` VARCHAR(191) NULL,
    MODIFY `result` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `indicator_report` ADD COLUMN `resultTypeId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `outcome` DROP COLUMN `resultResultId`,
    ADD COLUMN `resultTypeId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `output` DROP COLUMN `resultResultId`,
    ADD COLUMN `resultTypeId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `result`;

-- CreateTable
CREATE TABLE `result_type` (
    `resultTypeId` VARCHAR(191) NOT NULL,
    `resultName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`resultTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `impact` ADD CONSTRAINT `impact_resultTypeId_fkey` FOREIGN KEY (`resultTypeId`) REFERENCES `result_type`(`resultTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_resultTypeId_fkey` FOREIGN KEY (`resultTypeId`) REFERENCES `result_type`(`resultTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_resultTypeId_fkey` FOREIGN KEY (`resultTypeId`) REFERENCES `result_type`(`resultTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indicator` ADD CONSTRAINT `indicator_resultTypeId_fkey` FOREIGN KEY (`resultTypeId`) REFERENCES `result_type`(`resultTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indicator_report` ADD CONSTRAINT `indicator_report_resultTypeId_fkey` FOREIGN KEY (`resultTypeId`) REFERENCES `result_type`(`resultTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;
