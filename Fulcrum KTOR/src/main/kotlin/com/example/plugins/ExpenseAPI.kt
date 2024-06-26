package com.example.plugins

import com.example.*
import com.example.SupabaseClient.supabase
import com.example.entities.expense.*
import com.example.entities.recurringExpense.*
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.exceptions.UnknownRestException
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Returning
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.lang.IllegalStateException

fun Application.configureExpenseRouting() {

    routing {

        // EXPENSE API //

        suspend fun executeExpenseCreation(expenseItemResponse: ExpenseCreateRequestSent, call: ApplicationCall) {
            val insertedItem = supabase.postgrest["expenses"].insert(
                expenseItemResponse,
                returning = Returning.REPRESENTATION
            )

            if (insertedItem.body == null) {
                call.respondError("Expense creation failed.")
            }
        }

        post("/api/createExpense") {
            try {
                val expenseCreateRequest = call.receive<ExpenseCreateRequestReceived>()

                val itemToInsert = ExpenseCreateRequestSent(
                    expenseId = expenseCreateRequest.expenseId,
                    userId = getActiveUserId(),
                    category = expenseCreateRequest.category,
                    amount = expenseCreateRequest.amount,
                    timestamp = expenseCreateRequest.timestamp,
                    recurringExpenseId = expenseCreateRequest.recurringExpenseId
                )

                executeExpenseCreation(itemToInsert, call)
                call.respondSuccess("Expense creation successful.")
            } catch (e: Exception) {
                call.application.log.error("Error while creating expense", e)
                call.respondError("Error while creating expense: $e")
            }
        }

        post("/api/batchCreateExpenses") {
            try {
                val batchExpenseCreateRequest = call.receive<BatchExpenseCreateRequestReceived>()
                for (expenseItem in batchExpenseCreateRequest.expensesToCreate) {
                    val itemToInsert = ExpenseCreateRequestSent(
                        expenseId = expenseItem.expenseId,
                        userId = getActiveUserId(),
                        category = expenseItem.category,
                        amount = expenseItem.amount,
                        timestamp = expenseItem.timestamp,
                        recurringExpenseId = expenseItem.recurringExpenseId
                    )
                    executeExpenseCreation(itemToInsert, call)
                }
                call.respondSuccess("Batch expense creation succeeded.")
            } catch (e: Exception) {
                call.application.log.error("Error while batch creating expenses", e)
                call.respondError("Error while batch creating expenses: $e")
            }
        }

        get("/api/getExpenses") {
            try {
                val expenseList = supabase.postgrest["expenses"].select(
                    columns = Columns.list("expenseId, amount, timestamp, category, recurringExpenseId")
                ) {
                    eq("userId", getActiveUserId())
                }.decodeList<ExpenseItemResponse>()
                call.respond(HttpStatusCode.OK, expenseList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: UnknownRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading expenses", e)
                call.respondError("Error while reading expenses: $e.")
            }
        }

        put("/api/updateExpense") {
            try {
                val expenseUpdateRequest = call.receive<ExpenseUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["expenses"].update(
                    {
                        set("category", expenseUpdateRequest.category)
                        set("amount", expenseUpdateRequest.amount)
                        set("timestamp", expenseUpdateRequest.timestamp)
                        set("recurringExpenseId", expenseUpdateRequest.recurringExpenseId)
                    }
                ) {
                    eq("expenseId", expenseUpdateRequest.expenseId)
                    eq("userId", getActiveUserId())
                }

                if (updatedItem.body == null) {
                    call.respondError("Expense updating failed")
                } else {
                    call.respondSuccess("Expense updating successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating expense", e)
                call.respondError("Error while updating expense: $e")
            }
        }

        delete("/api/deleteExpense") {
            try {
                val expenseDeleteRequest = call.receive<ExpenseDeleteRequestReceived>()
                if (executeExpenseDeletion(expenseDeleteRequest.expenseId, call)) {
                    call.respondSuccess("Expense was already deleted.")
                } else {
                    call.respondSuccess("Expense deletion successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting expense", e)
                call.respondError("Error while deleting expense: $e")
            }
        }

        delete("/api/batchDeleteExpenses") {
            try {
                val batchExpenseDeleteRequest = call.receive<BatchExpenseDeleteRequestReceived>()
                for (expenseId in batchExpenseDeleteRequest.expenseIdsToDelete) {
                    executeExpenseDeletion(expenseId, call)
                }
                call.respondSuccess("Batch expense deletion succeeded.")
            } catch (e: Exception) {
                call.application.log.error("Error while batch deleting expenses.")
                call.respondError("Error while batch deleting expenses: $e")
            }
        }

        // RECURRING EXPENSE API //

        post("/api/createRecurringExpense") {
            try {
                val recurringExpenseCreateRequest = call.receive<RecurringExpenseCreateRequestReceived>()

                val itemToInsert = RecurringExpenseCreateRequestSent(
                    recurringExpenseId = recurringExpenseCreateRequest.recurringExpenseId,
                    userId = getActiveUserId(),
                    category = recurringExpenseCreateRequest.category,
                    amount = recurringExpenseCreateRequest.amount,
                    timestamp = recurringExpenseCreateRequest.timestamp,
                    frequency = recurringExpenseCreateRequest.frequency
                )
                val insertedItem = supabase.postgrest["recurring_expenses"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respondError("Recurring expense creation failed.")
                } else {
                    call.respondSuccess("Recurring expense creation successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating recurring expense", e)
                call.respondError("Error while creating recurring expense: $e")
            }
        }

        get("/api/getRecurringExpenses") {
            try {
                val recurringExpenseList = supabase.postgrest["recurring_expenses"].select(
                    columns = Columns.list("recurringExpenseId, category, amount, timestamp, frequency")
                ) {
                    eq("userId", getActiveUserId())
                }.decodeList<RecurringExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, recurringExpenseList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: UnknownRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading recurring expenses", e)
                call.respondError("Error while reading recurring expenses: $e")
            }
        }

        put("/api/updateRecurringExpense") {
            try {
                val recurringExpenseUpdateRequest = call.receive<RecurringExpenseUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["recurring_expenses"].update(
                    {
                        set("category", recurringExpenseUpdateRequest.category)
                        set("amount", recurringExpenseUpdateRequest.amount)
                        set("timestamp", recurringExpenseUpdateRequest.timestamp)
                        set("frequency", recurringExpenseUpdateRequest.frequency)
                    }
                ) {
                    eq("recurringExpenseId", recurringExpenseUpdateRequest.recurringExpenseId)
                    eq("userId", getActiveUserId())
                }

                if (updatedItem.body == null) {
                    call.respondError("Recurring expense update failed.")
                } else {
                    call.respondSuccess("Recurring expense update successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating recurring expense", e)
                call.respondError("Error while updating recurring expense: $e")
            }
        }

        delete("/api/deleteRecurringExpense") {
            try {
                val expenseDeleteRequest = call.receive<RecurringExpenseDeleteRequestReceived>()
                val deletedExpense = supabase.postgrest["recurring_expenses"].delete {
                    eq("recurringExpenseId", expenseDeleteRequest.recurringExpenseId)
                    eq("userId", getActiveUserId())
                }

                if (deletedExpense.body == null) {
                    call.respondError("Recurring expense deletion failed.")
                } else {
                    call.respondSuccess("Recurring expense deletion successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting recurring expense", e)
                call.respondError("Error while deleting recurring expense: $e")
            }
        }

        post("/api/createBlacklistedExpense") {
            try {
                val blacklistedExpenseRequest = call.receive<BlacklistedExpenseCreateRequestReceived>()

                if (executeBlacklistedExpenseCreation(
                        blacklistedExpenseRequest.recurringExpenseId,
                        blacklistedExpenseRequest.timestampOfRemovedInstance,
                        call
                    )
                ) {
                    call.respondSuccess("Blacklist entry already exists.")
                } else {
                    call.respondSuccess("Blacklist entry creation successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating blacklist entry.", e)
                call.respondError("Error while creating blacklist entry: $e")
            }
        }

        post("/api/batchCreateBlacklistedExpenses") {
            try {
                val batchCreateBlacklistedExpenseRequest = call.receive<BatchCreateBlacklistedExpenseRequestReceived>()

                for (timestamp in batchCreateBlacklistedExpenseRequest.timestampsToBlacklist) {
                    executeBlacklistedExpenseCreation(
                        batchCreateBlacklistedExpenseRequest.recurringExpenseId,
                        timestamp,
                        call
                    )
                }
                call.respondSuccess("Batch blacklist entry creation successful.")
            } catch (e: Exception) {
                call.application.log.error("Error while batch creating blacklist entries.", e)
                call.respondError("Error while batch creating blacklist entries: $e")
            }
        }

        get("/api/getBlacklistedExpenses") {
            try {
                val userId = getActiveUserId()
                val blacklistedExpensesList = supabase.postgrest["removed_recurring_expenses"].select(
                    columns = Columns.list(
                        "recurringExpenseId",
                        "timestampOfRemovedInstance"
                    )
                ) {
                    eq("userId", userId)
                }.decodeList<BlacklistedExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, blacklistedExpensesList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: UnknownRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading recurring expenses", e)
                call.respondError("Error while reading recurring expenses: $e")
            }
        }
    }
}