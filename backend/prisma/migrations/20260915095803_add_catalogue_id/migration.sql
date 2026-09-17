/*
  Warnings:

  - A unique constraint covering the columns `[catalogueId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN "catalogueId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Course_catalogueId_key" ON "Course"("catalogueId");
