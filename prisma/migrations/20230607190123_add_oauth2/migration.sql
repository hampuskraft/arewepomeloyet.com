-- AlterTable
ALTER TABLE "pomelos" ADD COLUMN     "oauth2" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "pomelos_oauth2_idx" ON "pomelos"("oauth2");
