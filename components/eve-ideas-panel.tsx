import React from "react";
import { motion } from "framer-motion";

// Rename this helper for EveIdeasPanel so it doesn't collide with the other one
function IdeaCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-muted/50 rounded-lg p-6 space-y-3"
    >
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {children}
    </motion.div>
  );
}

export function EveIdeasPanel() {
  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <h2 className="text-3xl font-bold text-foreground">How Eve can dominate Legal AI</h2>

        {/* 1) Market size & context */}
        <IdeaCard title="Market Size (Why Now)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Legal tech spend:</strong> ≈ <strong>$27–32B</strong>, growing high single digits; overall legal services are ≈ <strong>$1T+</strong>.</li>
            <li><strong>Where adoption starts:</strong> Research/drafting, intake & triage, and eDiscovery/CLM are the fastest-moving GenAI entry points.</li>
            <li><strong>Eve&apos;s focus:</strong> Win the first touch with claimants, then expand into firm workflows.</li>
          </ul>
        </IdeaCard>

        {/* 2) Plaintiff wedge */}
        <IdeaCard title="Plaintiff-Side Intake & Case Score (Your Wedge)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Turn a user&apos;s story into a structured <em>case portfolio</em>: <strong>Strength (0–100)</strong>, <strong>deadline window (SOL)</strong>, <strong>top gaps</strong>, and <strong>venue fit</strong>.</li>
            <li>Ask missing questions so law-firm time is <strong>well-spent</strong>; output a clean, lawyer-ready report.</li>
            <li>Route to best-fit firms by jurisdiction/practice. If a firm takes the case, <strong>Eve earns a commission</strong>; optional, clearly labeled <em>Premium Placement</em> for visibility.</li>
            <li>Result: aligned incentives and Eve becomes the default first stop for claimants.</li>
          </ul>
        </IdeaCard>

        {/* 3) Trust by design */}
        <IdeaCard title="Trust by Design (Court-Safe)">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Citations by default:</strong> Every legal point links to a source; answers stay within the correct jurisdiction.</li>
            <li><strong>Safety net:</strong> Low-confidence answers get flagged for human review; auto AI-use disclosures where required.</li>
            <li><strong>Simple quality metrics:</strong> citation coverage, error catch-rate, turnaround time.</li>
          </ul>
        </IdeaCard>

        {/* 4) Intake → Drafts leverage */}
        <IdeaCard title="From Intake to Drafts Faster">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Auto-extract from emails/PDFs; rank multiple intakes; show <em>why</em> a case scored high/low.</li>
            <li>One-click drafts: demand letter, chronology, discovery requests; fewer back-and-forths.</li>
            <li><strong>KPIs:</strong> time-to-first-draft ↓, signed-case conversion ↑.</li>
          </ul>
        </IdeaCard>

        {/* 5) Marketplace & incentives */}
        <IdeaCard title="Clear Marketplace & Aligned Incentives">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Firms ranked by fit and performance; <em>Sponsored</em> spots are obvious and limited.</li>
            <li><strong>Revenue:</strong> commission on signed matters + premium placement; transparent and predictable.</li>
            <li>As users start with Eve, partnering becomes a competitive necessity for firms.</li>
          </ul>
        </IdeaCard>
      </div>
    </div>
  );
}
