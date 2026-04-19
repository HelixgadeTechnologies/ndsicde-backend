-- ============================================================
-- Migration: Add missing columns to `lineitem` table
-- Adds: totalBudget, totalSpent, variance
-- Date: 2026-04-19
-- ============================================================

ALTER TABLE `lineitem`
  ADD COLUMN IF NOT EXISTS `totalBudget` INT NULL AFTER `unitCost`,
  ADD COLUMN IF NOT EXISTS `totalSpent`  INT NULL AFTER `totalBudget`,
  ADD COLUMN IF NOT EXISTS `variance`    INT NULL AFTER `totalSpent`;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
