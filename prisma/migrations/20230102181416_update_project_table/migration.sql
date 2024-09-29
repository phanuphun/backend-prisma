/*
  Warnings:

  - You are about to alter the column `Otp_Confirm_Expire` on the `otp_confirm` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `Project_Created_Date` on the `project` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `otp_confirm` MODIFY `Otp_Confirm_Expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `Project_Created_Date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `Project_Advisor` (
    `Project_Advisor_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Project_Advisor_Project_Id` INTEGER NOT NULL,
    `Project_Advisor_User_Id` INTEGER NOT NULL,

    PRIMARY KEY (`Project_Advisor_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project_Invite_Advisor` (
    `Project_Invite_Advisor_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Project_Invite_Advisor_Project_Id` INTEGER NOT NULL,
    `Project_Invite_Advisor_Inviter` INTEGER NOT NULL,
    `Project_Invite_Advisor_Acceptor` INTEGER NOT NULL,
    `Project_Invite_Advisor_Status` BOOLEAN NOT NULL,

    PRIMARY KEY (`Project_Invite_Advisor_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project_Tracking` (
    `Project_Tracking_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Project_Tracking_Project_Id` INTEGER NOT NULL,
    `Project_Tracking_Topic` VARCHAR(255) NOT NULL,
    `Project_Tracking_File` VARCHAR(255) NOT NULL,
    `Project_Tracking_Status` INTEGER NOT NULL,
    `Project_Tracking_Reply_Advisor` BOOLEAN NOT NULL,
    `Project_Tracking_Reply_Status` INTEGER NOT NULL,

    PRIMARY KEY (`Project_Tracking_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project_Advisor` ADD CONSTRAINT `Project_Advisor_Project_Advisor_Project_Id_fkey` FOREIGN KEY (`Project_Advisor_Project_Id`) REFERENCES `Project`(`Project_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Advisor` ADD CONSTRAINT `Project_Advisor_Project_Advisor_User_Id_fkey` FOREIGN KEY (`Project_Advisor_User_Id`) REFERENCES `Users`(`User_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Invite_Advisor` ADD CONSTRAINT `Project_Invite_Advisor_Project_Invite_Advisor_Project_Id_fkey` FOREIGN KEY (`Project_Invite_Advisor_Project_Id`) REFERENCES `Project`(`Project_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Invite_Advisor` ADD CONSTRAINT `Project_Invite_Advisor_Project_Invite_Advisor_Inviter_fkey` FOREIGN KEY (`Project_Invite_Advisor_Inviter`) REFERENCES `Users`(`User_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Invite_Advisor` ADD CONSTRAINT `Project_Invite_Advisor_Project_Invite_Advisor_Acceptor_fkey` FOREIGN KEY (`Project_Invite_Advisor_Acceptor`) REFERENCES `Users`(`User_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Tracking` ADD CONSTRAINT `Project_Tracking_Project_Tracking_Id_fkey` FOREIGN KEY (`Project_Tracking_Id`) REFERENCES `Project`(`Project_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
