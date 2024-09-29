/*
  Warnings:

  - You are about to alter the column `Forgot_Password_Expire` on the `forgot_password` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `forgot_password` MODIFY `Forgot_Password_Expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `Project` (
    `Project_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Project_Name` VARCHAR(255) NOT NULL,
    `Project_Detail` TEXT NOT NULL,
    `Project_Avatar` VARCHAR(255) NOT NULL,
    `Project_Status` INTEGER NOT NULL,
    `Project_Created_By` INTEGER NOT NULL,
    `Project_Created_Date` DATETIME NOT NULL,
    `Project_Deleted` BOOLEAN NOT NULL,

    PRIMARY KEY (`Project_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project_Status` (
    `Project_Status_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Project_Status_Name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`Project_Status_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_Project_Status_fkey` FOREIGN KEY (`Project_Status`) REFERENCES `Project_Status`(`Project_Status_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
