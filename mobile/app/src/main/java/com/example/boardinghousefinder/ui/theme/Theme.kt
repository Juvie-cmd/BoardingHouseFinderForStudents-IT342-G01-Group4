package com.example.boardinghousefinder.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

// --- Custom Blue Theme Colors ---
val BluePrimary = Color(0xFF1A73E8)
val OnBluePrimary = Color.White
val SurfaceLight = Color(0xFFF0F2F5) // The light gray background from DashboardScreen
val CardBackground = Color.White
val TextDark = Color(0xFF202124)
val TextGray = Color(0xFF5F6368)

private val DarkColorScheme = darkColorScheme(
    primary = BluePrimary, // You might want a lighter blue for dark mode
    onPrimary = OnBluePrimary,
    background = Color(0xFF121212),
    surface = Color(0xFF1E1E1E),
    onBackground = Color(0xFFE0E0E0),
    onSurface = Color(0xFFE0E0E0),
    onSurfaceVariant = TextGray
)

private val LightColorScheme = lightColorScheme(
    primary = BluePrimary,
    onPrimary = OnBluePrimary,
    secondary = BluePrimary, // Using primary for secondary as well
    onSecondary = OnBluePrimary,
    background = SurfaceLight,
    surface = CardBackground,
    onBackground = TextDark,
    onSurface = TextDark,
    onSurfaceVariant = TextGray // For secondary text like "0.5km from campus"
)

@Composable
fun BoardingHouseFinderTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}