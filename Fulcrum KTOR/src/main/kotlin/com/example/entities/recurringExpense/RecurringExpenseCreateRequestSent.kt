package com.example.entities.recurringExpense

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class RecurringExpenseCreateRequestSent(
    val recurringExpenseId: String,
    val userId: String,
    val category: String,
    val amount: Double,
    @Contextual val timestamp: Instant,
    val frequency: String
)
