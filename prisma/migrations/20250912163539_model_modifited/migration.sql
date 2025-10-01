/*
  Warnings:

  - You are about to drop the column `actualCostOfLineItem` on the `retirement` table. All the data in the column will be lost.
  - You are about to drop the column `lineItem` on the `retirement` table. All the data in the column will be lost.
  - You are about to drop the `impactindicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `impactindicatorreportformat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outcomeindicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outcomeindicatorreportformat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outputindicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outputindicatorreportformat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `impactindicator` DROP FOREIGN KEY `impactindicator_impactId_fkey`;

-- DropForeignKey
ALTER TABLE `impactindicatorreportformat` DROP FOREIGN KEY `impactindicatorreportformat_impactIndicatorId_fkey`;

-- DropForeignKey
ALTER TABLE `outcomeindicator` DROP FOREIGN KEY `outcomeindicator_outcomeId_fkey`;

-- DropForeignKey
ALTER TABLE `outcomeindicatorreportformat` DROP FOREIGN KEY `outcomeindicatorreportformat_outcomeIndicatorId_fkey`;

-- DropForeignKey
ALTER TABLE `outputindicator` DROP FOREIGN KEY `outputindicator_outputId_fkey`;

-- DropForeignKey
ALTER TABLE `outputindicatorreportformat` DROP FOREIGN KEY `outputindicatorreportformat_outputIndicatorId_fkey`;

-- AlterTable
ALTER TABLE `retirement` DROP COLUMN `actualCostOfLineItem`,
    DROP COLUMN `lineItem`,
    ADD COLUMN `activityLineDescription` VARCHAR(191) NULL,
    ADD COLUMN `actualCost` INTEGER NULL,
    ADD COLUMN `frequency` INTEGER NULL,
    ADD COLUMN `quantity` INTEGER NULL,
    ADD COLUMN `totalBudget` INTEGER NULL,
    ADD COLUMN `unitCost` INTEGER NULL;

-- DropTable
DROP TABLE `impactindicator`;

-- DropTable
DROP TABLE `impactindicatorreportformat`;

-- DropTable
DROP TABLE `outcomeindicator`;

-- DropTable
DROP TABLE `outcomeindicatorreportformat`;

-- DropTable
DROP TABLE `outputindicator`;

-- DropTable
DROP TABLE `outputindicatorreportformat`;

-- CreateTable
CREATE TABLE `indicator` (
    `indicatorId` VARCHAR(191) NOT NULL,
    `indicatorSource` VARCHAR(191) NULL,
    `thematicAreasOrPillar` VARCHAR(191) NULL,
    `statement` VARCHAR(191) NULL,
    `linkKpiToSdnOrgKpi` VARCHAR(191) NULL,
    `definition` VARCHAR(191) NULL,
    `specificArea` VARCHAR(191) NULL,
    `unitOfMeasure` VARCHAR(191) NULL,
    `itemInMeasure` VARCHAR(191) NULL,
    `disaggregation` VARCHAR(191) NULL,
    `baseLineDate` DATETIME(3) NULL,
    `cumulativeValue` VARCHAR(191) NULL,
    `baselineNarrative` VARCHAR(191) NULL,
    `targetDate` DATETIME(3) NULL,
    `cumulativeTarget` VARCHAR(191) NULL,
    `targetNarrative` VARCHAR(191) NULL,
    `targetType` VARCHAR(191) NULL,
    `responsiblePersons` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `result` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`indicatorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indicator_report` (
    `indicatorReportId` VARCHAR(191) NOT NULL,
    `indicatorSource` VARCHAR(191) NULL,
    `thematicAreasOrPillar` VARCHAR(191) NULL,
    `indicatorStatement` VARCHAR(191) NULL,
    `responsiblePersons` VARCHAR(191) NULL,
    `disaggregationType` VARCHAR(191) NULL,
    `actualDate` DATETIME(3) NULL,
    `cumulativeActual` VARCHAR(191) NULL,
    `actualNarrative` VARCHAR(191) NULL,
    `attachmentUrl` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `indicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`indicatorReportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `indicator_report` ADD CONSTRAINT `indicator_report_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;
