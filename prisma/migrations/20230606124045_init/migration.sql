-- CreateTable
CREATE TABLE "pomelos" (
    "hash" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nitro" BOOLEAN NOT NULL,

    CONSTRAINT "pomelos_pkey" PRIMARY KEY ("hash")
);

-- CreateIndex
CREATE INDEX "pomelos_date_idx" ON "pomelos"("date");

-- CreateIndex
CREATE INDEX "pomelos_nitro_idx" ON "pomelos"("nitro");
