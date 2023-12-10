package com.example.entities

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class BudgetCreateRequestSent(
    val userId: String,
    val category: String,
    val amount: Double,
    val iconPath: String,
    val group: String
)
