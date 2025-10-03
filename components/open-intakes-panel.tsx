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

  const matterTypes = React.useMemo(() => {
    const unique = new Set<string>();
    records.forEach((record) => {
      const trimmed = record.form.matterType.trim();
      if (trimmed.length > 0) {
        unique.add(trimmed);
      }
    });
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [records]);

  const filteredRecords = React.useMemo(() => {
    if (matterFilter === "All") {
      return records;
    }

    return records.filter(
      (record) => record.form.matterType.trim() === matterFilter,
    );
  }, [records, matterFilter]);

  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this intake? This action cannot be undone.")) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch(`/api/intakes/${id}`, {
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

        <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Matter type</p>
            <p className="text-xs text-muted-foreground">
              Filter intakes by the matter type provided by the claimant.
            </p>
          </div>
          <select
            value={matterFilter}
            onChange={(event) => setMatterFilter(event.target.value)}
            className="w-full sm:w-56 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {matterTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All matter types" : type}
              </option>
            ))}
          </select>
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
            {filteredRecords.map((record) => {
              const submittedDate = new Date(record.submittedAt);
              const formattedDate = submittedDate.toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-border/60 bg-background/70 p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground">
                        {record.form.fullName || "Anonymous claimant"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formattedDate}
                        {record.form.jurisdiction && ` · ${record.form.jurisdiction}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-start">
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {record.form.matterType && (
                          <span className="rounded-full border border-border/60 px-3 py-1 text-foreground">
                            {record.form.matterType}
                          </span>
                        )}
                        <span className="rounded-full border border-border/60 px-3 py-1">
                          {record.shareWithMarketplace
                            ? "Opted into marketplace"
                            : "Private intake"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(record.id)}
                        disabled={deletingIds.has(record.id)}
                        className="h-7 px-3 text-xs"
                      >
                        {deletingIds.has(record.id) ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-foreground/90">
                    <div>
                      <p className="font-medium text-foreground">Summary</p>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {record.form.summary || "No summary provided."}
                      </p>
                    </div>

                    {record.form.goals && (
                      <div>
                        <p className="font-medium text-foreground">Desired outcome</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {record.form.goals}
                        </p>
                      </div>
                    )}

                    {record.form.urgency && (
                      <div>
                        <p className="font-medium text-foreground">Urgency notes</p>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {record.form.urgency}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col">
                        {record.form.email && (
                          <span>
                            <span className="font-medium text-foreground/80">Email:</span> {record.form.email}
                          </span>
                        )}
                        {record.form.phone && (
                          <span>
                            <span className="font-medium text-foreground/80">Phone:</span> {record.form.phone}
                          </span>
                        )}
                      </div>
                      <span>
                        Intake ID: <code className="text-foreground/80">{record.id}</code>
                      </span>
                    </div>
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
