package com.example.boardinghousefinder.ui.features.student

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Bed
import androidx.compose.material.icons.outlined.Wifi
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

// --- 1. DATA MODEL ---
data class Listing(
    val id: Int,
    val title: String,
    val location: String,
    val distance: String,
    val price: Double,
    val rating: Double,
    val reviews: Int,
    val roomType: String,
    val hasWifi: Boolean = true
)

val sampleListings = listOf(
    Listing(1, "Cozy Student Room", "Labangon, Cebu", "0.5km", 4500.0, 4.8, 32, "Single"),
    Listing(2, "Modern Shared Apt", "Urgello, Cebu", "1.2km", 6500.0, 4.9, 18, "Shared"),
    Listing(3, "Budget Friendly Stay", "Talamban, Cebu", "2.0km", 2500.0, 4.2, 55, "Bedspace"),
    Listing(4, "Premium Condo", "Lahug, Cebu", "0.2km", 12000.0, 5.0, 10, "Studio")
)

// --- 2. MAIN SCREEN ---
@OptIn(ExperimentalMaterial3Api::class) // Required for TopAppBar
@Composable
fun DashboardScreen(navController: NavController) {
    // State for Search
    var locationQuery by remember { mutableStateOf("") }
    var budgetQuery by remember { mutableStateOf("") }
    var isSearchTriggered by remember { mutableStateOf(false) }

    // State for Profile Menu
    var menuExpanded by remember { mutableStateOf(false) }

    // Filter Logic
    val displayedListings = remember(locationQuery, budgetQuery, isSearchTriggered) {
        if (!isSearchTriggered) {
            sampleListings
        } else {
            sampleListings.filter { listing ->
                (listing.location.contains(locationQuery, ignoreCase = true) ||
                        listing.title.contains(locationQuery, ignoreCase = true)) &&
                        when (budgetQuery) {
                            "Low" -> listing.price < 5000
                            "Mid" -> listing.price in 5000.0..10000.0
                            "High" -> listing.price > 10000
                            else -> true
                        }
            }
        }
    }

    Scaffold(
        // --- NEW: TOP BAR WITH PROFILE ICON ---
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "BoardingHouseFinder",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary
                ),
                actions = {
                    // Profile Icon Button
                    IconButton(onClick = { menuExpanded = true }) {
                        Icon(
                            imageVector = Icons.Default.AccountCircle,
                            contentDescription = "Profile",
                            tint = Color.White,
                            modifier = Modifier.size(30.dp)
                        )
                    }
                    // The Menu that pops up
                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Profile") },
                            onClick = {
                                menuExpanded = false
                                navController.navigate("profile")
                            },
                            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) }
                        )
                        DropdownMenuItem(
                            text = { Text("Logout") },
                            onClick = {
                                menuExpanded = false
                                navController.navigate("login") {
                                    popUpTo("login") { inclusive = true }
                                }
                            },
                            leadingIcon = { Icon(Icons.Default.ExitToApp, contentDescription = null) }
                        )
                    }
                }
            )
        },
        bottomBar = {
            // Bottom bar can go here later
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF5F5F5)),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            // --- HERO SECTION ---
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.primary)
                        .padding(bottom = 40.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Find Your Perfect Student Housing",
                            style = MaterialTheme.typography.headlineMedium,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Discover comfortable, affordable boarding houses near your university.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color.White.copy(alpha = 0.9f)
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
            }

            // --- SEARCH CARD ---
            item {
                SearchCard(
                    location = locationQuery,
                    onLocationChange = { locationQuery = it },
                    budget = budgetQuery,
                    onBudgetChange = { budgetQuery = it },
                    onSearch = { isSearchTriggered = true },
                    onClear = {
                        locationQuery = ""
                        budgetQuery = ""
                        isSearchTriggered = false
                    },
                    isFiltered = isSearchTriggered
                )
            }

            // --- RESULTS HEADER ---
            item {
                Padding(horizontal = 24.dp, vertical = 16.dp) {
                    Text(
                        text = if (isSearchTriggered) "Search Results (${displayedListings.size})" else "Featured Boarding Houses",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                }
            }

            // --- LISTINGS ---
            if (displayedListings.isEmpty()) {
                item {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("No properties found", fontWeight = FontWeight.Bold)
                        Text("Try adjusting your search", color = Color.Gray)
                    }
                }
            } else {
                items(displayedListings) { listing ->
                    ListingCard(listing = listing) {
                        navController.navigate("searchResults")
                    }
                }
            }
        }
    }
}

