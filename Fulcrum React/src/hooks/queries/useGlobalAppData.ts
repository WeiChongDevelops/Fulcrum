import { getGroupAndColourMap } from "@/utility/util.ts";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getBlacklistedExpenses,
  getBudgetList,
  getExpenseList,
  getGroupList,
  getUserPreferences,
  getRecurringExpenseList,
  getSessionEmailOrNull,
} from "@/utility/api.ts";
import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  CategoryToIconAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  UserPreferences,
  RecurringExpenseItemEntity,
} from "@/utility/types.ts";
import { useState } from "react";
import { getSessionEmailOrNullDirect } from "@/utility/supabase-client.ts";
import { getBudgetListDirect } from "@/api/budget-api.ts";
import { getGroupListDirect } from "@/api/group-api.ts";
import { getExpenseListDirect } from "@/api/expense-api.ts";
import { getRecurringExpenseListDirect } from "@/api/recurring-api.ts";
import { getBlacklistedExpensesDirect } from "@/api/blacklist-api.ts";
import { getProfileImageDirect, getUserPreferencesDirect } from "@/api/user-prefs-api.ts";

export function useGlobalAppData() {
  const sessionStoredProfileIcon = sessionStorage.getItem("profileIconFileName");
  const sessionStoredDarkMode = sessionStorage.getItem("darkModeEnabled");
  const sessionStoredAccessibilityMode = sessionStorage.getItem("accessibilityEnabled");
  const sessionStoredEmail = sessionStorage.getItem("email");

  const emailQuery = useQuery({
    queryKey: ["activeEmail"],
    initialData: !!sessionStoredEmail ? sessionStoredEmail : null,
    queryFn: getSessionEmailOrNullDirect,
    enabled: window.location.href.split("/").includes("app"),
  });

  const email = emailQuery.data;
  const retrievalConditions = !!email && window.location.href.split("/").includes("app");

  const globalAppDataQueries: UseQueryResult[] = useQueries({
    queries: [
      { queryKey: ["budgetArray", email], queryFn: getBudgetListDirect, enabled: retrievalConditions },
      { queryKey: ["groupArray", email], queryFn: getGroupListDirect, enabled: retrievalConditions },
      { queryKey: ["expenseArray", email], queryFn: getExpenseListDirect, enabled: retrievalConditions },
      { queryKey: ["recurringExpenseArray", email], queryFn: getRecurringExpenseListDirect, enabled: retrievalConditions },
      { queryKey: ["blacklistedExpenseArray", email], queryFn: getBlacklistedExpensesDirect, enabled: retrievalConditions },
      {
        queryKey: ["userPreferences", email],
        queryFn: getUserPreferencesDirect,
        enabled: retrievalConditions,
        initialData: {
          createdAt: new Date(),
          currency: "AUD",
          profileIconFileName: sessionStoredProfileIcon ? sessionStoredProfileIcon : "profile-icon-default",
          darkModeEnabled: sessionStoredDarkMode === "true",
          accessibilityEnabled: sessionStoredAccessibilityMode === "true",
        },
      },
    ],
  });

  const [
    budgetArrayQuery,
    groupArrayQuery,
    expenseArrayQuery,
    recurringExpenseArrayQuery,
    blacklistedExpenseArrayQuery,
    userPreferencesQuery,
  ] = globalAppDataQueries;

  if (!!userPreferencesQuery.data) {
    const userPreferences = userPreferencesQuery.data as UserPreferences;
    sessionStorage.setItem("profileIconFileName", userPreferences.profileIconFileName);
    sessionStorage.setItem("darkModeEnabled", userPreferences.darkModeEnabled.toString());
    sessionStorage.setItem("accessibilityEnabled", userPreferences.accessibilityEnabled.toString());
  }

  const categoryToIconAndColourMapQuery = useQuery({
    queryKey: ["categoryToIconAndColourMap", email],
    queryFn: () =>
      getGroupAndColourMap(
        // globalAppDataQueries[0].data as BudgetItemEntity[],
        // globalAppDataQueries[1].data as GroupItemEntity[],
        budgetArrayQuery.data as BudgetItemEntity[],
        groupArrayQuery.data as GroupItemEntity[],
      ),
    enabled: !!email && !!budgetArrayQuery.data && !!groupArrayQuery.data,
  });

  const profileImageURLQuery = useQuery({
    queryKey: ["profileImageURL", email],
    queryFn: () => {
      const userPreferences = userPreferencesQuery.data as UserPreferences;
      return getProfileImageDirect(userPreferences.profileIconFileName);
    },
    enabled: !!userPreferencesQuery.data,
  });

  const [perCategoryExpenseTotalThisMonth, setPerCategoryExpenseTotalThisMonth] = useState<Map<string, number>>(new Map());

  const isAnyLoading =
    globalAppDataQueries.some((query: UseQueryResult) => query.isLoading) || categoryToIconAndColourMapQuery.isLoading;
  const isAnyError =
    globalAppDataQueries.some((query: UseQueryResult) => query.isError) || categoryToIconAndColourMapQuery.isError;
  const isAllSuccess = globalAppDataQueries.some(
    (query: UseQueryResult) => query.isSuccess && categoryToIconAndColourMapQuery.isSuccess,
  );
  const errors = globalAppDataQueries
    .map((query: UseQueryResult) => query.error)
    .filter((error) => error !== null) as Error[];

  return {
    email,
    budgetArray: budgetArrayQuery.data as BudgetItemEntity[],
    groupArray: groupArrayQuery.data as GroupItemEntity[],
    expenseArray: expenseArrayQuery.data as ExpenseItemEntity[],
    recurringExpenseArray: recurringExpenseArrayQuery.data as RecurringExpenseItemEntity[],
    blacklistedExpenseArray: blacklistedExpenseArrayQuery.data as BlacklistedExpenseItemEntity[],
    userPreferences: userPreferencesQuery.data as UserPreferences,
    profileImageURL: profileImageURLQuery.data as string,
    categoryToIconAndColourMap: categoryToIconAndColourMapQuery.data as CategoryToIconAndColourMap,
    perCategoryExpenseTotalThisMonth,
    setPerCategoryExpenseTotalThisMonth,
    isAnyLoading,
    isAnyError,
    isAllSuccess,
    errors,
  };
}
