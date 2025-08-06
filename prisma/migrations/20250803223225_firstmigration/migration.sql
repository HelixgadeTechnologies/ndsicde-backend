-- CreateTable
CREATE TABLE `users` (
    `userId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `roleId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `assignedProjectId` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `community` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `localGovernmentArea` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `profilePic` VARCHAR(191) NULL,
    `profilePicMimeType` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `roleId` VARCHAR(191) NOT NULL,
    `roleName` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `permission` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `strategicObjective` (
    `strategicObjectiveId` VARCHAR(191) NOT NULL,
    `statement` VARCHAR(191) NULL,
    `thematicAreas` VARCHAR(191) NULL,
    `pillarLead` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`strategicObjectiveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi` (
    `kpiId` VARCHAR(191) NOT NULL,
    `statement` VARCHAR(191) NULL,
    `definition` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `specificAreas` VARCHAR(191) NULL,
    `unitOfMeasure` VARCHAR(191) NULL,
    `itemInMeasure` VARCHAR(191) NULL,
    `disaggregation` VARCHAR(191) NULL,
    `baseLine` VARCHAR(191) NULL,
    `target` VARCHAR(191) NULL,
    `strategicObjectiveId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`kpiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `projectId` VARCHAR(191) NOT NULL,
    `budgetCurrency` VARCHAR(191) NULL,
    `totalBudgetAmount` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `country` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `localGovernment` VARCHAR(191) NULL,
    `community` VARCHAR(191) NULL,
    `thematicAreasOrPillar` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `strategicObjectiveId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`roleId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kpi` ADD CONSTRAINT `kpi_strategicObjectiveId_fkey` FOREIGN KEY (`strategicObjectiveId`) REFERENCES `strategicObjective`(`strategicObjectiveId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_strategicObjectiveId_fkey` FOREIGN KEY (`strategicObjectiveId`) REFERENCES `strategicObjective`(`strategicObjectiveId`) ON DELETE SET NULL ON UPDATE CASCADE;
