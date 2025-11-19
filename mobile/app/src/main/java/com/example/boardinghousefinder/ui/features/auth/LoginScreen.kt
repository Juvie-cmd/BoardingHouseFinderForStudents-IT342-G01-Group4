package com.example.boardinghousefinder.ui.features.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@Composable
fun LoginScreen(navController: NavController) {
    // This controls which tab is visible (Login or Register)
    var activeTab by remember { mutableStateOf("login") }

    // 1. Background Container
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5)) // Light gray background
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.verticalScroll(rememberScrollState())
        ) {
            // 2. Logo and Title
            Icon(
                imageVector = Icons.Default.Home,
                contentDescription = "Logo",
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(40.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "BoardingHouseFinder",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Text(
                text = "Find your perfect student accommodation",
                fontSize = 14.sp,
                color = Color.Gray,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            // 3. The Main White Card
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {

                    // 4. Tabs (Login vs Register Switcher)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 24.dp)
                            .background(Color(0xFFF0F0F0), RoundedCornerShape(8.dp))
                            .padding(4.dp)
                    ) {
                        TabButton(
                            text = "Login",
                            isActive = activeTab == "login",
                            modifier = Modifier.weight(1f)
                        ) { activeTab = "login" }

                        TabButton(
                            text = "Register",
                            isActive = activeTab == "register",
                            modifier = Modifier.weight(1f)
                        ) { activeTab = "register" }
                    }

                    // 5. Switch Content based on Tab
                    if (activeTab == "login") {
                        LoginForm(navController)
                    } else {
                        RegisterForm(navController)
                    }
                }
            }
        }
    }
}

// --- COMPONENT: LOGIN FORM ---
@Composable
fun LoginForm(navController: NavController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column {
        Text("Welcome back", fontWeight = FontWeight.Bold, fontSize = 20.sp)
        Text(
            "Enter your credentials to access your account",
            color = Color.Gray,
            fontSize = 14.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Google Button Placeholder
        OutlinedButton(
            onClick = { /* TODO: Google Login */ },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Continue with Google")
        }

        OrDivider()

        // Inputs
        CustomTextField(value = email, onValueChange = { email = it }, label = "Email", icon = Icons.Default.Email)
        Spacer(modifier = Modifier.height(16.dp))
        CustomTextField(value = password, onValueChange = { password = it }, label = "Password", icon = Icons.Default.Lock, isPassword = true)

        Spacer(modifier = Modifier.height(8.dp))

        // Forgot Password Link
        TextButton(
            onClick = { navController.navigate("forgotPassword") },
            modifier = Modifier.align(Alignment.End)
        ) {
            Text("Forgot?")
        }

        Spacer(modifier = Modifier.height(16.dp))

        // --- THE LOGIN BUTTON WITH "MAGIC TRICK" LOGIC ---
        Button(
            onClick = {
                // Check if email is landlord or student
                if (email.lowercase().contains("landlord")) {
                    navController.navigate("landlordDashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                } else {
                    navController.navigate("dashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            },
            modifier = Modifier.fillMaxWidth().height(48.dp),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Login", fontWeight = FontWeight.Bold)
        }
    }
}

// --- COMPONENT: REGISTER FORM ---
@Composable
fun RegisterForm(navController: NavController) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var role by remember { mutableStateOf("student") } // 'student' or 'landlord'

    Column {
        Text("Create an account", fontWeight = FontWeight.Bold, fontSize = 20.sp)
        Text("Enter your information to get started", color = Color.Gray, fontSize = 14.sp, modifier = Modifier.padding(bottom = 16.dp))

        OutlinedButton(
            onClick = { /* TODO: Google Sign Up */ },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Sign up with Google")
        }

        OrDivider()

        CustomTextField(value = name, onValueChange = { name = it }, label = "Full Name", icon = Icons.Default.Person)
        Spacer(modifier = Modifier.height(12.dp))
        CustomTextField(value = email, onValueChange = { email = it }, label = "Email", icon = Icons.Default.Email)
        Spacer(modifier = Modifier.height(12.dp))
        CustomTextField(value = password, onValueChange = { password = it }, label = "Password", icon = Icons.Default.Lock, isPassword = true)

        // Role Selection
        Text("Register as", fontWeight = FontWeight.Medium, modifier = Modifier.padding(top = 16.dp, bottom = 8.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            RadioButton(selected = role == "student", onClick = { role = "student" })
            Text("Student", modifier = Modifier.clickable { role = "student" })

            Spacer(modifier = Modifier.width(16.dp))

            RadioButton(selected = role == "landlord", onClick = { role = "landlord" })
            Text("Landlord", modifier = Modifier.clickable { role = "landlord" })
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                // For now, just go to dashboard (or add register logic later)
                navController.navigate("dashboard")
            },
            modifier = Modifier.fillMaxWidth().height(48.dp),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Create Account")
        }
    }
}

// --- REUSABLE UI HELPERS ---

@Composable
fun TabButton(text: String, isActive: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    val backgroundColor = if (isActive) Color.White else Color.Transparent
    val textColor = if (isActive) MaterialTheme.colorScheme.primary else Color.Gray
    val shadow = if (isActive) 2.dp else 0.dp

    Surface(
        modifier = modifier
            .clickable { onClick() }
            .height(36.dp),
        shape = RoundedCornerShape(6.dp),
        color = backgroundColor,
        shadowElevation = shadow
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(text = text, color = textColor, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun CustomTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    icon: ImageVector,
    isPassword: Boolean = false
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        leadingIcon = { Icon(icon, contentDescription = null) },
        visualTransformation = if (isPassword) PasswordVisualTransformation() else androidx.compose.ui.text.input.VisualTransformation.None,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp)
    )
}

@Composable
fun OrDivider() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 20.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        HorizontalDivider(modifier = Modifier.weight(1f))
        Text("OR", modifier = Modifier.padding(horizontal = 8.dp), fontSize = 12.sp, color = Color.Gray)
        HorizontalDivider(modifier = Modifier.weight(1f))
    }
}