/*
  Warnings:

  - You are about to drop the `auditlog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projectvalidation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `auditlog` DROP FOREIGN KEY `auditlog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `projectvalidation` DROP FOREIGN KEY `projectvalidation_projectId_fkey`;

-- DropTable
DROP TABLE `auditlog`;

-- DropTable
DROP TABLE `projectvalidation`;

-- CreateTable
CREATE TABLE `teammember` (
    `teamMemberId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`teamMemberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partner` (
    `partnerId` VARCHAR(191) NOT NULL,
    `organizationName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`partnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `impact` (
    `impactId` VARCHAR(191) NOT NULL,
    `statement` VARCHAR(191) NOT NULL,
    `thematicArea` VARCHAR(191) NOT NULL,
    `responsiblePerson` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`impactId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `impactindicator` (
    `impactIndicatorId` VARCHAR(191) NOT NULL,
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
    `impactId` VARCHAR(191) NULL,

    PRIMARY KEY (`impactIndicatorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `impactindicatorreportformat` (
    `impactIndicatorReportFormatId` VARCHAR(191) NOT NULL,
    `indicatorSource` VARCHAR(191) NULL,
    `thematicAreasOrPillar` VARCHAR(191) NULL,
    `indicatorStatement` VARCHAR(191) NULL,
    `responsiblePersons` VARCHAR(191) NULL,
    `disaggregationType` VARCHAR(191) NULL,
    `linkKpiToSdnOrgKpi` VARCHAR(191) NULL,
    `definition` VARCHAR(191) NULL,
    `specificArea` VARCHAR(191) NULL,
    `unitOfMeasure` VARCHAR(191) NULL,
    `itemInMeasure` VARCHAR(191) NULL,
    `actualDate` DATETIME(3) NULL,
    `cumulativeActual` VARCHAR(191) NULL,
    `actualNarrative` VARCHAR(191) NULL,
    `attachmentUrl` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `impactIndicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`impactIndicatorReportFormatId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outcome` (
    `outcomeId` VARCHAR(191) NOT NULL,
    `outcomeStatement` VARCHAR(191) NOT NULL,
    `outcomeType` VARCHAR(191) NOT NULL,
    `impactId` VARCHAR(191) NULL,
    `thematicAreas` VARCHAR(191) NULL,
    `responsiblePerson` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`outcomeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outcomeindicator` (
    `outcomeIndicatorId` VARCHAR(191) NOT NULL,
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
    `outcomeId` VARCHAR(191) NULL,

    PRIMARY KEY (`outcomeIndicatorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outcomeindicatorreportformat` (
    `outcomeIndicatorReportFormatId` VARCHAR(191) NOT NULL,
    `indicatorSource` VARCHAR(191) NULL,
    `thematicAreasOrPillar` VARCHAR(191) NULL,
    `indicatorStatement` VARCHAR(191) NULL,
    `responsiblePersons` VARCHAR(191) NULL,
    `disaggregationType` VARCHAR(191) NULL,
    `linkKpiToSdnOrgKpi` VARCHAR(191) NULL,
    `definition` VARCHAR(191) NULL,
    `specificArea` VARCHAR(191) NULL,
    `unitOfMeasure` VARCHAR(191) NULL,
    `itemInMeasure` VARCHAR(191) NULL,
    `actualDate` DATETIME(3) NULL,
    `cumulativeActual` VARCHAR(191) NULL,
    `actualNarrative` VARCHAR(191) NULL,
    `attachmentUrl` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `outcomeIndicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`outcomeIndicatorReportFormatId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `output` (
    `outputId` VARCHAR(191) NOT NULL,
    `outputStatement` VARCHAR(191) NOT NULL,
    `outcomeId` VARCHAR(191) NULL,
    `thematicAreas` VARCHAR(191) NULL,
    `responsiblePerson` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`outputId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outputindicator` (
    `outputIndicatorId` VARCHAR(191) NOT NULL,
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
    `outputId` VARCHAR(191) NULL,

    PRIMARY KEY (`outputIndicatorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outputindicatorreportformat` (
    `outputIndicatorReportFormatId` VARCHAR(191) NOT NULL,
    `indicatorSource` VARCHAR(191) NULL,
    `thematicAreasOrPillar` VARCHAR(191) NULL,
    `indicatorStatement` VARCHAR(191) NULL,
    `responsiblePersons` VARCHAR(191) NULL,
    `disaggregationType` VARCHAR(191) NULL,
    `actualDate` DATETIME(3) NULL,
    `cumulativeActual` VARCHAR(191) NULL,
    `actualNarrative` VARCHAR(191) NULL,
    `attachmentUrl` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `outputIndicatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`outputIndicatorReportFormatId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity` (
    `activityId` VARCHAR(191) NOT NULL,
    `activityStatement` VARCHAR(191) NULL,
    `outputId` VARCHAR(191) NULL,
    `activityTotalBudget` INTEGER NULL,
    `responsiblePerson` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `activityFrequency` INTEGER NULL,
    `subActivity` VARCHAR(191) NULL,
    `descriptionAction` VARCHAR(191) NULL,
    `deliveryDate` DATETIME(3) NULL,
    `projectId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`activityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activityreport` (
    `activityReportId` VARCHAR(191) NOT NULL,
    `activityId` VARCHAR(191) NULL,
    `percentageCompletion` VARCHAR(191) NULL,
    `actualStartDate` DATETIME(3) NULL,
    `actualEndDate` DATETIME(3) NULL,
    `actualCost` INTEGER NULL,
    `actualNarrative` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`activityReportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logicalframework` (
    `logicalFrameworkId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `documentName` VARCHAR(191) NULL,
    `documentURL` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`logicalFrameworkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request` (
    `requestId` VARCHAR(191) NOT NULL,
    `staff` VARCHAR(191) NULL,
    `outputId` VARCHAR(191) NULL,
    `activityTitle` VARCHAR(191) NULL,
    `activityBudgetCode` INTEGER NULL,
    `activityLocation` VARCHAR(191) NULL,
    `activityPurposeDescription` VARCHAR(191) NULL,
    `activityStartDate` DATETIME(3) NULL,
    `activityEndDate` DATETIME(3) NULL,
    `activityLineDescription` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `frequency` INTEGER NULL,
    `unitCost` INTEGER NULL,
    `budgetCode` INTEGER NULL,
    `total` INTEGER NULL,
    `modeOfTransport` VARCHAR(191) NULL,
    `driverName` VARCHAR(191) NULL,
    `driversPhoneNumber` VARCHAR(191) NULL,
    `vehiclePlateNumber` VARCHAR(191) NULL,
    `vehicleColor` VARCHAR(191) NULL,
    `departureTime` DATETIME(3) NULL,
    `route` VARCHAR(191) NULL,
    `recipientPhoneNumber` VARCHAR(191) NULL,
    `documentName` VARCHAR(191) NULL,
    `documentURL` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`requestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `retirement` (
    `retirementId` VARCHAR(191) NOT NULL,
    `lineItem` VARCHAR(191) NULL,
    `actualCostOfLineItem` INTEGER NULL,
    `documentName` VARCHAR(191) NULL,
    `documentURL` VARCHAR(191) NULL,
    `requestId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`retirementId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teammember` ADD CONSTRAINT `teammember_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `partner` ADD CONSTRAINT `partner_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `impact` ADD CONSTRAINT `impact_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `impactindicator` ADD CONSTRAINT `impactindicator_impactId_fkey` FOREIGN KEY (`impactId`) REFERENCES `impact`(`impactId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `impactindicatorreportformat` ADD CONSTRAINT `impactindicatorreportformat_impactIndicatorId_fkey` FOREIGN KEY (`impactIndicatorId`) REFERENCES `impactindicator`(`impactIndicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_impactId_fkey` FOREIGN KEY (`impactId`) REFERENCES `impact`(`impactId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcomeindicator` ADD CONSTRAINT `outcomeindicator_outcomeId_fkey` FOREIGN KEY (`outcomeId`) REFERENCES `outcome`(`outcomeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcomeindicatorreportformat` ADD CONSTRAINT `outcomeindicatorreportformat_outcomeIndicatorId_fkey` FOREIGN KEY (`outcomeIndicatorId`) REFERENCES `outcomeindicator`(`outcomeIndicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_outcomeId_fkey` FOREIGN KEY (`outcomeId`) REFERENCES `outcome`(`outcomeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outputindicator` ADD CONSTRAINT `outputindicator_outputId_fkey` FOREIGN KEY (`outputId`) REFERENCES `output`(`outputId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outputindicatorreportformat` ADD CONSTRAINT `outputindicatorreportformat_outputIndicatorId_fkey` FOREIGN KEY (`outputIndicatorId`) REFERENCES `outputindicator`(`outputIndicatorId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_outputId_fkey` FOREIGN KEY (`outputId`) REFERENCES `output`(`outputId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activityreport` ADD CONSTRAINT `activityreport_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activity`(`activityId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logicalframework` ADD CONSTRAINT `logicalframework_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_outputId_fkey` FOREIGN KEY (`outputId`) REFERENCES `output`(`outputId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`projectId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `retirement` ADD CONSTRAINT `retirement_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `request`(`requestId`) ON DELETE SET NULL ON UPDATE CASCADE;
