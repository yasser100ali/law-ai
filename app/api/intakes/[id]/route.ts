import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/intakes/[id] - Delete a specific intake
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if intake exists
    const existingIntake = await prisma.intake.findUnique({
      where: { id },
    });

    if (!existingIntake) {
      return NextResponse.json(
        { error: "Intake not found" },
        { status: 404 }
      );
    }

    // Delete the intake
    await prisma.intake.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting intake:", error);
    return NextResponse.json(
      { error: "Failed to delete intake" },
      { status: 500 }
    );
  }
}
