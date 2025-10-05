import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Intake } from "@prisma/client";

// GET /api/intakes - Fetch all intakes
export async function GET() {
  try {
    const intakes = await prisma.intake.findMany({
      orderBy: {
        submittedAt: "desc",
      },
    });

    // Transform database records to match IntakeRecord type
    const transformedIntakes = intakes.map((intake: any) => ({
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
      // Include AI assessment fields
      aiSummary: intake.aiSummary ?? undefined,
      aiScore: intake.aiScore ?? undefined,
      aiScoreBreakdown: intake.aiScoreBreakdown as any,
      aiReasoning: intake.aiReasoning ?? undefined,
      aiWarnings: intake.aiWarnings as any,
      recommendedFirms: intake.recommendedFirms as any,
      applicableLaws: intake.applicableLaws as any,
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

    // Call Python backend for AI analysis
    let analysis = null;
    try {
      console.log("Calling Python backend for AI analysis...");
      const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000";
      
      const analysisResponse = await fetch(`${pythonBackendUrl}/api/intakes/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          matterType: form.matterType,
          description: `${form.summary}\n\nGoals: ${form.goals}`,
          location: form.jurisdiction,
          incidentDate: null, // Could add this to form later
        }),
      });

      if (analysisResponse.ok) {
        const result = await analysisResponse.json();
        analysis = result.analysis;
        console.log("AI analysis completed successfully, score:", analysis?.score);
      } else {
        console.error("AI analysis failed:", analysisResponse.status);
      }
    } catch (analysisError) {
      console.error("Error calling AI analysis:", analysisError);
      // Continue without analysis if it fails
    }

    // Create intake with AI analysis data
    const intake: any = await prisma.intake.create({
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
        // AI assessment fields
        aiSummary: analysis?.summary || null,
        aiScore: analysis?.score || null,
        aiScoreBreakdown: analysis?.scoreBreakdown || null,
        aiReasoning: analysis?.reasoning || null,
        aiWarnings: analysis?.warnings || null,
        recommendedFirms: analysis?.recommendedFirms || null,
        applicableLaws: analysis?.applicableLaws || null,
      } as any,
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
      // Include AI assessment
      aiSummary: intake.aiSummary ?? undefined,
      aiScore: intake.aiScore ?? undefined,
      aiScoreBreakdown: intake.aiScoreBreakdown as any,
      aiReasoning: intake.aiReasoning ?? undefined,
      aiWarnings: intake.aiWarnings as any,
      recommendedFirms: intake.recommendedFirms as any,
      applicableLaws: intake.applicableLaws as any,
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

