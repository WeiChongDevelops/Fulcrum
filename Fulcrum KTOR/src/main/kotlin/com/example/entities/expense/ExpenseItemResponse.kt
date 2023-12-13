package com.example.entities.expense

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class ExpenseItemResponse(
    val expenseId: String,
    val userId: String,
    val category: String,
    val amount: Double,
    @Contextual val timestamp: Instant,
)