/*
  Warnings:

  - You are about to alter the column `Otp_Confirm_Expire` on the `otp_confirm` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `Project_Created_Date` on the `project` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `Project_Invite_Advisor_File` to the `Project_Invite_Advisor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otp_confirm` MODIFY `Otp_Confirm_Expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `Project_Created_Date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `project_invite_advisor` ADD COLUMN `Project_Invite_Advisor_File` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;
