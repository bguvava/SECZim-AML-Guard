-- CreateTable
CREATE TABLE "Smi" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "subsector" TEXT,

    CONSTRAINT "Smi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breach" (
    "id" TEXT NOT NULL,
    "smiId" TEXT NOT NULL,
    "licenseId" TEXT,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recurrence" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Breach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnforcementAction" (
    "id" TEXT NOT NULL,
    "breachId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "notes" TEXT,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnforcementAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseBreach" (
    "id" SERIAL NOT NULL,
    "entityName" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "breachType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "dateReported" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "penalty" DOUBLE PRECISION,
    "recommendation" TEXT,

    CONSTRAINT "LicenseBreach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "breachId" TEXT NOT NULL,
    "notes" TEXT,
    "actionTaken" TEXT,
    "followUpBy" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Smi_licenseNo_key" ON "Smi"("licenseNo");

-- AddForeignKey
ALTER TABLE "Breach" ADD CONSTRAINT "Breach_smiId_fkey" FOREIGN KEY ("smiId") REFERENCES "Smi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnforcementAction" ADD CONSTRAINT "EnforcementAction_breachId_fkey" FOREIGN KEY ("breachId") REFERENCES "Breach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_breachId_fkey" FOREIGN KEY ("breachId") REFERENCES "Breach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
