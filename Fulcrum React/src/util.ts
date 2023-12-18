import {Dispatch, SetStateAction} from "react";

export interface ExpenseItemEntity {
    expenseId: string
    category: string
    amount: number
    timestamp: Date
}

export interface BudgetItemEntity {
    category: string
    amount: number
    iconPath: string
    group: string
}

export interface BudgetCreationFormData {
    category: string;
    amount: number;
    iconPath: string;
    group: string;
}

export interface BudgetUpdatingFormData {
    amount: number;
    group: string;
    iconPath: string;
}

export interface BasicGroupData {
    group: string;
    colour: string;
}

export interface GroupOptionsFormattedData {
    value: string;
    label: string;
    colour: string;
}

export async function getExpenseList() {
    try {
        const response = await fetch("http://localhost:8080/api/getExpenses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getBudgetList() {
    try {
        const response = await fetch("http://localhost:8080/api/getBudget", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.location.href = "/login"
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleBudgetDeletion(category: string, setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>) {
    setBudgetArray(prevState => prevState.filter(budgetItem => budgetItem.category !== category))
    try {
        const response = await fetch("http://localhost:8080/api/deleteBudget", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "category": category,
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch(error) {
        console.error("Error:", error);
    }

    getBudgetList().then( budgetList => setBudgetArray(budgetList))
}

export async function handleBudgetCreation(formData: BudgetCreationFormData, setBudgetArray: (value: (((prevState: BudgetItemEntity[]) => BudgetItemEntity[]) | BudgetItemEntity[])) => void, newBudgetItem: BudgetItemEntity) {
    try {
        const response = await fetch("http://localhost:8080/api/createBudget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: formData.category,
                amount: formData.amount ? formData.amount : 0,
                iconPath: formData.iconPath != "" ? formData.iconPath : "/src/assets/category-icons/category-default-icon.svg",
                group: formData.group ? formData.group : "Miscellaneous"
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Category name is invalid or already has assigned budget; or $999,999,999 limit exceeded.")
            setBudgetArray(current => {
                const indexOfInvalidItem = current.map(item => item.category).lastIndexOf(newBudgetItem.category);
                if (indexOfInvalidItem !== -1) {
                    return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                }
                return current;
            })
        }
        const responseData = await response.json()
        console.log(responseData);
        setBudgetArray(await getBudgetList());

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleBudgetUpdating(category: string | null, formData: BudgetUpdatingFormData) {
    try {
        const response = await fetch("http://localhost:8080/api/updateBudget", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "category": category,
                "amount": formData.amount,
                "group": formData.group,
                "iconPath": formData.iconPath
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getGroupListAsOptions() {
    try {
        const response = await fetch("http://localhost:8080/api/getGroups", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`)
        } else {
            const responseData = await response.json();
            return responseData.map(
                (groupColourPair: { group: String, colour: String }) => (
                    {value: groupColourPair.group, label: groupColourPair.group, colour: groupColourPair.colour}
                )
            )
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleGroupCreation(formData: BasicGroupData, setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>, newGroupItem: BasicGroupData) {
    try {
        const response = await fetch("http://localhost:8080/api/createGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                group: formData.group,
                colour: formData.colour
            })
        });
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Group name is invalid or already exists.")
            setInitialGroupOptions(current => {
                const indexOfInvalidItem = current.map(item => item.label).lastIndexOf(newGroupItem.group);
                if (indexOfInvalidItem !== -1) {
                    return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                }
                return current;
            })
        }
        const responseData = await response.json()
        console.log(responseData);
        setInitialGroupOptions(await getGroupListAsOptions());
    } catch (error) {
        console.error("Error:", error);
    }
}

export function getRandomColour() {
    const colourArray = [
        '#81e1d7', '#5cd67b', '#6087d6', '#c4696d',
        '#c08757', '#65a9c6', '#4ab6a3', '#6ec15d',
        '#5f74da', '#81d16d', '#ae7cd1', '#e49b84',
        '#71d0be', '#bb5171', '#8065c6', '#8d66b2'
    ];

    // Gives number between 0 and 1: Math.random()
    // Gives number within bounds of array size: Math.random() * colourArray.length
    // Floor it.

    const randomColourIndex = Math.floor(Math.random() * colourArray.length);
    return colourArray[randomColourIndex];
}

export function addIconSelectionFunctionality(setFormData:
                                                  Dispatch<SetStateAction<BudgetUpdatingFormData>>
                                                  | Dispatch<SetStateAction<BudgetCreationFormData>>) {
    const categoryIcons: NodeListOf<HTMLImageElement> = document.querySelectorAll(".category-icon-selectable");
    categoryIcons.forEach((icon): void => {
        icon.addEventListener("click", (e: MouseEvent) => {
            e.preventDefault();
            const iconPath = `/src/assets/category-icons/${icon.getAttribute("data-value")!}`;

            setFormData((currentFormData: any) => {
                return {...currentFormData, ["iconPath"]: iconPath}
            });
            console.log(`iconPath: ${iconPath}`)

            document.querySelectorAll('.category-icon-selectable').forEach(btn => btn.classList.remove('selected'));
            icon.classList.add('selected');
        });
    });
}

export function getAmountBudgeted(budgetArray: BudgetItemEntity[]) {
    const amountArray = budgetArray.map( budgetItem => (
        budgetItem.amount
    ))
    console.log(amountArray)
    return amountArray.reduce((accumulator, currentValue) => (
        accumulator + currentValue
    ), 0)
}



export function formatNumberWithCommas(numberString: string) {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};