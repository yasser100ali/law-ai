"use client";

import React from "react";
import { IntakeRecord } from "@/types/intake";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LawyerChat } from "@/components/lawyer-chat";
import { cn } from "@/lib/utils";

export default function LawyerPage() {
  const [intakeRecords, setIntakeRecords] = React.useState<IntakeRecord[]>([]);
  const [isLoadingIntakes, setIsLoadingIntakes] = React.useState(true);
  const [matterFilter, setMatterFilter] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<"date" | "score">("score");
  const [viewMode, setViewMode] = React.useState<"intakes" | "chat">("intakes");

  const backendUrl = process.env.NODE_ENV === "development" 
    ? "http://127.0.0.1:8000"
    : process.env.RAILWAY_URL || "https://law-ai-production-01cd.up.railway.app";

  // Load intakes from database on mount
  React.useEffect(() => {
    const loadIntakes = async () => {
      setIsLoadingIntakes(true);
      try {
        const response = await fetch(`${backendUrl}/api/intakes`);
        if (response.ok) {
          const intakes = await response.json();
          console.log("Loaded intakes:", intakes);
          if (Array.isArray(intakes)) {
            const validIntakes = intakes.filter(intake => intake && intake.form);
            setIntakeRecords(validIntakes);
          } else {
            console.warn("Intakes data is not an array:", intakes);
            setIntakeRecords([]);
          }
        } else {
          console.error("Failed to load intakes:", response.status);
          setIntakeRecords([]);
        }
      } catch (error) {
        console.error("Error loading intakes:", error);
        setIntakeRecords([]);
      } finally {
        setIsLoadingIntakes(false);
      }
    };

    loadIntakes();
  }, [backendUrl]);

  const matterTypes = React.useMemo(() => {
    const unique = new Set<string>();
    intakeRecords.forEach((record) => {
      const trimmed = record?.form?.matterType?.trim();
      if (trimmed && trimmed.length > 0) {
        unique.add(trimmed);
      }
    });
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [intakeRecords]);

  const filteredRecords = React.useMemo(() => {
    let filtered = intakeRecords.filter(record => record && record.form);
    
    if (matterFilter !== "All") {
      filtered = filtered.filter(
        (record) => record?.form?.matterType?.trim() === matterFilter,
      );
    }

    const sorted = [...filtered];
    if (sortBy === "score") {
      sorted.sort((a, b) => {
        const scoreA = a?.aiScore ?? -1;
        const scoreB = b?.aiScore ?? -1;
        return scoreB - scoreA;
      });
    } else {
      sorted.sort((a, b) => {
        return new Date(b?.submittedAt || 0).getTime() - new Date(a?.submittedAt || 0).getTime();
      });
    }

    return sorted;
  }, [intakeRecords, matterFilter, sortBy]);

  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());

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
        setIntakeRecords((prev) => prev.filter((record) => record.id !== id));
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
    <div className="flex h-full overflow-hidden bg-background">
      {/* Left Panel - Intake Rankings */}
      <div className="w-1/2 flex flex-col h-full border-r border-border/40 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="px-6 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Intake Rankings
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredRecords.length} intake{filteredRecords.length !== 1 ? 's' : ''}
                    {matterFilter !== "All" && ` · ${matterFilter}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={viewMode === "chat" ? "outline" : "default"}
                  onClick={() => setViewMode(viewMode === "intakes" ? "chat" : "intakes")}
                  className="text-xs"
                >
                  {viewMode === "intakes" ? "Switch to Chat" : "Back to Intakes"}
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Matter Type
                  </label>
                  <select
                    value={matterFilter}
                    onChange={(event) => setMatterFilter(event.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    {matterTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "All" ? "All types" : type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as "date" | "score")}
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    <option value="score">Highest Score</option>
                    <option value="date">Most Recent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intake List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoadingIntakes ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Loading intakes...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {intakeRecords.length === 0
                    ? "No intakes have been filed yet."
                    : "No intakes match this filter."}
                </p>
                <p className="text-xs text-muted-foreground">
                  Intakes will appear here once claimants submit them.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record, index) => {
                const submittedDate = new Date(record?.submittedAt || Date.now());
                const formattedDate = submittedDate.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <motion.div
                    key={record?.id || Math.random()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="rounded-lg border border-border/60 bg-background/70 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Ranking Badge */}
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        index === 0 && sortBy === "score" 
                          ? "bg-yellow-500/20 text-yellow-600 border-2 border-yellow-500/40" 
                          : index === 1 && sortBy === "score"
                          ? "bg-gray-400/20 text-gray-400 border-2 border-gray-400/40"
                          : index === 2 && sortBy === "score"
                          ? "bg-orange-600/20 text-orange-600 border-2 border-orange-600/40"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-foreground truncate">
                              {record?.form?.fullName || "Anonymous"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {formattedDate}
                            </p>
                          </div>
                          {record?.aiScore !== undefined && (
                            <span className={cn(
                              "flex-shrink-0 rounded-full px-2 py-1 text-xs font-bold",
                              record.aiScore >= 70 
                                ? "bg-green-500/20 text-green-600 border border-green-500/40" 
                                : record.aiScore >= 40 
                                ? "bg-yellow-500/20 text-yellow-600 border border-yellow-500/40"
                                : "bg-red-500/20 text-red-600 border border-red-500/40"
                            )}>
                              {record.aiScore}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 space-y-1">
                          {record?.form?.matterType && (
                            <p className="text-xs">
                              <span className="font-medium text-foreground">Type:</span>{" "}
                              <span className="text-muted-foreground">{record.form.matterType}</span>
                            </p>
                          )}
                          {record?.form?.jurisdiction && (
                            <p className="text-xs">
                              <span className="font-medium text-foreground">Location:</span>{" "}
                              <span className="text-muted-foreground">{record.form.jurisdiction}</span>
                            </p>
                          )}
                          {record?.form?.summary && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                              {record.form.summary}
                            </p>
                          )}
                        </div>

                        {/* Score Breakdown */}
                        {record?.aiScoreBreakdown && (
                          <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
                            <div className="flex justify-between bg-background/60 rounded px-2 py-1">
                              <span className="text-muted-foreground">Merit:</span>
                              <span className="font-semibold">{record.aiScoreBreakdown.legalMerit}/30</span>
                            </div>
                            <div className="flex justify-between bg-background/60 rounded px-2 py-1">
                              <span className="text-muted-foreground">Evidence:</span>
                              <span className="font-semibold">{record.aiScoreBreakdown.evidenceQuality}/20</span>
                            </div>
                            <div className="flex justify-between bg-background/60 rounded px-2 py-1">
                              <span className="text-muted-foreground">Damages:</span>
                              <span className="font-semibold">{record.aiScoreBreakdown.damagesPotential}/25</span>
                            </div>
                            <div className="flex justify-between bg-background/60 rounded px-2 py-1">
                              <span className="text-muted-foreground">Procedural:</span>
                              <span className="font-semibold">{record.aiScoreBreakdown.proceduralViability}/15</span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-3 text-xs flex-1"
                            onClick={() => {
                              // Could expand to show full details
                              toast.info("Full details view coming soon");
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(record?.id || "")}
                            disabled={deletingIds.has(record?.id || "")}
                            className="h-7 px-3 text-xs"
                          >
                            {deletingIds.has(record?.id || "") ? "..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="w-1/2 flex flex-col h-full overflow-hidden">
        <LawyerChat intakeRecords={intakeRecords} />
      </div>
    </div>
  );
}

