/*
  Warnings:

  - Added the required column `User_password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `User_password` VARCHAR(255) NOT NULL,
    MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `OldAccout` (
    `OldAccount_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `OldAccount_UserName` VARCHAR(255) NOT NULL,
    `OldAccount_Password` VARCHAR(255) NOT NULL,
    `OldAccount_Fname` VARCHAR(255) NOT NULL,
    `OldAccount_Lname` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`OldAccount_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