// --- 3. COMPOSABLES (UI Parts) ---

@Composable
fun SearchCard(
    location: String,
    onLocationChange: (String) -> Unit,
    budget: String,
    onBudgetChange: (String) -> Unit,
    onSearch: () -> Unit,
    onClear: () -> Unit,
    isFiltered: Boolean
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .offset(y = (-30).dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Location Input
            OutlinedTextField(
                value = location,
                onValueChange = onLocationChange,
                label = { Text("Location") },
                placeholder = { Text("Enter address or area") },
                leadingIcon = { Icon(Icons.Default.LocationOn, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp)
            )

            // Budget Filters
            Text("Budget", style = MaterialTheme.typography.labelLarge)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(
                    selected = budget == "Low",
                    onClick = { onBudgetChange(if (budget == "Low") "" else "Low") },
                    label = { Text("< 5k") }
                )
                FilterChip(
                    selected = budget == "Mid",
                    onClick = { onBudgetChange(if (budget == "Mid") "" else "Mid") },
                    label = { Text("5k-10k") }
                )
                FilterChip(
                    selected = budget == "High",
                    onClick = { onBudgetChange(if (budget == "High") "" else "High") },
                    label = { Text("> 10k") }
                )
            }

            // Action Buttons
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (isFiltered) {
                    OutlinedButton(
                        onClick = onClear,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Clear")
                    }
                }
                Button(
                    onClick = onSearch,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Search")
                }
            }
        }
    }
}

@Composable
fun ListingCard(listing: Listing, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            // Image Placeholder
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .background(Color.LightGray)
            ) {
                Text(
                    text = "Featured",
                    color = Color.White,
                    fontSize = 12.sp,
                    modifier = Modifier
                        .padding(12.dp)
                        .background(Color(0xFF4CAF50), RoundedCornerShape(16.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                )
                Icon(
                    imageVector = Icons.Default.FavoriteBorder,
                    contentDescription = "Favorite",
                    tint = Color.White,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(12.dp)
                )
            }

            // Content
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = listing.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color.Gray)
                    Text(listing.location, color = Color.Gray, fontSize = 14.sp)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Home, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color.Gray)
                    Text("${listing.distance} from campus", color = Color.Gray, fontSize = 14.sp)
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    AmenityItem(Icons.Outlined.Bed, listing.roomType)
                    if (listing.hasWifi) AmenityItem(Icons.Outlined.Wifi, "WiFi")
                    AmenityItem(Icons.Default.Star, "${listing.rating} (${listing.reviews})", Color(0xFFFFD700))
                }

                Divider(modifier = Modifier.padding(vertical = 12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "₱${listing.price}",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text("/month", fontSize = 12.sp, color = Color.Gray)
                    }
                    Button(onClick = onClick, shape = RoundedCornerShape(8.dp)) {
                        Text("View Details")
                    }
                }
            }
        }
    }
}

@Composable
fun AmenityItem(icon: ImageVector, text: String, tint: Color = Color.Gray) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, contentDescription = null, modifier = Modifier.size(16.dp), tint = tint)
        Spacer(modifier = Modifier.width(4.dp))
        Text(text, fontSize = 12.sp, color = Color.Gray)
    }
}

@Composable
fun Padding(horizontal: androidx.compose.ui.unit.Dp, vertical: androidx.compose.ui.unit.Dp, content: @Composable () -> Unit) {
    Box(modifier = Modifier.padding(horizontal = horizontal, vertical = vertical)) { content() }
}