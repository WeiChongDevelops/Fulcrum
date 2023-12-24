import {BudgetItemEntity, GroupOptionsFormattedData} from "../../util.ts";
import Group from "./Group.tsx";
import {Dispatch, SetStateAction} from "react";
import AddNewGroupButton from "./AddNewGroupButton.tsx";

interface GroupListProps {
    budgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    initialGroupOptions: GroupOptionsFormattedData[];
    setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>;

    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setIsCreateGroupVisible: Dispatch<SetStateAction<boolean>>;

    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<{ oldAmount: number, oldCategory: string, oldGroup: string }>>
}

export default function GroupList( { budgetArray,
                                       setBudgetArray,
                                       setIsUpdateBudgetVisible,
                                       initialGroupOptions,
                                       setIsCreateBudgetVisible,
                                       setGroupNameOfNewItem,
                                       setIsCreateGroupVisible,
                                       setInitialGroupOptions,
                                       setOldBudgetBeingEdited}: GroupListProps ) {

    // 1. Make an array containing unique group in the budgetArray
    const groupArray = initialGroupOptions.map( groupOption => groupOption.label)
    console.log(groupArray)

    return (
        <div>
            {
                // 2. For each unique group, create a filtered version of the budgetArray with only budgetItems with that group
                groupArray.map( (group: string, key) => {
                    const filteredBudgetArray = budgetArray.filter( (budgetItem: BudgetItemEntity) => {
                        return budgetItem.group === group
                    })
                    const groupColour: string = initialGroupOptions.filter( (groupOption) => {
                        return groupOption.value === group
                    } )[0].colour!!
                    return <Group groupName={group}
                                  filteredBudgetArray={filteredBudgetArray}
                                  setBudgetArray={setBudgetArray}
                                  setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                                  setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                                  groupColour={groupColour}
                                  setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                                  setGroupNameOfNewItem={setGroupNameOfNewItem}
                                  setInitialGroupOptions={setInitialGroupOptions}
                                  key={key}/>
                })
            }
            <AddNewGroupButton setIsCreateGroupVisible={setIsCreateGroupVisible}/>
        </div>
    )
}