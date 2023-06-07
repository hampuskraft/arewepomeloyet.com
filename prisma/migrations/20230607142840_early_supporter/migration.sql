-- AlterTable
ALTER TABLE "pomelos" ADD COLUMN     "early_supporter" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "pomelos_early_supporter_idx" ON "pomelos"("early_supporter");

-- CreateIndex
CREATE INDEX "pomelos_timestamp_idx" ON "pomelos"("timestamp");
