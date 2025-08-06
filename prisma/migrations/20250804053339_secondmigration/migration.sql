-- CreateTable
CREATE TABLE `generalsettings` (
    `generalSettingsId` VARCHAR(191) NOT NULL,
    `organizationName` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `organizationLogo` VARCHAR(191) NULL,
    `defaultCurrency` VARCHAR(191) NULL,
    `defaultTimeZone` VARCHAR(191) NULL,
    `dateRetentionPolicy` VARCHAR(191) NULL,
    `auditLogRetention` VARCHAR(191) NULL,
    `emailNotification` BOOLEAN NULL,
    `maintenanceAlert` BOOLEAN NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`generalSettingsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
