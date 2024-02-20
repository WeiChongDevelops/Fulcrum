import {
    BudgetItemEntity,
    categoryListAsOptions, CategoryToIconGroupAndColourMap, checkForOpenModalOrForm, getCurrencySymbol,
    getRecurringExpenseList,
    GroupItemEntity, handleRecurringExpenseDeletion, OpenToolsSection,
    PreviousRecurringExpenseBeingEdited, PublicUserData,
    RecurringExpenseFormVisibility,
    RecurringExpenseItemEntity,
    RecurringExpenseModalVisibility
} from "../../util.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import RecurringExpenseItem from "./RecurringExpenseItem.tsx";
import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
import RecurringExpenseUpdatingForm from "../ModalsAndForms/RecurringExpenseUpdatingForm.tsx";
import Loader from "../Other/Loader.tsx";
import FulcrumButton from "../Other/FulcrumButton.tsx";

interface RecurringExpensesProps {
    setOpenToolsSection: Dispatch<SetStateAction<OpenToolsSection>>;

    publicUserData: PublicUserData;

    budgetArray: BudgetItemEntity[];
    groupArray: GroupItemEntity[];

    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>

    categoryDataMap: CategoryToIconGroupAndColourMap;
}

export default function RecurringExpenses({ setOpenToolsSection, publicUserData, budgetArray, groupArray, setBudgetArray, categoryDataMap }: RecurringExpensesProps) {

    const [recurringExpenseArray, setRecurringExpenseArray] = useState<RecurringExpenseItemEntity[]>([]);
    const [recurringExpenseModalVisibility, setRecurringExpenseModalVisibility] = useState<RecurringExpenseModalVisibility>({
        isConfirmRecurringExpenseDestructionModalVisible: false,
    });
    const [recurringExpenseFormVisibility, setRecurringExpenseFormVisibility] = useState<RecurringExpenseFormVisibility>({
        isUpdateRecurringExpenseVisible: false
    });

    const [isRecurringExpenseFormOrModalOpen, setIsRecurringExpenseFormOrModalOpen] = useState(false);

    const [oldRecurringExpenseBeingEdited, setOldRecurringExpenseBeingEdited] = useState<PreviousRecurringExpenseBeingEdited>({ recurringExpenseId: "", oldCategory: "", oldAmount: 0, oldFrequency: "annually" });
    const [recurringExpenseIdToDelete, setRecurringExpenseIdToDelete] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function retrieveData() {

            const [recurringExpenseArray] = await Promise.all([
                getRecurringExpenseList(),
            ])

            setRecurringExpenseArray(recurringExpenseArray);

            await new Promise(resolve => setTimeout(resolve, 0));

        }
        retrieveData()
            .then(() => setIsLoading(false))
    }, []);

    useEffect( () => {
        document.getElementById("frequency")?.focus()
        document.getElementById("right-button")?.focus()
        setIsRecurringExpenseFormOrModalOpen(checkForOpenModalOrForm(recurringExpenseFormVisibility, recurringExpenseModalVisibility))
    }, [recurringExpenseFormVisibility, recurringExpenseModalVisibility])

    function runRecurringExpenseDeletion() {
        handleRecurringExpenseDeletion(recurringExpenseIdToDelete, setRecurringExpenseArray)
            .then(() => console.log("Deletion successful"))
            .catch(() => console.log("Deletion unsuccessful"));
    }

    return (
        <>
            {!isLoading ? <div className="flex flex-col justify-start items-center bg-[#455259] min-h-screen">
                <div className={`flex flex-col justify-center items-center w-[100vw] elementsBelowPopUpForm z-2
                    ${isRecurringExpenseFormOrModalOpen && "blur"}`}>

                    <div className="flex justify-between items-center mt-6 w-full">
                        <div className="flex-grow flex flex-row justify-start">
                            <FulcrumButton displayText={"Go Back"}
                                           onClick={() => setOpenToolsSection("home")}
                                           backgroundColour={"white"}
                                           optionalTailwind={"ml-[2.5vw]"}/>
                        </div>

                        <img src="/src/assets/UI-icons/tools-recurring-icon-white.svg" alt="Cycle icon"/>
                        <h1 className="text-white font-bold mx-8">Recurring Expenses</h1>
                        <img src="/src/assets/UI-icons/tools-recurring-icon-white.svg" alt="Cycle icon"/>

                        <div className="flex-grow flex flex-row justify-end">
                            <FulcrumButton displayText={"Go Back"}
                                           onClick={() => setOpenToolsSection("home")}
                                           backgroundColour={"white"}
                                           optionalTailwind={"opacity-0"}/>
                        </div>
                    </div>

                    <p className={"font-medium my-4"}>Add recurring expenses for transactions you expect to arise regularly.</p>

                    {recurringExpenseArray.length > 0 ? recurringExpenseArray.map((recurringExpenseItem, key) => {

                        return <RecurringExpenseItem
                            recurringExpenseId={recurringExpenseItem.recurringExpenseId}
                            category={recurringExpenseItem.category}
                            amount={recurringExpenseItem.amount}
                            iconPath={categoryDataMap.get(recurringExpenseItem.category)!.iconPath}
                            frequency={recurringExpenseItem.frequency}
                            groupName={categoryDataMap.get(recurringExpenseItem.category)!.group}
                            groupColour={categoryDataMap.get(recurringExpenseItem.category)!.colour}
                            setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
                            setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
                            setOldRecurringExpenseBeingEdited={setOldRecurringExpenseBeingEdited}
                            setRecurringExpenseIdToDelete={setRecurringExpenseIdToDelete}
                            publicUserData={publicUserData}
                            key={key}
                        />
                    }): <p className={"text-2xl mt-48"}>Your recurring expenses will appear here.</p>}
                </div>

                {isRecurringExpenseFormOrModalOpen && <div className="absolute w-screen h-screen bg-transparent z-3"></div>}

                <div className="z-4">
                    {recurringExpenseFormVisibility.isUpdateRecurringExpenseVisible &&
                        <RecurringExpenseUpdatingForm setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
                                                      setRecurringExpenseArray={setRecurringExpenseArray}
                                                      setBudgetArray={setBudgetArray}
                                                      categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                                                      oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
                                                      currencySymbol={getCurrencySymbol(publicUserData.currency)}/>}

                    {recurringExpenseModalVisibility.isConfirmRecurringExpenseDestructionModalVisible &&
                        <TwoOptionModal optionOneText="Cancel"
                                        optionOneFunction={() => setRecurringExpenseModalVisibility(current => ({
                                            ...current,
                                            isConfirmRecurringExpenseDestructionModalVisible: false
                                        }))} optionTwoText="Confirm" optionTwoFunction={() => {
                            runRecurringExpenseDeletion()
                            setRecurringExpenseModalVisibility(current => ({
                                ...current,
                                isConfirmRecurringExpenseDestructionModalVisible: false
                            }));
                        }}
                                        setModalVisibility={setRecurringExpenseModalVisibility}
                                        isVisible="isConfirmRecurringExpenseDestructionModalVisible"
                                        title="Are you sure you want to delete this recurring expense? Don't worry, this won't affect any past records."/>}
                </div>
            </div> : <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled}/>}
        </>
    );
}