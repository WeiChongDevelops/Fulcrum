import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import {
  capitaliseFirstLetter,
  cn,
  DEFAULT_CATEGORY_GROUP,
  DEFAULT_CATEGORY_ICON,
  getHighestBudgetSortIndex,
  getHighestGroupSortIndex,
  getRandomGroupColour,
  handleInputChangeOnFormWithAmount,
  useEmail,
} from "@/utility/util.ts";
import { BudgetCreationFormData, BudgetItemEntity, GroupItemEntity, UserPreferences } from "@/utility/types.ts";
import CategoryIconSelector from "@/components-v2/subcomponents/selectors/CategoryIconSelector.tsx";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useCreateBudget from "@/hooks/mutations/budget/useCreateBudget.ts";
import GroupSelector from "@/components-v2/subcomponents/budget/GroupSelector.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface CreateBudgetFormV2Props {
  groupNameOfNewItem: string;
  currencySymbol: string;
}

export default function CreateBudgetFormV2({ groupNameOfNewItem, currencySymbol }: CreateBudgetFormV2Props) {
  const [formData, setFormData] = useState<BudgetCreationFormData>({
    category: "",
    amount: 0,
    iconPath: "",
    group: groupNameOfNewItem,
  });
  const { mutate: createBudget } = useCreateBudget();
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  const groupArray: GroupItemEntity[] = useQueryClient().getQueryData(["groupArray", useEmail()])!;
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const [formIsOpen, setFormIsOpen] = useState(false);

  function hideForm() {
    setFormIsOpen(false);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      category: "",
      amount: 0,
      iconPath: "",
      group: groupNameOfNewItem,
    });
    let defaultGroupItem: GroupItemEntity | undefined = undefined;

    const newBudgetItem: BudgetItemEntity = {
      category: formData.category,
      amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
      iconPath: formData.iconPath === "" ? DEFAULT_CATEGORY_ICON : formData.iconPath,
      group: formData.group ? formData.group : DEFAULT_CATEGORY_GROUP,
      timestamp: new Date(),
      id: getHighestBudgetSortIndex(budgetArray) + 1,
    };

    if (!groupArray.map((groupItem) => groupItem.group).includes(newBudgetItem.group)) {
      defaultGroupItem = {
        group: newBudgetItem.group,
        colour: getRandomGroupColour(),
        timestamp: new Date(),
        id: getHighestGroupSortIndex(groupArray) + 1,
      };
    }

    createBudget({
      newBudgetItem: newBudgetItem,
      newGroupItem: defaultGroupItem,
    });
  }

  useEffect(() => {
    setFormData({
      category: "",
      amount: 0,
      iconPath: "",
      group: groupNameOfNewItem,
    });
  }, [formIsOpen]);

  return (
    <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
      <SheetTrigger>
        <Button
          asChild
          variant={"empty"}
          className="size-36 rounded-xl border-2 border-dashed border-primary hover:rounded-md hover:bg-[#DEDEDE33] transition-all duration-200 ease-out"
        >
          <b>+</b>
        </Button>
      </SheetTrigger>
      <SheetContent className={cn(userPreferences.darkModeEnabled && "dark")}>
        <SheetHeader>
          <SheetTitle>New Budget Item</SheetTitle>
          <SheetDescription>Create a new budgeting category.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="category" className={"text-right"}>
              Category
            </Label>
            <Input
              type="text"
              className={"col-span-3"}
              onChange={handleInputChange}
              value={capitaliseFirstLetter(formData.category)}
              name="category"
              id="category"
              maxLength={18}
              autoComplete={"off"}
              required
            />
          </div>

          <div className={"grid grid-cols-4 items-center gap-5 relative"}>
            <Label htmlFor="amount" className={"text-right"}>
              Amount
            </Label>
            <b className="absolute inset-y-0 left-[7.5rem] flex items-center text-primary text-sm">{currencySymbol}</b>
            <Input
              type="text"
              className={"col-span-3 pl-8"}
              onChange={handleInputChange}
              value={formData.amount === 0 ? "" : formData.amount}
              name="amount"
              id="amount"
              autoComplete={"off"}
              required
            />
          </div>

          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="group" className={"text-right"}>
              Group
            </Label>
            <GroupSelector formData={formData} setFormData={setFormData} />
          </div>

          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="iconPath" className={"text-right"}>
              Icon
            </Label>
            <CategoryIconSelector setFormData={setFormData} className={"col-span-3"} />
          </div>
          <Button className={"mt-2 self-end"} variant={userPreferences.darkModeEnabled ? "secondary" : "default"}>
            Add Budget
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
