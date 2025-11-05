package com.example.boardinghousefinder.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.boardinghousefinder.R

@Composable
fun AuthScreenContainer(
    navController: NavController,
    isLogin: Boolean, // true for Login, false for Register
    content: @Composable () -> Unit // The specific content for Login/Register
) {

    val backgroundColor = Color(0xFFF0F2F5)
    val primaryBlue = Color(0xFF0000FF)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(backgroundColor)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // --- Logo and Slogan ---

        Image(
            imageVector = Icons.Default.Home,
            contentDescription = "BoardingHouseFinder Logo",
            modifier = Modifier.size(72.dp)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "BoardingHouseFinder",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = Color.DarkGray
        )
        Text(
            text = "Find your perfect student accommodation",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 32.dp)
        )

        Spacer(modifier = Modifier.height(32.dp))

        // --- Login / Register Segmented Control ---
        Row(
            modifier = Modifier
                .fillMaxWidth(0.8f)
                .clip(RoundedCornerShape(12.dp))
                .background(Color.LightGray.copy(alpha = 0.3f))
                .border(1.dp, Color.LightGray, RoundedCornerShape(12.dp)),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = {
                    if (!isLogin) navController.navigate("login")
                },
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isLogin) primaryBlue else Color.Transparent, // Active tab blue
                    contentColor = if (isLogin) Color.White else Color.DarkGray // Text color
                ),
                shape = RoundedCornerShape(10.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = if (isLogin) 4.dp else 0.dp)
            ) {
                Text("Login", fontWeight = FontWeight.Bold)
            }
            Button(
                onClick = {
                    if (isLogin) navController.navigate("register")
                },
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (!isLogin) primaryBlue else Color.Transparent,
                    contentColor = if (!isLogin) Color.White else Color.DarkGray
                ),
                shape = RoundedCornerShape(10.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = if (!isLogin) 4.dp else 0.dp)
            ) {
                Text("Register", fontWeight = FontWeight.Bold)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // --- Login/Register Form Card ---
        Card(
            modifier = Modifier
                .fillMaxWidth(0.9f), // Card takes 90% width
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.Start,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                content() // This is where the specific Login or Register content goes
            }
        }
    }
}