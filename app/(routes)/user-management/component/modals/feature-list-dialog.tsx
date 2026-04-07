"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Feature } from "@/interface/interface";
import { useAssingFeature, useFeatureList } from "../api";
import { toast } from "sonner";

type FeatureListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleName: string;
  onSave: (features: Feature[]) => void;
  roleId: string;
  canEdit: boolean
};

/* ---------- Access Levels ---------- */
const accessLevels: {
  value: number;
  label: string;
  color: string;
  ring: string;
}[] = [
  {
    value: 1,
    label: "None",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    ring: "ring-blue-500/40",
  },
  {
    value: 2,
    label: "Read",
    color: "bg-green-500/10 text-green-600 border-green-500/30",
    ring: "ring-green-500/40",
  },
  {
    value: 3,
    label: "Write",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    ring: "ring-amber-500/40",
  },
  {
    value: 4,
    label: "Delete",
    color: "bg-red-500/10 text-red-600 border-red-500/30",
    ring: "ring-red-500/40",
  },
];

export function FeatureListDialog({
  open,
  onOpenChange,
  roleName,
  onSave,
  roleId,
  canEdit
}: FeatureListDialogProps) {
  const { data, isLoading, isError } = useFeatureList(roleId, open);

  const { mutate: assignFeature, isPending } = useAssingFeature();

  const [features, setFeatures] = useState<
    Record<
      string,
      { feature_id: string; feature_name: string; access: number }[]
    >
  >({});

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setFeatures({});
      setExpandedGroups([]);
      return;
    }

    if (data) {
      const structured: Record<
        string,
        { feature_id: string; feature_name: string; access: number }[]
      > = {};

      data.forEach((group) => {
        structured[group.feature_grp_name] = group.feature_list.map((f) => ({
          feature_id: f.feature_id,
          feature_name: f.feature_name,
          access: f.permission_level ?? 1,
        }));
      });

      setFeatures(structured);
      setExpandedGroups(data.map((g) => g.feature_grp_name));
    }
  }, [open, data]);

  const handleAccessChange = (
    groupName: string,
    featureId: string,
    access: number,
  ) => {
    setFeatures((prev) => ({
      ...prev,
      [groupName]: prev[groupName].map((f) =>
        f.feature_id === featureId ? { ...f, access } : f,
      ),
    }));
  };

  const handleSave = () => {
    if (!canEdit) {
    toast.error("You do not have permission to perform this action.");
    return; // stop save
  }
    const payload = {
      features: Object.entries(features).flatMap(([_, items]) =>
        items.map((f) => ({
          role_id: roleId,
          feature_id: f.feature_id,
          permission_level: f.access,
        })),
      ),
    };

    assignFeature(payload, {
      onSuccess: () => {
        toast.success("Feature assigned successfull")
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Feature Access — {roleName}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading && <div className="text-center">Loading...</div>}
          {isError && (
            <div className="text-center text-destructive">
              Failed to load features
            </div>
          )}

          {!isLoading && !isError && (
            <Accordion
              type="multiple"
              value={expandedGroups}
              onValueChange={setExpandedGroups}
            >
              {Object.entries(features).map(([groupName, items]) => (
                <AccordionItem key={groupName} value={groupName}>
                  <AccordionTrigger>{groupName}</AccordionTrigger>

                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((feature) => (
                        <div
                          key={feature.feature_id}
                          className="border p-4 rounded-lg"
                        >
                          <p className="mb-3 font-medium">
                            {feature.feature_name}
                          </p>

                          <div className="flex gap-2">
                            {accessLevels.map((level) => {
                              const active = feature.access === level.value;

                              return (
                                <button
                                  key={level.value}
                                  onClick={() =>
                                    handleAccessChange(
                                      groupName,
                                      feature.feature_id,
                                      level.value,
                                    )
                                  }
                                  className={`h-8 w-20 rounded-full border text-xs
                                    ${
                                      active
                                        ? level.color
                                        : "border-border text-muted-foreground"
                                    }
                                  `}
                                >
                                  {level.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
