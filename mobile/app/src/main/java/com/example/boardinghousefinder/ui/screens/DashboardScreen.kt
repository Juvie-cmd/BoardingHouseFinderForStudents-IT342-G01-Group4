package com.example.boardinghousefinder.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
// Note: You might need to add this dependency for coil (image loading) later
// import coil.compose.AsyncImage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    var menuExpanded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("BoardingFinder") },
                actions = {
                    // --- Profile & Logout Menu ---
                    IconButton(onClick = { menuExpanded = true }) {
                        Icon(Icons.Default.MoreVert, contentDescription = "Menu")
                    }
                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Profile") },
                            onClick = {
                                menuExpanded = false
                                navController.navigate("profile")
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Logout") },
                            onClick = {
                                menuExpanded = false
                                // Add any other logout logic here
                                navController.navigate("login") {
                                    // Clear the back stack
                                    popUpTo(navController.graph.startDestinationId) { inclusive = true }
                                }
                            }
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { paddingValues ->
        // --- Scrollable Body Content ---
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background),
            contentPadding = PaddingValues(vertical = 24.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {

            // Section 1: Title and Search
            item {
                SearchSection()
            }

            // Section 2: "Why Choose" features
            item {
                WhyChooseSection()
            }

            // Section 3: "Featured Boarding Houses"
            item {
                FeaturedHousesSection()
            }

            // Section 4: "How It Works"
            item {
                HowItWorksSection()
            }
        }
    }
}

// --- 1. Search Section ---
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.primary)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = "Find Your Perfect Student Housing",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onPrimary,
            textAlign = TextAlign.Center
        )
        Text(
            text = "Discover comfortable, affordable boarding houses.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onPrimary,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Search Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface // <-- Uses theme color
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    label = { Text("Location") },
                    leadingIcon = { Icon(Icons.Default.LocationOn, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    label = { Text("Budget") },
                    leadingIcon = { Icon(Icons.Default.ShoppingCart, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth()
                )
                // This would be a DropdownMenu in a real app
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    label = { Text("Hostel Type") },
                    leadingIcon = { Icon(Icons.Default.Home, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = { /* Handle search */ },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Search")
                }
            }
        }
    }
}

// --- 2. Why Choose Section ---
@Composable
fun WhyChooseSection() {
    Column(
        modifier = Modifier.padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Why Choose Boarding House Finder?",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth()
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            FeatureItem(
                icon = Icons.Default.CheckCircle,
                text = "Verified Properties"
            )

            // ---------------------------------
            FeatureItem(
                icon = Icons.Default.Place,
                text = "Near Universities"
            )
        }
    }
}

@Composable
fun FeatureItem(icon: ImageVector, text: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.width(100.dp) // Give items a fixed width
    ) {
        Icon(
            imageVector = icon,
            contentDescription = text,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(40.dp)
        )
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            textAlign = TextAlign.Center
        )
    }
}

// --- 3. Featured Houses Section ---
@Composable
fun FeaturedHousesSection() {
    Column(
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Featured Boarding Houses",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(horizontal = 16.dp)
        ) {
            // Hardcoded items for design
            item {
                BoardingHouseCard(
                    title = "Cozy Student Room",
                    distance = "0.5km from campus",
                    price = "250",
                    rating = "4.8 (32)"
                )
            }
            item {
                BoardingHouseCard(
                    title = "Modern Shared Apartment",
                    distance = "1.2km from campus",
                    price = "325",
                    rating = "4.9 (18)"
                )
            }
            item {
                BoardingHouseCard(
                    title = "Comfortable Private Room",
                    distance = "0.8km from campus",
                    price = "288",
                    rating = "4.7 (55)"
                )
            }
        }
    }
}

@Composable
fun BoardingHouseCard(
    title: String,
    distance: String,
    price: String,
    rating: String
) {
    Card(
        modifier = Modifier.width(300.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface // <-- Uses theme color
        )
    ) {
        Column {
            // Image Placeholder -
            // In a real app, you'd use AsyncImage(model = imageUrl, ...)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
                    .background(Color.Gray) // Placeholder color
            ) {
                // You can add your "New" tag here
                Text(
                    text = "New",
                    color = Color.White,
                    modifier = Modifier
                        .padding(8.dp)
                        .background(Color(0xFF4CAF50), RoundedCornerShape(4.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp),
                    fontSize = 12.sp
                )
                Icon(
                    imageVector = Icons.Default.FavoriteBorder,
                    contentDescription = "Favorite",
                    tint = Color.White,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                )
            }

            // Content
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = distance,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant // <-- Uses theme color
                )

                // Amenities Row (simplified)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("• Single Room", fontSize = 12.sp)
                    Text("• WiFi", fontSize = 12.sp)
                    Text("★ $rating", fontSize = 12.sp)
                }

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "$$price",
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Text(
                        "/Month",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant // <-- Uses theme color
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Button(onClick = { /* Handle details click */ }) {
                        Text("View Details")
                    }
                }
            }
        }
    }
}

// --- 4. How It Works Section ---
@Composable
fun HowItWorksSection() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "How It Works",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )
        StepItem(number = "1", title = "Search & Filter", description = "Find properties that match your budget and location.")
        StepItem(number = "2", title = "Visit & Compare", "Schedule visits and compare amenities.")
        StepItem(number = "3", title = "Book & Move In", "Book your perfect room and move in.")
    }
}

@Composable
fun StepItem(number: String, title: String, description: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = number,
                color = MaterialTheme.colorScheme.onPrimary,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        }
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(text = title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant // <-- Uses theme color
            )
        }
    }
}