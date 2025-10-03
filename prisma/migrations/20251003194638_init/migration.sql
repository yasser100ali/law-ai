-- CreateTable
CREATE TABLE "intakes" (
    "id" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareWithMarketplace" BOOLEAN NOT NULL DEFAULT true,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "matterType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intakes_pkey" PRIMARY KEY ("id")
);
