package com.example.entities.user

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class PublicUserDataResponse(
    @Contextual val createdAt: Instant,
    val darkModeEnabled: Boolean,
    val accessibilityEnabled: Boolean
)