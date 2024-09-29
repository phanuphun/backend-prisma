/*
  Warnings:

  - You are about to drop the column `fanme` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lanme` on the `user` table. All the data in the column will be lost.
  - Added the required column `fname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `fanme`,
    DROP COLUMN `lanme`,
    ADD COLUMN `fname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lname` VARCHAR(191) NOT NULL;
