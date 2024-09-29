/*
  Warnings:

  - You are about to alter the column `Otp_Confirm_Expire` on the `otp_confirm` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `Project_Created_Date` on the `project` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `Project_Invite_Advisor_Reply` on the `project_invite_advisor` table. All the data in the column will be lost.
  - You are about to drop the column `Project_Invite_Advisor_Status` on the `project_invite_advisor` table. All the data in the column will be lost.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `Project_Advisor_Role` to the `Project_Advisor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Project_Invite_Advisor_Reply_Msg` to the `Project_Invite_Advisor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Project_Invite_Advisor_Reply_Status` to the `Project_Invite_Advisor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otp_confirm` MODIFY `Otp_Confirm_Expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `Project_Created_Date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `project_advisor` ADD COLUMN `Project_Advisor_Role` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `project_invite_advisor` DROP COLUMN `Project_Invite_Advisor_Reply`,
    DROP COLUMN `Project_Invite_Advisor_Status`,
    ADD COLUMN `Project_Invite_Advisor_Reply_Msg` VARCHAR(255) NOT NULL,
    ADD COLUMN `Project_Invite_Advisor_Reply_Status` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;
