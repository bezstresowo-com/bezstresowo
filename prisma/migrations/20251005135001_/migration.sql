/*
  Warnings:

  - Made the column `content` on table `BlogArticle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BlogArticle" ALTER COLUMN "content" SET NOT NULL;
