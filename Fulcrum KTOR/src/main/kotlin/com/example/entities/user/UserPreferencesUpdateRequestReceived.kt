package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class UserPreferencesUpdateRequestReceived(
    val currency: String,
    val darkModeEnabled: Boolean,
    val accessibilityEnabled: Boolean,
    val profileIconFileName: String
)
