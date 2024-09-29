/*
  Warnings:

  - You are about to alter the column `Otp_Confirm_Expire` on the `otp_confirm` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `Project_Created_Date` on the `project` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `User_AboutMe` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `User_Phone` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otp_confirm` MODIFY `Otp_Confirm_Expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `Project_Created_Date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `User_AboutMe` VARCHAR(191) NOT NULL,
    ADD COLUMN `User_Phone` VARCHAR(191) NOT NULL,
    MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;
