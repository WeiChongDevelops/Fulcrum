import { BudgetItemEntity } from "@/utility/types.ts";
import { budgetSort, DEFAULT_CATEGORY_GROUP, DEFAULT_CATEGORY_ICON } from "@/utility/util.ts";
import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";

/**
 * Creates a new budget item and updates the budget array state.
 * @param newBudgetItem - The new budget item to be added.u
 */
export async function handleBudgetCreationDirect(newBudgetItem: BudgetItemEntity): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("budgets")
      .insert({
        userId: activeUserId,
        category: newBudgetItem.category.trim(),
        amount: newBudgetItem.amount ? newBudgetItem.amount : 0,
        iconPath: newBudgetItem.iconPath != "" ? newBudgetItem.iconPath : DEFAULT_CATEGORY_ICON,
        group: newBudgetItem.group ? newBudgetItem.group.trim() : DEFAULT_CATEGORY_GROUP,
        id: newBudgetItem.id,
      })
      .select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ insertedBudget: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting budget creation: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting budget creation.");
    }
  }
}

/**
 * Retrieves the list of budget items from the server.
 * @returns A sorted array of budget items, or an empty array in case of an error.
 */
export async function getBudgetListDirect(): Promise<BudgetItemEntity[]> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("budgets")
      .select("category, amount, iconPath, group, timestamp, id")
      .eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ Budget_List_Retrieved: data.sort(budgetSort) });
    return data.sort(budgetSort);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`An error occurred while fetching the budget list: ${error.message}.`);
    } else {
      throw new Error("Unknown error encountered when requesting budget list retrieval.");
    }
  }
}

/**
 * Updates an existing budget item based on the provided form data.
 * @param originalCategory - The category of the budget item to update.
 * @param updatedBudgetItem - The updated data for the budget item.
 */
export async function handleBudgetUpdatingDirect(
  originalCategory: string,
  updatedBudgetItem: BudgetItemEntity,
): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("budgets")
      .update({
        category: updatedBudgetItem.category.trim(),
        amount: updatedBudgetItem.amount,
        group: updatedBudgetItem.group.trim(),
        iconPath: updatedBudgetItem.iconPath,
      })
      .eq("userId", activeUserId)
      .eq("category", originalCategory);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ updatedBudgetItem: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting budget updating: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting budget updating.");
    }
  }
}

/**
 * Deletes a budget item.
 * @param category - The category of the budget item to be deleted.
 */
export async function handleBudgetDeletionDirect(category: string): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { error } = await supabaseClient.from("budgets").delete().eq("userId", activeUserId).eq("category", category);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log("Budget deletion successful.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting budget deletion: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting budget deletion.");
    }
  }
}
