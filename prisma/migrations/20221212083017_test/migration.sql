/*
  Warnings:

  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropIndex
DROP INDEX `Users_User_Usernname_key` ON `users`;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` DATETIME NOT NULL;
