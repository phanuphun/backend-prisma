/*
  Warnings:

  - You are about to drop the `pet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pet` DROP FOREIGN KEY `Pet_ownerId_fkey`;

-- DropTable
DROP TABLE `pet`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Users` (
    `User_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `User_Usernname` VARCHAR(255) NOT NULL,
    `User_Fname` VARCHAR(255) NOT NULL,
    `User_Lname` VARCHAR(255) NOT NULL,
    `User_Email` VARCHAR(255) NOT NULL,
    `User_Avatar` VARCHAR(255) NOT NULL,
    `User_Joined_Date` DATETIME NOT NULL,
    `User_Deleted` BOOLEAN NOT NULL,
    `User_Banned` BOOLEAN NOT NULL,

    UNIQUE INDEX `Users_User_Usernname_key`(`User_Usernname`),
    PRIMARY KEY (`User_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Roles` (
    `User_Roles_id` INTEGER NOT NULL AUTO_INCREMENT,
    `User_Roles_User_Id` INTEGER NOT NULL,
    `User_Roles_Role_id` INTEGER NOT NULL,

    PRIMARY KEY (`User_Roles_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `Role_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Role_Name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`Role_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User_Roles` ADD CONSTRAINT `User_Roles_User_Roles_User_Id_fkey` FOREIGN KEY (`User_Roles_User_Id`) REFERENCES `Users`(`User_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Roles` ADD CONSTRAINT `User_Roles_User_Roles_Role_id_fkey` FOREIGN KEY (`User_Roles_Role_id`) REFERENCES `Roles`(`Role_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
