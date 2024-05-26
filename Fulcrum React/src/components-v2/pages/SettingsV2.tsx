import { PublicUserData, SettingsFormVisibility, SettingsModalVisibility } from "@/utility/types.ts";
import { useContext, useEffect, useRef, useState } from "react";
import { checkForOpenModalOrForm, LocationContext } from "@/utility/util.ts";
import SettingsHeaderV2 from "@/components-v2/subcomponents/settings/SettingsHeaderV2.tsx";
import CurrencySelectorV2 from "@/components-v2/subcomponents/selectors/CurrencySelectorV2.tsx";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";
import AccessibilityToggleV2 from "@/components-v2/subcomponents/toggles/AccessibilityToggleV2.tsx";
import FulcrumButton from "@/components/child/buttons/FulcrumButton.tsx";
import ActiveFormClickShield from "@/components/child/other/ActiveFormClickShield.tsx";
import SettingsModalsAndForms from "@/components/child/tools/settings/SettingsModalsAndForms.tsx";
import "@/css/Tools.css";
import { Button } from "@/components-v2/ui/button.tsx";
import FulcrumDialogTwoOptions from "@/components-v2/subcomponents/other/FulcrumDialogTwoOptions.tsx";
import useWipeExpenses from "@/hooks/mutations/expense/useWipeExpenses.ts";
import useWipeBudget from "@/hooks/mutations/budget/useWipeBudget.ts";
import useResetAccountData from "@/hooks/mutations/other/useResetAccountData.ts";
import FulcrumTypematchModal from "@/components-v2/subcomponents/other/FulcrumTypematchModal.tsx";

interface SettingsV2Props {
  publicUserData: PublicUserData;
}

/**
 * The root component for the settings page.
 */
export default function SettingsV2({ publicUserData }: SettingsV2Props) {
  // const [settingsFormVisibility, setSettingsFormVisibility] = useState<SettingsFormVisibility>({
  //   typeDeleteMyExpensesForm: false,
  //   typeDeleteMyBudgetForm: false,
  //   typeDeleteMyDataForm: false,
  //   typeResetMyAccountForm: false,
  // });
  // const [settingsModalVisibility, setSettingsModalVisibility] = useState<SettingsModalVisibility>({
  //   isConfirmExpenseWipeModalVisible: false,
  //   isConfirmBudgetWipeModalVisible: false,
  //   isConfirmAllDataWipeModalVisible: false,
  //   isConfirmBudgetResetModalVisible: false,
  // });
  // const [isSettingsFormOrModalOpen, setIsSettingsFormOrModalOpen] = useState<boolean>(false);
  const elementsBelowPopUpForm = useRef<HTMLDivElement>(null);
  const routerLocation = useContext(LocationContext);

  // useEffect(() => {
  //   setIsSettingsFormOrModalOpen(checkForOpenModalOrForm(settingsFormVisibility, settingsModalVisibility));
  // }, [settingsFormVisibility, settingsModalVisibility, routerLocation]);

  const { mutate: wipeExpenses } = useWipeExpenses();
  const { mutate: wipeData } = useWipeBudget();
  const { mutate: resetData } = useResetAccountData();

  const [showWipeExpenseTypematchModal, setShowWipeExpenseTypematchModal] = useState(false);
  const [showWipeDataTypematchModal, setShowWipeDataTypematchModal] = useState(false);
  const [showResetAccountTypematchModal, setShowResetAccountTypematchModal] = useState(false);

  return (
    <div className={"flex flex-col justify-start items-center relative"}>
      <SettingsHeaderV2 publicUserData={publicUserData} />
      <div className={"flex flex-col justify-start items-center gap-2 w-[95%] h-[94%] mt-[6vh] pt-8 font-extralight"}>
        <div className={"settings-row bg-[#17423f] h-16"}>
          <b>Currency</b>
          {/*<CurrencySelector publicUserData={publicUserData} />*/}
          <CurrencySelectorV2 publicUserData={publicUserData} className={"w-[20ch] mx-0"} />
        </div>

        <div className={"settings-row bg-[#17423f] h-16"}>
          <b>Appearance</b>
          <DarkModeToggleV2 publicUserData={publicUserData} />
        </div>

        <div className={"settings-row bg-[#17423f] h-16"}>
          <b>Accessibility</b>
          <AccessibilityToggleV2 publicUserData={publicUserData} />
        </div>

        <div className={"settings-row bg-[#17423f] h-16"}>
          <b>Public License</b>
          <Button onClick={() => window.open("https://github.com/WeiChongDevelops/Fulcrum/blob/main/README.md", "_blank")}>
            See Public License
          </Button>
        </div>

        <div className={"settings-row bg-[#17423f] h-16"}>
          <b>Privacy Policy</b>
          <Button onClick={() => window.open(window.location.origin + "/privacy", "_blank")}>See Privacy Policy</Button>
        </div>

        <div className={"settings-row bg-[#17423f] h-16"}>
          <b>Joined On</b>
          <p>{new Date(publicUserData.createdAt).toLocaleDateString()}</p>
        </div>

        <div className={"settings-row wipe-options"}>
          <FulcrumTypematchModal
            typeMatchString={"Wipe My Expenses"}
            dialogOpen={showWipeExpenseTypematchModal}
            setDialogOpen={setShowWipeExpenseTypematchModal}
            dialogTitle={"Wipe all expenses?"}
            dialogDescription={"This decision is irreversible."}
            leftButtonText={"Cancel"}
            leftButtonFunction={() => setShowWipeExpenseTypematchModal(false)}
            rightButtonText={"Confirm"}
            rightButtonFunction={() => {
              setShowWipeExpenseTypematchModal(false);
              wipeExpenses();
            }}
            buttonTriggerComponent={<Button variant={"destructive"}>Wipe Expenses</Button>}
          />

          <FulcrumTypematchModal
            typeMatchString={"Wipe My Data"}
            dialogOpen={showWipeDataTypematchModal}
            setDialogOpen={setShowWipeDataTypematchModal}
            dialogTitle={"Wipe all data?"}
            dialogDescription={"This decision is irreversible."}
            leftButtonText={"Cancel"}
            leftButtonFunction={() => setShowWipeDataTypematchModal(false)}
            rightButtonText={"Confirm"}
            rightButtonFunction={() => {
              setShowWipeDataTypematchModal(false);
              wipeData();
            }}
            buttonTriggerComponent={<Button variant={"destructive"}>Wipe Data</Button>}
          />

          <FulcrumTypematchModal
            typeMatchString={"Reset to Defaults"}
            dialogOpen={showResetAccountTypematchModal}
            setDialogOpen={setShowResetAccountTypematchModal}
            dialogTitle={"Reset account to default data?"}
            dialogDescription={"This decision is irreversible."}
            leftButtonText={"Cancel"}
            leftButtonFunction={() => setShowResetAccountTypematchModal(false)}
            rightButtonText={"Confirm"}
            rightButtonFunction={() => {
              setShowResetAccountTypematchModal(false);
              resetData();
            }}
            buttonTriggerComponent={<Button variant={"destructive"}>Reset Defaults</Button>}
          />
        </div>
      </div>
    </div>
  );
}
