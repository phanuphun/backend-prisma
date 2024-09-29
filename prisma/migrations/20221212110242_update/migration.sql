/*
  Warnings:

  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `User_Roles_User_Roles_Role_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `User_Roles_User_Roles_User_Id_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- AddForeignKey
ALTER TABLE `User_Roles` ADD CONSTRAINT `User_Roles_User_Roles_User_Id_fkey` FOREIGN KEY (`User_Roles_User_Id`) REFERENCES `Users`(`User_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Roles` ADD CONSTRAINT `User_Roles_User_Roles_Role_id_fkey` FOREIGN KEY (`User_Roles_Role_id`) REFERENCES `Roles`(`Role_Id`) ON DELETE CASCADE ON UPDATE CASCADE;
