/*
  Warnings:

  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `Forgot_Password` (
    `Forgot_Password_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Forgot_Password_OTP` VARCHAR(6) NOT NULL,
    `Forgot_Password_Expire` DATETIME NOT NULL,
    `Forgot_Password_User_Id` INTEGER NOT NULL,

    PRIMARY KEY (`Forgot_Password_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Forgot_Password` ADD CONSTRAINT `Forgot_Password_Forgot_Password_Id_fkey` FOREIGN KEY (`Forgot_Password_Id`) REFERENCES `Users`(`User_Id`) ON DELETE CASCADE ON UPDATE CASCADE;
