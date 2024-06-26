import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEmail } from "@/utility/util.ts";
import { RecurringExpenseItemEntity } from "@/utility/types.ts";
import { handleRecurringExpenseUpdatingDirect } from "@/api/recurring-api.ts";

export default function useUpdateRecurringExpense() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedRecurringExpenseItem: RecurringExpenseItemEntity) => {
      return handleRecurringExpenseUpdatingDirect(updatedRecurringExpenseItem);
    },
    onMutate: async (updatedRecurringExpenseItem: RecurringExpenseItemEntity) => {
      await queryClient.cancelQueries({ queryKey: ["recurringExpenseArray", email] });
      const recurringExpenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["recurringExpenseArray", email]);
      await queryClient.setQueryData(
        ["recurringExpenseArray", email],
        (prevRecurringExpenseCache: RecurringExpenseItemEntity[]) => {
          return prevRecurringExpenseCache.map((recurringExpenseItem) =>
            recurringExpenseItem.recurringExpenseId === updatedRecurringExpenseItem.recurringExpenseId
              ? { ...updatedRecurringExpenseItem }
              : recurringExpenseItem,
          );
        },
      );
      toast.success("Recurring expense updated!");
      return { recurringExpenseArrayBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["recurringExpenseArray", email], context?.recurringExpenseArrayBeforeOptimisticUpdate);
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringExpenseArray", email] });
    },
  });
}
