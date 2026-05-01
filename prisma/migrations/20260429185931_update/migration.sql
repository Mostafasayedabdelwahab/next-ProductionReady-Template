/*
  Warnings:

  - The `image` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RadiusOption" AS ENUM ('sharp', 'medium', 'rounded', 'pill');

-- CreateEnum
CREATE TYPE "ThemeMode" AS ENUM ('light', 'dark', 'system');

-- CreateEnum
CREATE TYPE "ArabicFont" AS ENUM ('cairo', 'tajawal', 'alexandria', 'noto_kufi', 'ibm_plex_arabic');

-- CreateEnum
CREATE TYPE "EnglishFont" AS ENUM ('inter', 'geist', 'poppins', 'roboto', 'dm_sans');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'EDITOR';

-- DropIndex
DROP INDEX "EmailVerificationToken_token_key";

-- DropIndex
DROP INDEX "PasswordResetToken_token_key";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "name" SET NOT NULL,
DROP COLUMN "image",
ADD COLUMN     "image" JSONB;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "verification_tokens";

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteNameAr" TEXT NOT NULL,
    "siteNameEn" TEXT NOT NULL,
    "siteTitleAr" TEXT,
    "siteTitleEn" TEXT,
    "siteDescriptionAr" TEXT,
    "siteDescriptionEn" TEXT,
    "addressAr" TEXT,
    "addressEn" TEXT,
    "defaultKeywordsAr" TEXT,
    "defaultKeywordsEn" TEXT,
    "arabicFont" "ArabicFont" NOT NULL DEFAULT 'cairo',
    "englishFont" "EnglishFont" NOT NULL DEFAULT 'inter',
    "logoUrl" JSONB,
    "faviconUrl" JSONB,
    "ogImageUrl" JSONB,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "mutedColor" TEXT,
    "backgroundColor" TEXT,
    "foregroundColor" TEXT,
    "cardColor" TEXT,
    "borderColor" TEXT,
    "radius" "RadiusOption" NOT NULL DEFAULT 'medium',
    "defaultTheme" "ThemeMode" NOT NULL DEFAULT 'system',
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "whatsappNumber" TEXT,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "youtubeUrl" TEXT,
    "domainUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "format" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_publicId_key" ON "Media"("publicId");

-- CreateIndex
CREATE INDEX "Media_publicId_idx" ON "Media"("publicId");
