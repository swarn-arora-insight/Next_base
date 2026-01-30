import { LucideIcon } from "lucide-react";

export interface TabItem {
  tab_name: string;
  access: number;
  add_button: string;
  icon: LucideIcon;
}

export type Feature = {
  feature_id: string;
  feature_name: string;
  access: number;
  group_id: string;
};