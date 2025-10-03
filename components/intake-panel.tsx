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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate a network request for now. This is where an API call would go.
    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      const record: IntakeRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        submittedAt: new Date().toISOString(),
        shareWithMarketplace,
        form: { ...formData },
      };
      onIntakeSubmitted(record);
      toast.success(
        shareWithMarketplace
          ? "Your intake is ready to share with matched firms."
          : "Your intake has been saved."
      );
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
    }, 650);
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
      </div>
    </div>
  );
}

export { IntakePanel };
