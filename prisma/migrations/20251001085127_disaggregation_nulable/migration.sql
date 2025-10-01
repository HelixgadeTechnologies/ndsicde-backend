-- AlterTable
ALTER TABLE `age_disaggregation` MODIFY `actualFrom` INTEGER NULL,
    MODIFY `actualTo` INTEGER NULL,
    MODIFY `targetFrom` INTEGER NULL,
    MODIFY `targetTo` INTEGER NULL;

-- AlterTable
ALTER TABLE `department_disaggregation` MODIFY `departmentName` VARCHAR(191) NULL,
    MODIFY `actualCount` INTEGER NULL,
    MODIFY `targetCount` INTEGER NULL;

-- AlterTable
ALTER TABLE `gender_disaggregation` MODIFY `actualFemale` INTEGER NULL,
    MODIFY `actualMale` INTEGER NULL,
    MODIFY `targetFemale` INTEGER NULL,
    MODIFY `targetMale` INTEGER NULL;

-- AlterTable
ALTER TABLE `lga_disaggregation` MODIFY `lgaName` VARCHAR(191) NULL,
    MODIFY `actualCount` INTEGER NULL,
    MODIFY `targetCount` INTEGER NULL;

-- AlterTable
ALTER TABLE `product_disaggregation` MODIFY `ProductName` VARCHAR(191) NULL,
    MODIFY `actualCount` INTEGER NULL,
    MODIFY `targetCount` INTEGER NULL;

-- AlterTable
ALTER TABLE `state_disaggregation` MODIFY `stateName` VARCHAR(191) NULL,
    MODIFY `actualCount` INTEGER NULL,
    MODIFY `targetCount` INTEGER NULL;

-- AlterTable
ALTER TABLE `tenure_disaggregation` MODIFY `tenureName` VARCHAR(191) NULL,
    MODIFY `actualCount` INTEGER NULL,
    MODIFY `targetCount` INTEGER NULL;
