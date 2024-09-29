/*
  Warnings:

  - You are about to alter the column `Forgot_Password_Expire` on the `forgot_password` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `forgot_password` DROP FOREIGN KEY `Forgot_Password_Forgot_Password_Id_fkey`;

-- AlterTable
ALTER TABLE `forgot_password` MODIFY `Forgot_Password_Expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- AddForeignKey
ALTER TABLE `Forgot_Password` ADD CONSTRAINT `Forgot_Password_Forgot_Password_User_Id_fkey` FOREIGN KEY (`Forgot_Password_User_Id`) REFERENCES `Users`(`User_Id`) ON DELETE CASCADE ON UPDATE CASCADE;
