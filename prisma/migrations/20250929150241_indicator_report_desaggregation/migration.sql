/*
  Warnings:

  - You are about to drop the column `disaggregationType` on the `indicator_report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `indicator_report` DROP COLUMN `disaggregationType`,
    ADD COLUMN `disaggregationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `indicator_report` ADD CONSTRAINT `indicator_report_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;
