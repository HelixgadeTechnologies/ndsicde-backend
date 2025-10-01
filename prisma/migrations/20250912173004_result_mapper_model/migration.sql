-- AlterTable
ALTER TABLE `impact` ADD COLUMN `resultResultId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `outcome` ADD COLUMN `resultResultId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `output` ADD COLUMN `resultResultId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `result` (
    `resultId` VARCHAR(191) NOT NULL,
    `resultName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`resultId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `impact` ADD CONSTRAINT `impact_resultResultId_fkey` FOREIGN KEY (`resultResultId`) REFERENCES `result`(`resultId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_resultResultId_fkey` FOREIGN KEY (`resultResultId`) REFERENCES `result`(`resultId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_resultResultId_fkey` FOREIGN KEY (`resultResultId`) REFERENCES `result`(`resultId`) ON DELETE SET NULL ON UPDATE CASCADE;
