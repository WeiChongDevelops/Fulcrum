import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import GroupColourSelector from "@/components-v2/subcomponents/selectors/GroupColourSelector.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { BasicGroupData, GroupItemEntity, PreviousGroupBeingEdited, UserPreferences } from "@/utility/types.ts";
import useUpdateGroup from "@/hooks/mutations/budget/useUpdateGroup.ts";
import { cn, useEmail } from "@/utility/util.ts";
import { Input } from "@/components-v2/ui/input.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateGroupFormV2Props {
  oldGroupBeingEdited: PreviousGroupBeingEdited;
  setLocalisedGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
  updateOldGroupBeingEdited: (e: React.MouseEvent) => void;
}

export default function UpdateGroupFormV2({
  oldGroupBeingEdited,
  setLocalisedGroupArray,
  updateOldGroupBeingEdited,
}: UpdateGroupFormV2Props) {
  const [formData, setFormData] = useState<BasicGroupData>({
    colour: oldGroupBeingEdited.oldColour,
    group: oldGroupBeingEdited.oldGroupName,
  });
  const { mutate: updateGroup } = useUpdateGroup();
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  const [formIsOpen, setFormIsOpen] = useState(false);

  function hideForm() {
    setFormIsOpen(false);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((currentFormData) => {
      return { ...currentFormData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();

    setLocalisedGroupArray((prevLocalisedGroupArray) =>
      prevLocalisedGroupArray.map((groupItem) =>
        groupItem.group === oldGroupBeingEdited.oldGroupName
          ? { group: formData.group, colour: formData.colour!, timestamp: new Date(), id: oldGroupBeingEdited.oldId }
          : groupItem,
      ),
    );

    const updatedGroupItem: GroupItemEntity = {
      ...formData,
      colour: formData.colour!,
      timestamp: new Date(),
      id: oldGroupBeingEdited.oldId,
    };

    updateGroup({
      originalGroupName: oldGroupBeingEdited.oldGroupName,
      updatedGroupItem: updatedGroupItem,
    });

    setFormData({
      colour: oldGroupBeingEdited.oldColour,
      group: oldGroupBeingEdited.oldGroupName,
    });
  }

  useEffect(() => {
    setFormData({
      colour: oldGroupBeingEdited.oldColour,
      group: oldGroupBeingEdited.oldGroupName,
    });
  }, [oldGroupBeingEdited, formIsOpen]);

  return (
    <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
      <SheetTrigger onClick={updateOldGroupBeingEdited} className={"standard-edit-delete-button "}>
        <Button
          asChild
          variant={"ghost"}
          className={"standard-edit-delete-button flex-justify-center px-2.5 py-0 rounded-[50%] transition-all"}
        >
          <div className={"edit-delete-button-icon-container origin-center transition-all"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4 transition-all duration-200 ease-out"
            >
              <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
            </svg>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className={cn(userPreferences.darkModeEnabled && "dark")}>
        <SheetHeader>
          <SheetTitle>Updating Category Group</SheetTitle>
          <SheetDescription>{`Making changes to the group '${oldGroupBeingEdited.oldGroupName}'.`}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="group" className={"text-right"}>
              Name
            </Label>
            <Input
              type="text"
              className={"col-span-3"}
              name="group"
              id="group"
              value={formData.group}
              onChange={handleInputChange}
              autoComplete={"off"}
            />
          </div>

          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="group" className={"mt-4 text-right"}>
              Colour
            </Label>
            <GroupColourSelector
              oldColour={oldGroupBeingEdited.oldColour}
              setFormData={setFormData}
              className={"col-span-3"}
            />
          </div>

          <Button className={"mt-2 self-end"} variant={userPreferences.darkModeEnabled ? "secondary" : "default"}>
            Save Changes
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
