import '/src/css/Budget.css';
import {BudgetItemEntity, formatNumberWithCommas, handleBudgetDeletion} from "../../util.ts";
import React, {Dispatch, SetStateAction} from "react";

interface BudgetTileProps {
    category: string;
    amount: number;
    icon: string;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setEditingCategory: Dispatch<SetStateAction<string | null>>;
    setEditingOldAmount: Dispatch<SetStateAction<number>>;
}

export default function BudgetTile({ category, amount, icon, setBudgetArray, setIsUpdateBudgetVisible, setEditingCategory, setEditingOldAmount}: BudgetTileProps) {

    function handleEditClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        setIsUpdateBudgetVisible(true);
        setEditingCategory(category);
        setEditingOldAmount(amount);
    }

    const tempHardCodedColour = "red"

    function handleDeleteClick() {
        handleBudgetDeletion(category, setBudgetArray)
            .then((response) => console.log("Deletion successful", response))
            .catch((error) => console.log("Deletion unsuccessful", error));
    }

    return (
        <div className="boxShadow budgetTile flex flex-col justify-center items-center mx-10 rounded-2xl" style={{backgroundColor: `${tempHardCodedColour}`}}>
            <div className="flex justify-center items-center rounded-full bg-green-950 p-4 w-20 h-20">
                <img className="budget-icon" src={icon} alt="" />
            </div>
            <b>{category}</b>

            <div className="flex flex-row items-center">
                <b>${formatNumberWithCommas(amount.toFixed(2))}</b>
            </div>

            <div className="circle-button rounded-full p-1" onClick={handleEditClick}>
                <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="mx-1 w-6 h-6" />
            </div>
            <div className="circle-button rounded-full p-1" onClick={handleDeleteClick}>
                <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="mx-1 w-6 h-6" />
            </div>
        </div>
    );
}
