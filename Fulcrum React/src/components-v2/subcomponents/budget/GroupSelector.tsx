import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components-v2/ui/select.tsx";
import { cn, groupSort, useEmail } from "@/utility/util.ts";
import { BudgetCreationFormData, BudgetUpdatingFormData, GroupItemEntity, UserPreferences } from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface GroupSelectorProps {
  formData: BudgetCreationFormData | BudgetUpdatingFormData;
  setFormData: Dispatch<SetStateAction<BudgetCreationFormData>> | Dispatch<SetStateAction<BudgetUpdatingFormData>>;
}

export default function GroupSelector({ formData, setFormData }: GroupSelectorProps) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const groupArray: GroupItemEntity[] = useQueryClient().getQueryData(["groupArray", useEmail()])!;

  const handleGroupSelectChange = (group: string) => {
    setFormData((prevFormData: any) => ({ ...prevFormData, group: group }));
  };

  return (
    <Select value={formData.group} onValueChange={handleGroupSelectChange}>
      <SelectTrigger className={cn("col-span-3 dark:text-primary", userPreferences.darkModeEnabled && "dark")}>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent className={cn(userPreferences.darkModeEnabled && "dark")}>
        {groupArray.sort(groupSort).map((groupItem, index) => (
          <SelectItem value={groupItem.group} key={index}>
            {groupItem.group}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
