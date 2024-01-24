import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    BudgetItemEntity,
    getBudgetList,
    ExpenseItemEntity,
    SelectorOptionsFormattedData,
    colourStyles,
    ExpenseUpdatingFormData, handleExpenseUpdating, getExpenseList, handleInputChangeOnFormWithAmount
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';

interface ExpenseUpdatingFormProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<{
        isCreateExpenseVisible: boolean,
        isUpdateExpenseVisible: boolean,
    }>>;
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    categoryOptions: SelectorOptionsFormattedData[];
    oldExpenseBeingEdited: { expenseId: string, oldCategory: string, oldAmount: number };
}

export default function ExpenseUpdatingForm({ setExpenseFormVisibility, setExpenseArray, setBudgetArray, categoryOptions, oldExpenseBeingEdited }: ExpenseUpdatingFormProps) {


    const [formData, setFormData] = useState<ExpenseUpdatingFormData>({ category: oldExpenseBeingEdited.oldCategory, amount: oldExpenseBeingEdited.oldAmount });
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setExpenseFormVisibility(current => ({...current, isUpdateExpenseVisible: false}))
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        handleInputChangeOnFormWithAmount(e, setFormData);
    }

    function handleCategoryInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, category: e.value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setExpenseFormVisibility(current => ({...current, isUpdateExpenseVisible: false}))

        await handleExpenseUpdating(oldExpenseBeingEdited.expenseId, formData);

        setFormData({ category: oldExpenseBeingEdited.oldCategory, amount: oldExpenseBeingEdited.oldAmount });
        getExpenseList().then(expenseList => setExpenseArray(expenseList));

        // To update budgetArray if new category is made:
        getBudgetList().then(budgetList => setBudgetArray(budgetList));
    }

    return (
        <div ref={formRef} className="fulcrum-form fixed flex flex-col justify-start items-center rounded-3xl text-white">
            <FulcrumButton onClick={() => {
                setExpenseFormVisibility(current => ({...current, isUpdateExpenseVisible: false}))
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className="mb-6 font-bold text-4xl">Updating Expense</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <CreatableSelect
                    id="category"
                    name="category"
                    defaultValue={{
                        label: oldExpenseBeingEdited.oldCategory,
                        value: oldExpenseBeingEdited.oldCategory,
                        colour: categoryOptions.filter(categoryOption => (
                            categoryOption.label === oldExpenseBeingEdited.oldCategory
                        ))[0].colour
                    }}
                    options={categoryOptions.map(option => {
                        return {label: option.label, value: option.value, colour: option.colour!!}
                    })}
                    onChange={handleCategoryInputChange}
                    styles={colourStyles}
                    className="mb-3"
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: '#262925',
                            primary: "black"
                        },
                    })}
                    required
                />

                <label htmlFor="amount">Amount</label>
                <div>
                    <b className="relative left-6 text-black">$</b>
                    <input type="text"
                           onChange={handleInputChange}
                           value={formData.amount ?? ""}
                           name="amount"
                           id="amount"
                           className="mb-3"
                           required
                    />
                </div>

                <FulcrumButton displayText="Update Budget" />
            </form>
        </div>
    );
}