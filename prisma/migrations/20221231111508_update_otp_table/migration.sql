/*
  Warnings:

  - You are about to alter the column `Project_Created_Date` on the `project` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `forgot_password` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `forgot_password` DROP FOREIGN KEY `Forgot_Password_Forgot_Password_User_Id_fkey`;

-- AlterTable
ALTER TABLE `project` MODIFY `Project_Created_Date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- DropTable
DROP TABLE `forgot_password`;

-- CreateTable
CREATE TABLE `Otp_Confirm` (
    `Otp_Confirm_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Otp_Confirm_OTP` VARCHAR(6) NOT NULL,
    `Otp_Confirm_Expire` DATETIME NOT NULL,
    `Otp_Confirm_User_Id` INTEGER NOT NULL,

    PRIMARY KEY (`Otp_Confirm_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Otp_Confirm` ADD CONSTRAINT `Otp_Confirm_Otp_Confirm_User_Id_fkey` FOREIGN KEY (`Otp_Confirm_User_Id`) REFERENCES `Users`(`User_Id`) ON DELETE CASCADE ON UPDATE CASCADE;
