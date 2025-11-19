package com.example.boardinghousefinder.ui.features.auth

// import androidx.compose.foundation.Image // Commented out
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
// import androidx.compose.ui.res.painterResource // Commented out
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
// import com.example.boardinghousefinder.R // Commented out

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(navController: NavController) {
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var selectedRole by remember { mutableStateOf("Student") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        // --- 1. Illustration (Commented out) ---
        // To add your image, paste it into your "res/drawable" folder
        // and uncomment the Image() composable below (and its imports above).
        /*
        Image(
            painter = painterResource(id = R.drawable.register_illustration),
            contentDescription = "Register Illustration",
            modifier = Modifier
                .fillMaxWidth(0.7f)
                .padding(bottom = 16.dp)
        )
        */
        // Added a spacer to fill the gap from the missing image
        Spacer(modifier = Modifier.height(32.dp))

        // --- 2. Title ---
        Text(
            text = "Sign Up",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        // --- 3. Subtitle ---
        Text(
            text = "Please fill in the details to create an account.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // --- 4. Full Name Field ---
        OutlinedTextField(
            value = fullName,
            onValueChange = { fullName = it },
            label = { Text("Full Name") },
            leadingIcon = { Icon(Icons.Default.Person, contentDescription = "Full Name") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // --- 5. Email Field ---
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            leadingIcon = { Icon(Icons.Default.Email, contentDescription = "Email") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // --- 6. Password Field ---
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = "Password") },
            visualTransformation = PasswordVisualTransformation(),
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(24.dp))

        // --- 7. Register as (Student/Landlord) Radio Buttons ---
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Register as",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium
            )
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

        // --- 8. Sign Up Button ---
        Button(
            onClick = {
                // --- YOUR REGISTRATION LOGIC ---
                navController.navigate("login") {
                    popUpTo(navController.graph.startDestinationId) { inclusive = true }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Sign Up", style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(16.dp))

        // --- 9. Login Link ---
        TextButton(onClick = { navController.navigate("login") }) {
            Text("Already have an account? Login")
        }
    }
}