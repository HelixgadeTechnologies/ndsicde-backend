/*
  Warnings:

  - You are about to drop the column `from` on the `age_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `age_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `department_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `female` on the `gender_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `male` on the `gender_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `lga_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `product_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `product_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `state_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `tenure_disaggregation` table. All the data in the column will be lost.
  - Added the required column `actualFrom` to the `age_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualTo` to the `age_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetFrom` to the `age_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetTo` to the `age_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualCount` to the `department_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetCount` to the `department_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualFemale` to the `gender_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualMale` to the `gender_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetFemale` to the `gender_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetMale` to the `gender_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualCount` to the `lga_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetCount` to the `lga_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductName` to the `product_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualCount` to the `product_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetCount` to the `product_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualCount` to the `state_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetCount` to the `state_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualCount` to the `tenure_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetCount` to the `tenure_disaggregation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `age_disaggregation` DROP COLUMN `from`,
    DROP COLUMN `to`,
    ADD COLUMN `actualFrom` INTEGER NOT NULL,
    ADD COLUMN `actualTo` INTEGER NOT NULL,
    ADD COLUMN `targetFrom` INTEGER NOT NULL,
    ADD COLUMN `targetTo` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `department_disaggregation` DROP COLUMN `count`,
    ADD COLUMN `actualCount` INTEGER NOT NULL,
    ADD COLUMN `targetCount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `gender_disaggregation` DROP COLUMN `female`,
    DROP COLUMN `male`,
    ADD COLUMN `actualFemale` INTEGER NOT NULL,
    ADD COLUMN `actualMale` INTEGER NOT NULL,
    ADD COLUMN `targetFemale` INTEGER NOT NULL,
    ADD COLUMN `targetMale` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `lga_disaggregation` DROP COLUMN `count`,
    ADD COLUMN `actualCount` INTEGER NOT NULL,
    ADD COLUMN `targetCount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product_disaggregation` DROP COLUMN `count`,
    DROP COLUMN `productName`,
    ADD COLUMN `ProductName` VARCHAR(191) NOT NULL,
    ADD COLUMN `actualCount` INTEGER NOT NULL,
    ADD COLUMN `targetCount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `state_disaggregation` DROP COLUMN `count`,
    ADD COLUMN `actualCount` INTEGER NOT NULL,
    ADD COLUMN `targetCount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tenure_disaggregation` DROP COLUMN `count`,
    ADD COLUMN `actualCount` INTEGER NOT NULL,
    ADD COLUMN `targetCount` INTEGER NOT NULL;
