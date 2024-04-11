import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  addColourSelectionFunctionality,
  BasicGroupData,
  BudgetFormVisibility,
  capitaliseFirstLetter,
  GroupItemEntity,
  getRandomGroupColour,
  SetFormVisibility,
  changeFormOrModalVisibility,
} from "../../../../util.ts";
import "../../../../css/Budget.css";
import GroupColourSelector from "../../selectors/GroupColourSelector.tsx";
import useCreateGroup from "../../../../hooks/mutations/budget/useCreateGroup.ts";

interface GroupCreationFormProps {
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
}

/**
 * A form for creating a new budget category group.
 */
export default function GroupCreationForm({ setBudgetFormVisibility }: GroupCreationFormProps) {
  const [formData, setFormData] = useState<BasicGroupData>({
    group: "",
    colour: "",
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: createGroup } = useCreateGroup();

  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateGroupVisible", false);
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const removeColourEventListeners = addColourSelectionFunctionality(setFormData);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      removeColourEventListeners();
    };
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((oldFormData) => {
      return { ...oldFormData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({ group: "", colour: "" });

    const newGroupItem: GroupItemEntity = {
      group: formData.group,
      colour: formData.colour ? formData.colour : getRandomGroupColour(),
      timestamp: new Date(),
    };

    createGroup(newGroupItem);
  }

  return (
    <div ref={formRef} className="fulcrum-form justify-center items-center">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className="close-form-or-modal-button mb-6 font-bold text-3xl">New Category Group</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="Group Name">Group Name</label>
        <input
          type="text"
          onChange={handleInputChange}
          value={capitaliseFirstLetter(formData.group)}
          name="group"
          id="group"
          className="mb-3"
          maxLength={22}
          required
        />

        <GroupColourSelector />

        <FulcrumButton displayText="Add New Category Group" />
      </form>
    </div>
  );
}
