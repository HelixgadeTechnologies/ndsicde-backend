/*
  Warnings:

  - You are about to drop the column `disaggregation` on the `indicator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `indicator` DROP COLUMN `disaggregation`,
    ADD COLUMN `disaggregationId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `disaggregation` (
    `disaggregationId` VARCHAR(191) NOT NULL,
    `disaggregationName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`disaggregationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gender_disaggregation` (
    `genderDisaggregationId` VARCHAR(191) NOT NULL,
    `male` INTEGER NOT NULL,
    `female` INTEGER NOT NULL,
    `disaggregationId` VARCHAR(191) NULL,
    `indicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`genderDisaggregationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_disaggregation` (
    `productDisaggregationId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `disaggregationId` VARCHAR(191) NULL,
    `indicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`productDisaggregationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department_disaggregation` (
    `departmentDisaggregationId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `disaggregationId` VARCHAR(191) NULL,
    `indicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`departmentDisaggregationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `state_disaggregation` (
    `stateDisaggregationId` VARCHAR(191) NOT NULL,
    `stateName` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `disaggregationId` VARCHAR(191) NULL,
    `indicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`stateDisaggregationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lga_disaggregation` (
    `lgaDisaggregationId` VARCHAR(191) NOT NULL,
    `lgaName` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `disaggregationId` VARCHAR(191) NULL,
    `indicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`lgaDisaggregationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenure_disaggregation` (
    `tenureDisaggregationId` VARCHAR(191) NOT NULL,
    `tenureName` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `disaggregationId` VARCHAR(191) NULL,
    `indicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`tenureDisaggregationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `age_disaggregation` (
    `ageDisaggregationId` VARCHAR(191) NOT NULL,
    `ageName` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `disaggregationId` VARCHAR(191) NULL,
    `indicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`ageDisaggregationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gender_disaggregation` ADD CONSTRAINT `gender_disaggregation_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gender_disaggregation` ADD CONSTRAINT `gender_disaggregation_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_disaggregation` ADD CONSTRAINT `product_disaggregation_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_disaggregation` ADD CONSTRAINT `product_disaggregation_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_disaggregation` ADD CONSTRAINT `department_disaggregation_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_disaggregation` ADD CONSTRAINT `department_disaggregation_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `state_disaggregation` ADD CONSTRAINT `state_disaggregation_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `state_disaggregation` ADD CONSTRAINT `state_disaggregation_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lga_disaggregation` ADD CONSTRAINT `lga_disaggregation_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lga_disaggregation` ADD CONSTRAINT `lga_disaggregation_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenure_disaggregation` ADD CONSTRAINT `tenure_disaggregation_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenure_disaggregation` ADD CONSTRAINT `tenure_disaggregation_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `age_disaggregation` ADD CONSTRAINT `age_disaggregation_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `age_disaggregation` ADD CONSTRAINT `age_disaggregation_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indicator` ADD CONSTRAINT `indicator_disaggregationId_fkey` FOREIGN KEY (`disaggregationId`) REFERENCES `disaggregation`(`disaggregationId`) ON DELETE SET NULL ON UPDATE CASCADE;
