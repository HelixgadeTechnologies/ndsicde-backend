/*
  Warnings:

  - You are about to drop the column `ageName` on the `age_disaggregation` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `age_disaggregation` table. All the data in the column will be lost.
  - Added the required column `from` to the `age_disaggregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `age_disaggregation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `age_disaggregation` DROP COLUMN `ageName`,
    DROP COLUMN `count`,
    ADD COLUMN `from` INTEGER NOT NULL,
    ADD COLUMN `to` INTEGER NOT NULL;
