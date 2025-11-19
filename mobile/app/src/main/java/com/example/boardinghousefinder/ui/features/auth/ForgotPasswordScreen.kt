package com.example.boardinghousefinder.ui.features.auth

// import androidx.compose.foundation.Image // Uncomment when you add an image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
// import androidx.compose.ui.res.painterResource // Uncomment when you add an image
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
// import com.example.boardinghousefinder.R // Uncomment when you add an image

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ForgotPasswordScreen(navController: NavController) {

    // --- State for the email field ---
    var email by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Forgot Password") },
                navigationIcon = {
                    // --- Use a proper icon button ---
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp) // Match login/register padding
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(32.dp))

            // --- 1. Illustration (Commented out) ---
            // To add your image, paste it into "res/drawable"
            // and uncomment the Image() composable below (and its imports above).
            /*
            Image(
                painter = painterResource(id = R.drawable.forgot_password_illustration),
                contentDescription = "Forgot Password Illustration",
                modifier = Modifier
                    .fillMaxWidth(0.7f)
                    .padding(bottom = 16.dp)
            )
            */
            // Added a spacer to fill the gap from the missing image
            Spacer(modifier = Modifier.height(32.dp))


            // --- 2. Subtitle ---
            Text(
                text = "Enter your email and we will send you a link to reset your password.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 32.dp)
            )

            // --- 3. Email Field ---
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                leadingIcon = { Icon(Icons.Default.Email, contentDescription = "Email") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(32.dp))

            // --- 4. Send Reset Link Button ---
            Button(
                onClick = {
                    // TODO: Send reset link logic (e.g., call Firebase)
                    navController.popBackStack() // Go back after sending
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(8.dp) // Match login button shape
            ) {
                Text(
                    "Send Reset Link",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}