/*
  Warnings:

  - You are about to alter the column `Forgot_Password_Expire` on the `forgot_password` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `Project_Name` on the `project` table. All the data in the column will be lost.
  - You are about to alter the column `Project_Created_Date` on the `project` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `User_Joined_Date` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `Project_Name_EN` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Project_Name_TH` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `forgot_password` MODIFY `Forgot_Password_Expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `Project_Name`,
    ADD COLUMN `Project_Name_EN` VARCHAR(255) NOT NULL,
    ADD COLUMN `Project_Name_TH` VARCHAR(255) NOT NULL,
    MODIFY `Project_Created_Date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `User_Joined_Date` TIMESTAMP NOT NULL;
