-- Migration SQL Script for Indicator and Disaggregation Changes
-- Note: Dropping tables in order of dependency (children first)

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `indicator_report_disaggregation`;
DROP TABLE IF EXISTS `indicator_report`;
DROP TABLE IF EXISTS `indicator_disaggregation`;
DROP TABLE IF EXISTS `indicator`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create 'indicator' table
CREATE TABLE `indicator` (
    `indicatorId` VARCHAR(191) NOT NULL,
    `indicatorSource` VARCHAR(191) NULL,
    `thematicAreasOrPillar` VARCHAR(191) NULL,
    `statement` TEXT NULL,
    `linkKpiToSdnOrgKpi` VARCHAR(191) NULL,
    `definition` TEXT NULL,
    `specificArea` VARCHAR(191) NULL,
    `unitOfMeasure` VARCHAR(191) NULL,
    `itemInMeasure` VARCHAR(191) NULL,
    `baseLineDate` DATETIME(3) NULL,
    `cumulativeValue` INT NULL,
    `baselineNarrative` TEXT NULL,
    `targetDate` DATETIME(3) NULL,
    `cumulativeTarget` INT NULL,
    `targetNarrative` TEXT NULL,
    `targetType` VARCHAR(191) NULL,
    `responsiblePersons` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `result` VARCHAR(191) NULL,
    `resultTypeId` VARCHAR(191) NULL,
    PRIMARY KEY (`indicatorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Create 'indicator_disaggregation' table
CREATE TABLE `indicator_disaggregation` (
    `indicatorDisaggregationId` VARCHAR(191) NOT NULL,
    `indicatorId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `target` INT NULL,
    PRIMARY KEY (`indicatorDisaggregationId`),
    CONSTRAINT `indicator_disaggregation_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Create 'indicator_report' table
CREATE TABLE `indicator_report` (
    `indicatorReportId` VARCHAR(191) NOT NULL,
    `indicatorSource` VARCHAR(191) NULL,
    `thematicAreasOrPillar` VARCHAR(191) NULL,
    `indicatorStatement` TEXT NULL,
    `responsiblePersons` VARCHAR(191) NULL,
    `actualDate` DATETIME(3) NULL,
    `cumulativeActual` VARCHAR(191) NULL,
    `actualNarrative` TEXT NULL,
    `attachmentUrl` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `indicatorId` VARCHAR(191) NULL,
    `resultTypeId` VARCHAR(191) NULL,
    PRIMARY KEY (`indicatorReportId`),
    CONSTRAINT `indicator_report_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `indicator`(`indicatorId`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Create 'indicator_report_disaggregation' table
CREATE TABLE `indicator_report_disaggregation` (
    `indicatorReportDisaggregationId` VARCHAR(191) NOT NULL,
    `indicatorReportId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `actual` INT NULL,
    PRIMARY KEY (`indicatorReportDisaggregationId`),
    CONSTRAINT `indicator_report_disaggregation_indicatorReportId_fkey` FOREIGN KEY (`indicatorReportId`) REFERENCES `indicator_report`(`indicatorReportId`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- Add activityId FK to lineitem table
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add the activityId column (nullable)
ALTER TABLE `lineitem`
  ADD COLUMN `activityId` VARCHAR(191) NULL;

-- 2. Add an index for query performance
ALTER TABLE `lineitem`
  ADD INDEX `lineitem_activityId_idx` (`activityId`);

-- 3. Add the foreign key constraint
ALTER TABLE `lineitem`
  ADD CONSTRAINT `lineitem_activityId_fkey`
  FOREIGN KEY (`activityId`)
  REFERENCES `activity` (`activityId`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
