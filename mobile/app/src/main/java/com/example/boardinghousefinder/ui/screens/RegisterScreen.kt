package com.example.boardinghousefinder.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(navController: NavController) {
    var fullName by remember { mutableStateOf("") } // Cleared pre-fill
    var email by remember { mutableStateOf("") } // Cleared pre-fill
    var password by remember { mutableStateOf("") } // Cleared pre-fill
    var selectedRole by remember { mutableStateOf("Student") } // For radio buttons

    AuthScreenContainer(
        navController = navController,
        isLogin = false // Indicate this is the register screen
    ) {
        // --- Content specific to Register ---
        Text(
            text = "Create an account",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth()
        )
        Text(
            text = "Enter your information to get started",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = fullName,
            onValueChange = { fullName = it },
            label = { Text("Full Name") },
            placeholder = { Text("John Doe") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            placeholder = { Text("student@university.edu") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            placeholder = { Text("********") },
            visualTransformation = PasswordVisualTransformation(),
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // --- Register as (Student/Landlord) Radio Buttons ---
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(text = "Register as", style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Medium)
            Row(verticalAlignment = Alignment.CenterVertically) {
                RadioButton(
                    selected = selectedRole == "Student",
                    onClick = { selectedRole = "Student" }
                )
                Text(text = "Student", style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.width(16.dp))
                RadioButton(
                    selected = selectedRole == "Landlord",
                    onClick = { selectedRole = "Landlord" }
                )
                Text(text = "Landlord", style = MaterialTheme.typography.bodyMedium)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                //
                // --- THIS IS THE LOGIC YOU MUST ADD ---
                //
                // 1. You would call your ViewModel to create the user
                //    in Firebase Auth (or another service).
                //
                //    authViewModel.registerUser(email, password) { userId ->
                //
                // 2. After getting the new user's ID (userId),
                //    you save their role and name to your database
                //    (like Firestore). THIS IS THE IMPORTANT PART.
                //
                //    authViewModel.saveUserData(userId, fullName, selectedRole)
                //
                // 3. After all that is successful, *then* you navigate.
                //
                // ----------------------------------------------------

                // For now, it just navigates back to login
                navController.navigate("login")
            },
            modifier = Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(vertical = 12.dp)
        ) {
            Text("Create Account")
        }
    }
}