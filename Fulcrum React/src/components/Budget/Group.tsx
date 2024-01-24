import {
    BudgetFormVisibility,
    BudgetItemEntity,
    BudgetModalVisibility,
    GroupItemEntity,
    handleGroupDeletion,
    PreviousBudgetBeingEdited,
    PreviousGroupBeingEdited
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import BudgetTile from "./BudgetTile.tsx";
import AddNewBudgetToGroupButton from "./AddNewBudgetToGroupButton.tsx";

interface GroupProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;

    groupName: string;
    groupColour: string;

    filteredBudgetArray: BudgetItemEntity[];

    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibility>>;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>
    setOldGroupBeingEdited: Dispatch<SetStateAction<PreviousGroupBeingEdited>>

    setGroupToDelete: Dispatch<SetStateAction<string>>;

    setCategoryToDelete: Dispatch<SetStateAction<string>>;

    perCategoryTotalExpenseArray: Map<string, number>;
}

export default function Group({ groupName,
                                  filteredBudgetArray,
                                  setBudgetArray,
                                  setGroupArray,
                                  groupColour,
                                  setGroupNameOfNewItem,
                                  setOldBudgetBeingEdited,
                                  setOldGroupBeingEdited,
                                  setBudgetFormVisibility,
                                  setGroupToDelete,
                                  setCategoryToDelete,
                                  setModalFormVisibility,
                                  perCategoryTotalExpenseArray}: GroupProps) {

    function handleEditClick() {
        setOldGroupBeingEdited( { oldGroupName: groupName, oldColour: groupColour });
        setBudgetFormVisibility( current => ({...current, isUpdateGroupVisible: true}))
    }
    function handleDeleteClick() {
        setGroupToDelete(groupName);
        // If there are categories inside this group, allow the user to choose between retaining them and deleting them.
        if (filteredBudgetArray.length > 0) {
            setModalFormVisibility(current => ({...current, isDeleteOptionsModalVisible: true}))
        } else {
            handleGroupDeletion(groupName, setGroupArray, setBudgetArray, false)
                .then(() => console.log("Deletion successful"))
                .catch((error) => console.log("Deletion unsuccessful", error));
        }
    }

    return (
        <div className="group flex flex-col rounded-xl p-2 mb-5" style={{backgroundColor: `${groupColour}`}}>
            <div className="flex flex-row justify-center items-center mb-4">
                <b className={`mt - 2 text-xl ${groupName !== "Miscellaneous" ? "text-black" : "text-white"}`}>{groupName}</b>

                {groupName !== "Miscellaneous" &&
                    <div className="flex flex-row justify-center items-center ml-1">
                        <div className="circle-button rounded-full p-1" onClick={handleEditClick}>
                            <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="w-4 h-4" />
                        </div>
                        <div className="circle-button rounded-full p-1" onClick={handleDeleteClick}>
                            <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="w-4 h-4" />
                        </div>
                    </div>
                }

            </div>
            <div className="flex flex-row flex-wrap flex-shrink-0 basis-0 justify-start">
                {filteredBudgetArray.length > 0 && filteredBudgetArray.map((budgetElement, key) => (
                    <BudgetTile
                        category={budgetElement.category}
                        amount={budgetElement.amount}
                        group={groupName}
                        icon={budgetElement.iconPath}
                        setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                        setBudgetFormVisibility={setBudgetFormVisibility}
                        setModalFormVisibility={setModalFormVisibility}
                        setCategoryToDelete={setCategoryToDelete}
                        perCategoryTotalExpenseArray={perCategoryTotalExpenseArray}
                        key={key}
                    />
                ))}
                <AddNewBudgetToGroupButton setBudgetFormVisibility={setBudgetFormVisibility}
                                           setGroupNameOfNewItem={setGroupNameOfNewItem}
                                           groupNameOfNewItem={groupName}/>
            </div>

        </div>
    );
}