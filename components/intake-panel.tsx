import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IntakeRecord } from "@/types/intake";

function IntakePanel({
  onIntakeSubmitted,
}: {
  onIntakeSubmitted: (record: IntakeRecord) => void;
}) {
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    jurisdiction: "",
    matterType: "",
    summary: "",
    goals: "",
    urgency: "",
  });
  const [shareWithMarketplace, setShareWithMarketplace] = React.useState(true);
  const [consent, setConsent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [submittedIntake, setSubmittedIntake] = React.useState<IntakeRecord | null>(null);

  const handleChange = (
    field: keyof typeof formData,
  ): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> => {
    return (event) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  };

  const backendUrl = process.env.NODE_ENV === "development" 
    ? "http://127.0.0.1:8000"
    : process.env.RAILWAY_URL || "https://law-ai-production-01cd.up.railway.app";

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/api/intakes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shareWithMarketplace,
          form: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit intake");
      }

      const record: IntakeRecord = await response.json();
      
      setIsSubmitting(false);
      setHasSubmitted(true);
      setSubmittedIntake(record);
      onIntakeSubmitted(record);
      
      // Show appropriate toast based on AI analysis
      if (record.aiScore !== undefined) {
        toast.success(
          `Intake submitted! AI Case Strength Score: ${record.aiScore}/100`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          shareWithMarketplace
            ? "Your intake is ready to share with matched firms."
            : "Your intake has been saved."
        );
      }
      
      // Reset form for new submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        jurisdiction: "",
        matterType: "",
        summary: "",
        goals: "",
        urgency: "",
      });
      setConsent(false);
      setShareWithMarketplace(true);
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to submit intake. Please try again.");
      console.error("Error submitting intake:", error);
    }
  };

  const isValid =
    formData.fullName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.summary.trim().length > 0 &&
    consent;

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">File an Intake</h2>
          <p className="text-muted-foreground leading-relaxed">
            Capture the essentials of your legal matter once and let Eve handle the heavy lifting.
            We&apos;ll structure your intake so that future marketplace partners can review cases ranked by
            their fit—saving you the time of repeating your story to multiple firms.
          </p>
          <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Coming soon</p>
            <p>
              After submission, you&apos;ll be able to post this intake to Eve&apos;s firm board where participating
              firms are ranked by how well they match your needs. For now, fill out the form below to get
              started and we&apos;ll notify you when sharing is available.
            </p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Full name *</span>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange("fullName")}
                placeholder="Jane Doe"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Email *</span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="jane@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Phone</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange("phone")}
                placeholder="(555) 123-4567"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Jurisdiction</span>
              <input
                type="text"
                value={formData.jurisdiction}
                onChange={handleChange("jurisdiction")}
                placeholder="e.g. California, Los Angeles County"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Matter type</span>
              <select
                value={formData.matterType}
                onChange={(event) => {
                  setFormData((prev) => ({
                    ...prev,
                    matterType: event.target.value,
                  }));
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <option value="">Select matter type</option>
                <option value="employment">Employment</option>
                <option value="personal injury">Personal Injury</option>
                <option value="mass tort/class action">Mass Tort/Class Action</option>
                <option value="family law">Family Law</option>
                <option value="immigration law">Immigration Law</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Describe what happened *</span>
            <Textarea
              required
              value={formData.summary}
              onChange={handleChange("summary")}
              placeholder="Give us the key facts, timeline, and parties involved."
              className="min-h-[140px]"
            />
          </label>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">What outcome are you hoping for?</span>
              <Textarea
                value={formData.goals}
                onChange={handleChange("goals")}
                placeholder="Settlement goals, desired remedies, or open questions."
                className="min-h-[100px]"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Deadlines or urgency</span>
              <Textarea
                value={formData.urgency}
                onChange={handleChange("urgency")}
                placeholder="Upcoming court dates, statutes of limitation, or other timing notes."
                className="min-h-[100px]"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-lg border border-border/60 bg-background/40 p-4">
            <p className="text-sm font-medium text-foreground">Marketplace preview</p>
            <p className="text-sm text-muted-foreground">
              Opt in to share this intake with Eve&apos;s partner firms when the board launches. We&apos;ll rank interested firms
              by how closely they match your case profile so you can review the best fits first.
            </p>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-input"
                checked={shareWithMarketplace}
                onChange={(event) => setShareWithMarketplace(event.target.checked)}
              />
              Share my intake with matched firms when available
            </label>
          </div>

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border border-input"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              I understand that Eve is not my attorney and that submitting this form does not create a lawyer-client relationship.
              My information will be handled in accordance with Eve&apos;s privacy practices.
            </span>
          </label>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Submitting..." : hasSubmitted ? "Update intake" : "Submit intake"}
            </Button>
            {hasSubmitted && (
              <p className="text-sm text-muted-foreground">
                Intake saved. We&apos;ll email you when sharing to firms is live.
              </p>
            )}
          </div>
        </form>

        {/* AI Assessment Results */}
        {submittedIntake && submittedIntake.aiScore !== undefined && (
          <div className="mt-8 space-y-6 rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                AI Case Assessment
                <span className="text-lg font-normal text-muted-foreground">
                  (Score: {submittedIntake.aiScore}/100)
                </span>
              </h3>
              {submittedIntake.aiSummary && (
                <p className="text-foreground leading-relaxed">
                  {submittedIntake.aiSummary}
                </p>
              )}
            </div>

            {/* Score Breakdown */}
            {submittedIntake.aiScoreBreakdown && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Score Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-md bg-background/60 p-3 border border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Legal Merit</span>
                      <span className="text-sm font-bold">{submittedIntake.aiScoreBreakdown.legalMerit}/30</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-background/60 p-3 border border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Evidence Quality</span>
                      <span className="text-sm font-bold">{submittedIntake.aiScoreBreakdown.evidenceQuality}/20</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-background/60 p-3 border border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Damages Potential</span>
                      <span className="text-sm font-bold">{submittedIntake.aiScoreBreakdown.damagesPotential}/25</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-background/60 p-3 border border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Procedural Viability</span>
                      <span className="text-sm font-bold">{submittedIntake.aiScoreBreakdown.proceduralViability}/15</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-background/60 p-3 border border-border/40 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Likelihood of Success</span>
                      <span className="text-sm font-bold">{submittedIntake.aiScoreBreakdown.likelihoodOfSuccess}/10</span>
                    </div>
                  </div>
                </div>
                {submittedIntake.aiScoreBreakdown.explanation && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {submittedIntake.aiScoreBreakdown.explanation}
                  </p>
                )}
              </div>
            )}

            {/* Warnings */}
            {submittedIntake.aiWarnings && submittedIntake.aiWarnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  ⚠️ Important Warnings
                </h4>
                <ul className="space-y-2">
                  {submittedIntake.aiWarnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-foreground bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Firms */}
            {submittedIntake.recommendedFirms && submittedIntake.recommendedFirms.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Recommended Law Firms</h4>
                <div className="space-y-3">
                  {submittedIntake.recommendedFirms.map((firm, idx) => (
                    <div key={idx} className="rounded-md bg-background/60 p-4 border border-border/40 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-foreground">{firm.name}</h5>
                          <p className="text-sm text-muted-foreground">{firm.location}</p>
                        </div>
                        {firm.website && (
                          <a
                            href={firm.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Visit Website →
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Practice Areas:</strong> {firm.practiceAreas.join(", ")}
                      </p>
                      <p className="text-sm text-foreground">{firm.reasoning}</p>
                      <p className="text-xs text-muted-foreground">Source: {firm.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applicable Laws */}
            {submittedIntake.applicableLaws && submittedIntake.applicableLaws.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Applicable Laws</h4>
                <div className="space-y-2">
                  {submittedIntake.applicableLaws.map((law, idx) => (
                    <div key={idx} className="rounded-md bg-background/60 p-3 border border-border/40">
                      <p className="font-medium text-sm text-foreground">{law.statute}</p>
                      <p className="text-sm text-muted-foreground mt-1">{law.summary}</p>
                      <p className="text-xs text-muted-foreground mt-1"><strong>Relevance:</strong> {law.relevance}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Reasoning */}
            {submittedIntake.aiReasoning && (
              <details className="space-y-2">
                <summary className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary">
                  View Full Analysis
                </summary>
                <div className="mt-3 rounded-md bg-background/60 p-4 border border-border/40 text-sm text-foreground whitespace-pre-wrap">
                  {submittedIntake.aiReasoning}
                </div>
              </details>
            )}

            <Button
              onClick={() => setSubmittedIntake(null)}
              variant="outline"
              className="w-full"
            >
              File Another Intake
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export { IntakePanel };
