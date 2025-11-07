package com.example.boardinghousefinder.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.boardinghousefinder.ui.screens.*

@Composable
fun AppNavHost(navController: NavHostController) {

    NavHost(navController = navController, startDestination = "login") {
        composable("login") {
            LoginScreen(navController = navController)
        }
        composable("register") {
            RegisterScreen(navController = navController)
        }
        composable("profile") {
            ProfileScreen(navController = navController)
        }

        // --- THESE ARE THE TWO DASHBOARDS ---

        // Route for the Student Dashboard
        composable("dashboard") {
            DashboardScreen(navController = navController)
        }

        // NEW Route for the Landlord Dashboard
        composable("landlordDashboard") {
            LandlordDashboardScreen(navController = navController)
        }
    }
}