"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { List, Check } from "lucide-react";
import { Feature } from "@/interface/interface";



type FeatureListDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roleName: string;
    onSave: (features: Feature[]) => void;
};

/* ---------- Data ---------- */
const initialFeaturesData: Feature[] = [
    { feature_id: "1", feature_name: "Create Project", access: 1, group_id: "Study Listing" },
    { feature_id: "2", feature_name: "Delete Project", access: 4, group_id: "Study Listing" },
    { feature_id: "3", feature_name: "Copy Project", access: 2, group_id: "Study Listing" },
    { feature_id: "4", feature_name: "Create Quota", access: 2, group_id: "Quota" },
    { feature_id: "5", feature_name: "Sub Quota", access: 3, group_id: "Quota" },
    { feature_id: "6", feature_name: "Summary", access: 1, group_id: "Reports" },
    { feature_id: "7", feature_name: "Text Optics", access: 3, group_id: "Reports" },
];

/* ---------- Access Levels ---------- */
const accessLevels: {
    value: number;
    label: string;
    color: string;
    ring: string;
}[] = [
        {
            value: 1,
            label: "Read",
            color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
            ring: "ring-blue-500/40",
        },
        {
            value: 2,
            label: "Write",
            color: "bg-green-500/10 text-green-600 border-green-500/30",
            ring: "ring-green-500/40",
        },
        {
            value: 3,
            label: "Edit",
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
}: FeatureListDialogProps) {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setFeatures(structuredClone(initialFeaturesData));
            setExpandedGroups([...new Set(initialFeaturesData.map(f => f.group_id))]);
        }
    }, [open]);

    const groupedFeatures = features.reduce<Record<string, Feature[]>>((acc, f) => {
        acc[f.group_id] ??= [];
        acc[f.group_id].push(f);
        return acc;
    }, {});

    const handleAccessChange = (featureId: string, access: number) => {
        setFeatures(prev =>
            prev.map(f =>
                f.feature_id === featureId ? { ...f, access } : f
            )
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <List className="size-5 text-primary" />
                        Feature Access — {roleName}
                    </DialogTitle>
                    <DialogDescription>
                        Configure permissions for each feature.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 pr-2">
                    <Accordion
                        type="multiple"
                        value={expandedGroups}
                        onValueChange={setExpandedGroups}
                        className="space-y-4"
                    >
                        {Object.entries(groupedFeatures).map(([groupName, items]) => (
                            <AccordionItem
                                key={groupName}
                                value={groupName}
                                className="rounded-2xl border bg-card shadow-sm"
                            >
                                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                                    <div className="flex w-full items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            {groupName}
                                        </h3>
                                        <span className="text-xs text-muted-foreground">
                                            {items.length} features
                                        </span>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="px-5 pb-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {items.map(feature => (
                                            <div
                                                key={feature.feature_id}
                                                className="rounded-xl border bg-background p-4 shadow-sm hover:shadow-md transition"
                                            >
                                                <p className="mb-3 text-sm font-semibold">
                                                    {feature.feature_name}
                                                </p>

                                                <div className="flex gap-2">
                                                    {accessLevels.map(level => {
                                                        const active = feature.access === level.value;
                                                        return (
                                                            <button
                                                                key={level.value}
                                                                onClick={() =>
                                                                    handleAccessChange(
                                                                        feature.feature_id,
                                                                        level.value
                                                                    )
                                                                }
                                                                className={`
                                                                    flex items-center justify-center gap-1
                                                                    h-8 w-20 rounded-full border
                                                                    text-[11px] font-medium
                                                                    transition-all
                                                                    ${active
                                                                        ? `${level.color} ring-1 ${level.ring}`
                                                                        : "border-border text-muted-foreground hover:bg-muted/50"
                                                                    }
                                                                `}
                                                            >
                                                                {active && <Check className="size-3" />}
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
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => onSave(features)}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
