package com.example.boardinghousefinder.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.boardinghousefinder.ui.features.auth.ForgotPasswordScreen
import com.example.boardinghousefinder.ui.features.auth.LoginScreen
import com.example.boardinghousefinder.ui.features.auth.RegisterScreen
import com.example.boardinghousefinder.ui.features.landlord.LandlordDashboardScreen
import com.example.boardinghousefinder.ui.features.profile.EditProfileScreen
import com.example.boardinghousefinder.ui.features.profile.ProfileScreen
import com.example.boardinghousefinder.ui.features.student.DashboardScreen
import com.example.boardinghousefinder.ui.features.student.SearchResultScreen

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
        composable("editProfile") {
            EditProfileScreen(navController = navController)
        }
        composable("searchResults") {
            SearchResultScreen(navController)
        }
        composable("forgotPassword") {
            ForgotPasswordScreen(navController)
        }


        // --- THESE ARE THE TWO DASHBOARDS ---

        // Route for the Student Dashboard
        composable("dashboard") {
            DashboardScreen(navController = navController)
        }

        // Route for the Landlord Dashboard
        composable("landlordDashboard") {
            LandlordDashboardScreen(navController = navController)
        }
    }
}