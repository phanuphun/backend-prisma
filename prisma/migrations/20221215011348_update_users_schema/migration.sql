/*
  Warnings:

  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - A unique constraint covering the columns `[OldAccount_Rmuti_Id]` on the table `OldAccout` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[User_Rmuti_Id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[User_Email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `OldAccount_Rmuti_Id` to the `OldAccout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `User_Rmuti_Id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `oldaccout` ADD COLUMN `OldAccount_Rmuti_Id` VARCHAR(13) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `User_Rmuti_Id` VARCHAR(13) NOT NULL,
    MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `OldAccout_OldAccount_Rmuti_Id_key` ON `OldAccout`(`OldAccount_Rmuti_Id`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_User_Rmuti_Id_key` ON `Users`(`User_Rmuti_Id`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_User_Email_key` ON `Users`(`User_Email`);
