"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { resetThemeColor, setThemeColor } from "@/redux/theme-slice";

export function ThemeCustomizer({ isOpen, onOpenChange }: any) {
  const dispatch = useDispatch();
  const hexColor = useSelector((state: RootState) => state.theme.hexColor);

  // Apply theme every time value changes (fully synced)
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", hexColor);
  }, [hexColor]);

  const handleSave = () => {
    toast.success("Theme saved!");
    onOpenChange(false);
  };

  const handleReset = () => {
    dispatch(resetThemeColor());
    toast.success("Theme reset!");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-max p-4">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
        </DialogHeader>

        <Separator className="mt-2" />

        {/* Color Picker */}
        <div className="flex items-center space-x-2 mb-3">
          <Label className="font-semibold">Select Color</Label>

          <Input
            type="color"
            value={hexColor}
            onChange={(e) => dispatch(setThemeColor(e.target.value))}
            className="w-20 h-10 p-0 border rounded cursor-pointer"
          />

          <Label className="font-semibold">HEX Code:</Label>
          <p className="text-gray-800">{hexColor}</p>
        </div>

        {/* Preview */}
        <p className="mb-2 font-semibold">Preview</p>
        <div
          className="h-20 rounded-md border"
          style={{ backgroundColor: hexColor }}
        />

        <Separator className="my-2" />

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>

          <Button
            className="flex-1 text-white"
            style={{ backgroundColor: hexColor }}
            onClick={handleSave}
          >
            Save Theme
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
