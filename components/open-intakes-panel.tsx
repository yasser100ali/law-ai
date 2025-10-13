import React from "react";
import { motion } from "framer-motion";
import { IntakeRecord } from "@/types/intake";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function OpenIntakesPanel({
  records,
  onDeleteIntake,
}: {
  records: IntakeRecord[];
  onDeleteIntake: (id: string) => void;
}) {
  const [matterFilter, setMatterFilter] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<"date" | "score">("date");

  const matterTypes = React.useMemo(() => {
    const unique = new Set<string>();
    records.forEach((record) => {
      const trimmed = record?.form?.matterType?.trim();
      if (trimmed && trimmed.length > 0) {
        unique.add(trimmed);
      }
    });
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [records]);

  const filteredRecords = React.useMemo(() => {
    let filtered = records.filter(record => record && record.form); // Remove invalid records
    
    // Apply matter type filter
    if (matterFilter !== "All") {
      filtered = filtered.filter(
        (record) => record?.form?.matterType?.trim() === matterFilter,
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    if (sortBy === "score") {
      sorted.sort((a, b) => {
        const scoreA = a?.aiScore ?? -1;
        const scoreB = b?.aiScore ?? -1;
        return scoreB - scoreA; // Highest score first
      });
    } else {
      sorted.sort((a, b) => {
        return new Date(b?.submittedAt || 0).getTime() - new Date(a?.submittedAt || 0).getTime();
      });
    }

    return sorted;
  }, [records, matterFilter, sortBy]);

  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());

  const backendUrl = process.env.NODE_ENV === "development" 
    ? "http://127.0.0.1:8000"
    : process.env.RAILWAY_URL || "https://law-ai-production-01cd.up.railway.app";

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this intake? This action cannot be undone.")) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch(`${backendUrl}/api/intakes?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Intake deleted successfully");
        onDeleteIntake(id);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete intake");
      }
    } catch (error) {
      console.error("Error deleting intake:", error);
      toast.error("Failed to delete intake");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">
            Open Intakes (for lawyers only)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Review the latest claimant submissions and filter by matter type to
            focus on the cases that best match your practice areas.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-background/40 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">Matter type</p>
                <p className="text-xs text-muted-foreground">
                  Filter intakes by the matter type.
                </p>
              </div>
              <select
                value={matterFilter}
                onChange={(event) => setMatterFilter(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {matterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All matter types" : type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">Sort by</p>
                <p className="text-xs text-muted-foreground">
                  Order intakes by date or AI score.
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as "date" | "score")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <option value="date">Most Recent</option>
                <option value="score">Highest AI Score</option>
              </select>
            </div>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              {records.length === 0
                ? "No intakes have been filed yet."
                : "No intakes match this matter type filter."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Once claimants submit intake forms, they will appear here for
              review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords
              .filter(record => record && record.id && record.form) // Extra safety
              .map((record) => {
              const submittedDate = new Date(record?.submittedAt || Date.now());
              const formattedDate = submittedDate.toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <motion.div
                  key={record?.id || Math.random()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-border/60 bg-background/70 p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-semibold text-foreground">
                          {record?.form?.fullName || "Anonymous claimant"}
                        </h3>
                        {record?.aiScore !== undefined && (
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                            record.aiScore >= 70 
                              ? "bg-green-500/20 text-green-600 border border-green-500/40" 
                              : record.aiScore >= 40 
                              ? "bg-yellow-500/20 text-yellow-600 border border-yellow-500/40"
                              : "bg-red-500/20 text-red-600 border border-red-500/40"
                          }`}>
                            AI Score: {record.aiScore}/100
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formattedDate}
                        {record?.form?.jurisdiction && ` · ${record.form.jurisdiction}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-start">
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {record?.form?.matterType && (
                          <span className="rounded-full border border-border/60 px-3 py-1 text-foreground">
                            {record.form.matterType}
                          </span>
                        )}
                        <span className="rounded-full border border-border/60 px-3 py-1">
                          {record?.shareWithMarketplace
                            ? "Opted into marketplace"
                            : "Private intake"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(record?.id || "")}
                        disabled={deletingIds.has(record?.id || "")}
                        className="h-7 px-3 text-xs"
                      >
                        {deletingIds.has(record?.id || "") ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-foreground/90">
                    <div>
                      <p className="font-medium text-foreground">Summary</p>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {record?.form?.summary || "No summary provided."}
                      </p>
                    </div>

                    {record?.form?.goals && (
                      <div>
                        <p className="font-medium text-foreground">Desired outcome</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {record.form.goals}
                        </p>
                      </div>
                    )}

                    {record?.form?.urgency && (
                      <div>
                        <p className="font-medium text-foreground">Urgency notes</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {record.form.urgency}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col">
                        {record?.form?.email && (
                          <span>
                            <span className="font-medium text-foreground/80">Email:</span> {record.form.email}
                          </span>
                        )}
                        {record?.form?.phone && (
                          <span>
                            <span className="font-medium text-foreground/80">Phone:</span> {record.form.phone}
                          </span>
                        )}
                      </div>
                      <span>
                        Intake ID: <code className="text-foreground/80">{record?.id || "N/A"}</code>
                      </span>
                    </div>

                    {/* AI Analysis Section */}
                    {record?.aiScore !== undefined && (
                      <details className="mt-4 rounded-md border border-primary/30 bg-primary/5">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-foreground hover:text-primary">
                          📊 View AI Analysis & Recommendations
                        </summary>
                        <div className="space-y-4 px-4 pb-4 pt-2">
                          {record?.aiSummary && (
                            <div>
                              <p className="font-medium text-foreground text-sm">AI Summary</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {record.aiSummary}
                              </p>
                            </div>
                          )}

                          {record?.aiScoreBreakdown && (
                            <div>
                              <p className="font-medium text-foreground text-sm mb-2">Score Breakdown</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between bg-background/60 rounded px-2 py-1">
                                  <span>Legal Merit:</span>
                                  <span className="font-bold">{record.aiScoreBreakdown?.legalMerit || 0}/30</span>
                                </div>
                                <div className="flex justify-between bg-background/60 rounded px-2 py-1">
                                  <span>Evidence:</span>
                                  <span className="font-bold">{record.aiScoreBreakdown?.evidenceQuality || 0}/20</span>
                                </div>
                                <div className="flex justify-between bg-background/60 rounded px-2 py-1">
                                  <span>Damages:</span>
                                  <span className="font-bold">{record.aiScoreBreakdown?.damagesPotential || 0}/25</span>
                                </div>
                                <div className="flex justify-between bg-background/60 rounded px-2 py-1">
                                  <span>Procedural:</span>
                                  <span className="font-bold">{record.aiScoreBreakdown?.proceduralViability || 0}/15</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {record?.aiWarnings && record.aiWarnings.length > 0 && (
                            <div>
                              <p className="font-medium text-foreground text-sm mb-2">⚠️ Warnings</p>
                              <ul className="space-y-1 text-xs">
                                {record.aiWarnings.map((warning, idx) => (
                                  <li key={idx} className="bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-1">
                                    {warning}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {record?.recommendedFirms && record.recommendedFirms.length > 0 && (
                            <div>
                              <p className="font-medium text-foreground text-sm mb-2">Recommended Firms ({record.recommendedFirms.length})</p>
                              <div className="text-xs text-muted-foreground">
                                {record.recommendedFirms.map((firm, idx) => (
                                  <span key={idx}>
                                    {firm.name}
                                    {idx < record.recommendedFirms!.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export { OpenIntakesPanel };
