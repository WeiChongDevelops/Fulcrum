package com.example.plugins

import com.example.SupabaseClient.supabase
import com.example.entities.budget.BudgetItemResponse
import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import com.example.entities.user.*
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureOtherRouting() {

    suspend fun getActiveUserId(): String {
        return supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id
    }

    suspend fun ApplicationCall.respondSuccess(message: String) {
        respond(HttpStatusCode.OK, SuccessResponseSent(message))
    }

    suspend fun ApplicationCall.respondError(message: String) {
        respond(HttpStatusCode.BadRequest, ErrorResponseSent(message))
    }

    routing {

        // BROADER DESTRUCTIVE API //

        suspend fun wipeTableIfPopulated(table: String, call: ApplicationCall) {
            if (supabase.postgrest["budgets"].select() {
                    eq("userId", com.example.getActiveUserId())
                }.decodeSingleOrNull<BudgetItemResponse>() != null){
                val budgetWipeRequestSent = supabase.postgrest[table].delete() {
                    eq("userId", getActiveUserId())
                }
                if (budgetWipeRequestSent.body == null) {
                    call.respondError("Items not wiped.")
                }
            }
        }

        delete("/api/wipeExpenses"){
            try {
                wipeTableIfPopulated("expenses", call)
                wipeTableIfPopulated("recurring_expenses", call)
                call.respondSuccess("Expenses wiped successfully.")
            } catch (e: Exception) {
                call.respondError("Error while wiping expenses.")
            }
        }

        delete("/api/wipeBudget"){
            try {
                wipeTableIfPopulated("budgets", call)
                wipeTableIfPopulated("groups", call)
                call.respondSuccess("Budget wiped successfully.")
            } catch (e: Exception) {
                call.respondError("Error while wiping budget.")
            }
        }

        delete("/api/wipeData"){
            try {
                wipeTableIfPopulated("budget", call)
                wipeTableIfPopulated("expenses", call)
                wipeTableIfPopulated("recurring_expenses", call)
                call.respondSuccess("Data wiped successfully.")
            } catch (e: Exception) {
                call.respondError("Error while wiping data.")
            }
        }


        // PUBLIC USER DATA //

        get("/api/getPublicUserData") {
            try {
                val userData = supabase.postgrest["public_user_data"].select(columns = Columns.list("currency, createdAt, darkModeEnabled, accessibilityEnabled, profileIconFileName")) {
                    eq("userId", getActiveUserId())
                }
                    .decodeSingle<PublicUserDataResponse>()
                call.respond(HttpStatusCode.OK, userData)
            } catch (e: Exception) {
                call.respondError("Public user data retrieval failed.")
            }
        }

        put("/api/updatePublicUserData") {
            try {
                val publicUserDataUpdateRequest = call.receive<PublicUserDataUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["public_user_data"].update(
                    {
                        set("currency", publicUserDataUpdateRequest.currency)
                        set("darkModeEnabled", publicUserDataUpdateRequest.darkModeEnabled)
                        set("accessibilityEnabled", publicUserDataUpdateRequest.accessibilityEnabled)
                        set("profileIconFileName", publicUserDataUpdateRequest.profileIconFileName)
                    }
                ) {
                    eq("userId", getActiveUserId())
                }

                if (updatedItem.body == null) {
                    call.respondError("Public user data not updated")
                } else {
                    call.respondSuccess("Public user data updated.")
                }
            } catch (e: Exception) {
                call.respondError("Failed to update public user data.")
            }
        }

    }
}