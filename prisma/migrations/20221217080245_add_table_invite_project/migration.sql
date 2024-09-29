/*
  Warnings:

  - You are about to alter the column `Forgot_Password_Expire` on the `forgot_password` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `Project_Created_Date` on the `project` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `forgot_password` MODIFY `Forgot_Password_Expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `Project_Created_Date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `Project_Invite_Owner` (
    `Project_Invite_Owner_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Project_Invite_Owner_Project_Id` INTEGER NOT NULL,
    `Project_Invite_Owner_Inviter` INTEGER NOT NULL,
    `Project_Invite_Owner_Acceptor` INTEGER NOT NULL,
    `Project_Invite_Owner_Status` BOOLEAN NOT NULL,

    PRIMARY KEY (`Project_Invite_Owner_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project_Owner` (
    `Project_Owner_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Project_Owner_Project_Id` INTEGER NOT NULL,
    `Project_Owner_User_Id` INTEGER NOT NULL,

    PRIMARY KEY (`Project_Owner_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_Project_Created_By_fkey` FOREIGN KEY (`Project_Created_By`) REFERENCES `Users`(`User_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Invite_Owner` ADD CONSTRAINT `Project_Invite_Owner_Project_Invite_Owner_Project_Id_fkey` FOREIGN KEY (`Project_Invite_Owner_Project_Id`) REFERENCES `Project`(`Project_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Invite_Owner` ADD CONSTRAINT `Project_Invite_Owner_Project_Invite_Owner_Inviter_fkey` FOREIGN KEY (`Project_Invite_Owner_Inviter`) REFERENCES `Users`(`User_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Invite_Owner` ADD CONSTRAINT `Project_Invite_Owner_Project_Invite_Owner_Acceptor_fkey` FOREIGN KEY (`Project_Invite_Owner_Acceptor`) REFERENCES `Users`(`User_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Owner` ADD CONSTRAINT `Project_Owner_Project_Owner_Project_Id_fkey` FOREIGN KEY (`Project_Owner_Project_Id`) REFERENCES `Project`(`Project_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project_Owner` ADD CONSTRAINT `Project_Owner_Project_Owner_User_Id_fkey` FOREIGN KEY (`Project_Owner_User_Id`) REFERENCES `Users`(`User_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
