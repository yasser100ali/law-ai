import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/intakes - Fetch all intakes
export async function GET() {
  try {
    const intakes = await prisma.intake.findMany({
      orderBy: {
        submittedAt: "desc",
      },
    });

    // Transform database records to match IntakeRecord type
    const transformedIntakes = intakes.map((intake) => ({
      id: intake.id,
      submittedAt: intake.submittedAt.toISOString(),
      shareWithMarketplace: intake.shareWithMarketplace,
      form: {
        fullName: intake.fullName,
        email: intake.email,
        phone: intake.phone,
        jurisdiction: intake.jurisdiction,
        matterType: intake.matterType,
        summary: intake.summary,
        goals: intake.goals,
        urgency: intake.urgency,
      },
    }));

    return NextResponse.json(transformedIntakes);
  } catch (error) {
    console.error("Error fetching intakes:", error);
    return NextResponse.json(
      { error: "Failed to fetch intakes" },
      { status: 500 }
    );
  }
}

// POST /api/intakes - Create a new intake
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shareWithMarketplace, form } = body;

    const intake = await prisma.intake.create({
      data: {
        shareWithMarketplace,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        jurisdiction: form.jurisdiction,
        matterType: form.matterType,
        summary: form.summary,
        goals: form.goals,
        urgency: form.urgency,
      },
    });

    // Transform to match IntakeRecord type
    const transformedIntake = {
      id: intake.id,
      submittedAt: intake.submittedAt.toISOString(),
      shareWithMarketplace: intake.shareWithMarketplace,
      form: {
        fullName: intake.fullName,
        email: intake.email,
        phone: intake.phone,
        jurisdiction: intake.jurisdiction,
        matterType: intake.matterType,
        summary: intake.summary,
        goals: intake.goals,
        urgency: intake.urgency,
      },
    };

    return NextResponse.json(transformedIntake, { status: 201 });
  } catch (error) {
    console.error("Error creating intake:", error);
    return NextResponse.json(
      { error: "Failed to create intake" },
      { status: 500 }
    );
  }
}

