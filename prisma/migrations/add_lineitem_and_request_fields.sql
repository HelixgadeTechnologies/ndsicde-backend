-- ============================================================
-- Migration: Add LineItem table + new columns to request table
-- Generated from: prisma/schema.prisma
-- Date: 2026-04-18
-- ============================================================

-- -------------------------------------------------------
-- 1. Add new transport-related & approval columns to `request`
--    (skip columns that already exist in your DB)
-- -------------------------------------------------------

ALTER TABLE `request`
  -- Transport / Way-Pass fields
  ADD COLUMN IF NOT EXISTS `modeOfTransport`      VARCHAR(191)  NULL AFTER `total`,
  ADD COLUMN IF NOT EXISTS `driverName`           VARCHAR(191)  NULL AFTER `modeOfTransport`,
  ADD COLUMN IF NOT EXISTS `driversPhoneNumber`   VARCHAR(191)  NULL AFTER `driverName`,
  ADD COLUMN IF NOT EXISTS `vehiclePlateNumber`   VARCHAR(191)  NULL AFTER `driversPhoneNumber`,
  ADD COLUMN IF NOT EXISTS `vehicleColor`         VARCHAR(191)  NULL AFTER `vehiclePlateNumber`,
  ADD COLUMN IF NOT EXISTS `departureTime`        DATETIME(3)   NULL AFTER `vehicleColor`,
  ADD COLUMN IF NOT EXISTS `route`                VARCHAR(191)  NULL AFTER `departureTime`,
  ADD COLUMN IF NOT EXISTS `recipientPhoneNumber` VARCHAR(191)  NULL AFTER `route`,
  ADD COLUMN IF NOT EXISTS `documentName`         VARCHAR(191)  NULL AFTER `recipientPhoneNumber`,
  ADD COLUMN IF NOT EXISTS `documentURL`          VARCHAR(191)  NULL AFTER `documentName`,

  -- Approval fields
  ADD COLUMN IF NOT EXISTS `approval_A`   INT          NULL AFTER `documentURL`,
  ADD COLUMN IF NOT EXISTS `approval_B`   INT          NULL AFTER `approval_A`,
  ADD COLUMN IF NOT EXISTS `approval_C`   INT          NULL AFTER `approval_B`,
  ADD COLUMN IF NOT EXISTS `approval_D`   INT          NULL AFTER `approval_C`,
  ADD COLUMN IF NOT EXISTS `approvedBy_A` VARCHAR(191) NULL AFTER `approval_D`,
  ADD COLUMN IF NOT EXISTS `approvedBy_B` VARCHAR(191) NULL AFTER `approvedBy_A`,
  ADD COLUMN IF NOT EXISTS `approvedBy_C` VARCHAR(191) NULL AFTER `approvedBy_B`,
  ADD COLUMN IF NOT EXISTS `approvedBy_D` VARCHAR(191) NULL AFTER `approvedBy_C`,
  ADD COLUMN IF NOT EXISTS `comment_A`    VARCHAR(191) NULL AFTER `approvedBy_D`,
  ADD COLUMN IF NOT EXISTS `comment_B`    VARCHAR(191) NULL AFTER `comment_A`,
  ADD COLUMN IF NOT EXISTS `comment_C`    VARCHAR(191) NULL AFTER `comment_B`,
  ADD COLUMN IF NOT EXISTS `comment_D`    VARCHAR(191) NULL AFTER `comment_C`;

-- Creator reference (separate statement — `comment_D` must exist before being used in AFTER)
ALTER TABLE `request`
  ADD COLUMN IF NOT EXISTS `createdBy`    VARCHAR(191) NULL AFTER `comment_D`;

-- Foreign key: request.createdBy -> users.userId
-- (Run only if the FK does not already exist)
ALTER TABLE `request`
  ADD CONSTRAINT `fk_request_createdBy`
    FOREIGN KEY (`createdBy`) REFERENCES `users` (`userId`)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- -------------------------------------------------------
-- 2. Create the `lineitem` table
-- -------------------------------------------------------

CREATE TABLE IF NOT EXISTS `lineitem` (
  `lineItemId`  VARCHAR(191)  NOT NULL,
  `requestId`   VARCHAR(191)  NOT NULL,
  `description` VARCHAR(191)  NULL,
  `quantity`    INT           NULL,
  `frequency`   INT           NULL,
  `unitCost`    INT           NULL,
  `total`       INT           NULL,
  `createAt`    DATETIME(3)   NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updateAt`    DATETIME(3)   NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`lineItemId`),

  CONSTRAINT `fk_lineitem_request`
    FOREIGN KEY (`requestId`) REFERENCES `request` (`requestId`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 3. Add signature fields to `users` table
-- -------------------------------------------------------

ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `signature`          VARCHAR(191) NULL AFTER `profilePicMimeType`,
  ADD COLUMN IF NOT EXISTS `signatureMimeType`  VARCHAR(191) NULL AFTER `signature`;

-- -------------------------------------------------------
-- 4. Add approval fields to `retirement` table
-- -------------------------------------------------------

ALTER TABLE `retirement`
  ADD COLUMN IF NOT EXISTS `approval_A`   INT          NULL,
  ADD COLUMN IF NOT EXISTS `approval_B`   INT          NULL AFTER `approval_A`,
  ADD COLUMN IF NOT EXISTS `approval_C`   INT          NULL AFTER `approval_B`,
  ADD COLUMN IF NOT EXISTS `approval_D`   INT          NULL AFTER `approval_C`,
  ADD COLUMN IF NOT EXISTS `approvedBy_A` VARCHAR(191) NULL AFTER `approval_D`,
  ADD COLUMN IF NOT EXISTS `approvedBy_B` VARCHAR(191) NULL AFTER `approvedBy_A`,
  ADD COLUMN IF NOT EXISTS `approvedBy_C` VARCHAR(191) NULL AFTER `approvedBy_B`,
  ADD COLUMN IF NOT EXISTS `approvedBy_D` VARCHAR(191) NULL AFTER `approvedBy_C`,
  ADD COLUMN IF NOT EXISTS `comment_A`    VARCHAR(191) NULL AFTER `approvedBy_D`,
  ADD COLUMN IF NOT EXISTS `comment_B`    VARCHAR(191) NULL AFTER `comment_A`,
  ADD COLUMN IF NOT EXISTS `comment_C`    VARCHAR(191) NULL AFTER `comment_B`,
  ADD COLUMN IF NOT EXISTS `comment_D`    VARCHAR(191) NULL AFTER `comment_C`;  

-- -------------------------------------------------------
-- END OF MIGRATION
-- -------------------------------------------------------
