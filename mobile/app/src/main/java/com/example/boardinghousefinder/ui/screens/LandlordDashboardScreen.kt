package com.example.boardinghousefinder.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape

// --- Using wildcard imports to force IDE to load all functions ---
import androidx.compose.material.icons.*
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
// -----------------------------------------------------------------

import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController

// --- Define your colors here or in Theme.kt ---
val BluePrimary = Color(0xFF1A73E8)
val BlueLight = Color(0xFFE8F0FE)
val TextDark = Color(0xFF202124)
val TextGray = Color(0xFF5F6368)
val CardBackground = Color.White
val DividerColor = Color(0xFFE0E0E0)
val IconGray = Color(0xFF70757A)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LandlordDashboardScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "BoardingHouseFinder Logo",
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "BoardingHouseFinder",
                            color = MaterialTheme.colorScheme.onPrimary,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                actions = {
                    // Profile/User icon
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Color.LightGray)
                            .wrapContentSize(Alignment.Center)
                    ) {
                        Text(
                            "L", // Placeholder for user initial
                            color = TextDark,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                    }
                    Spacer(Modifier.width(16.dp))
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = BluePrimary,
                    titleContentColor = Color.White,
                    actionIconContentColor = Color.White
                )
            )
        },
        containerColor = BlueLight // Overall light blue background for the screen
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                DashboardHeader()
            }
            item {
                DashboardTabs()
            }
            item {
                OverviewSection()
            }
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    RecentInquiriesSection(modifier = Modifier.weight(1f))
                    PerformanceOverviewSection(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
fun DashboardHeader() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "Landlord Dashboard",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = TextDark
            )
            Text(
                text = "Manage your properties and track performance",
                style = MaterialTheme.typography.bodyMedium,
                color = TextGray
            )
        }
        Button(
            onClick = { /* Handle Create New Listing */ },
            colors = ButtonDefaults.buttonColors(containerColor = BluePrimary),
            shape = RoundedCornerShape(8.dp),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Icon(Icons.Default.Add, contentDescription = "Create New Listing", tint = Color.White)
            Spacer(Modifier.width(8.dp))
            Text("Create New Listing", color = Color.White)
        }
    }
}

@Composable
fun DashboardTabs() {
    var selectedTabIndex by remember { mutableStateOf(0) }
    val tabs = listOf("Overview", "My Listings", "Inquiries")

    TabRow(
        selectedTabIndex = selectedTabIndex,
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp)),
        containerColor = CardBackground, // Background for the tab row itself
        contentColor = BluePrimary, // Color for selected tab indicator and text

        // --- THE BUGGY INDICATOR CODE BLOCK IS NOW DELETED ---
        // The default M3 indicator will now be used automatically.
        // -------------------------------------------------------
    ) {
        tabs.forEachIndexed { index, title ->
            Tab(
                selected = selectedTabIndex == index,
                onClick = { selectedTabIndex = index },
                text = {
                    Text(
                        title,
                        color = if (selectedTabIndex == index) BluePrimary else TextGray,
                        fontWeight = if (selectedTabIndex == index) FontWeight.SemiBold else FontWeight.Normal
                    )
                }
            )
        }
    }
}

@Composable
fun OverviewSection() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        DashboardMetricCard(
            modifier = Modifier.weight(1f),
            title = "Total Listings",
            value = "3",
            subText = "2 active properties",
            icon = Icons.Default.Home,
            iconTint = BluePrimary,
            iconBackground = BlueLight
        )
        DashboardMetricCard(
            modifier = Modifier.weight(1f),
            title = "Total Inquiries",
            value = "24",
            subText = "1 new message",
            icon = Icons.Filled.ChatBubble,
            iconTint = Color(0xFF9C27B0), // Purple for inquiries
            iconBackground = Color(0xFFF3E5F5)
        )
        DashboardMetricCard(
            modifier = Modifier.weight(1f),
            title = "Average Rating",
            value = "4.7",
            subText = "Based on 136 reviews",
            icon = Icons.Filled.Star,
            iconTint = Color(0xFFFFC107), // Amber for rating
            iconBackground = Color(0xFFFFF8E1)
        )
    }
}

@Composable
fun DashboardMetricCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    subText: String,
    icon: ImageVector,
    iconTint: Color,
    iconBackground: Color
) {
    Card(
        modifier = modifier.height(140.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleSmall,
                    color = TextGray
                )
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(iconBackground),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = iconTint,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
            Text(
                text = value,
                style = MaterialTheme. typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = TextDark
            )
            Text(
                text = subText,
                style = MaterialTheme.typography.bodySmall,
                color = TextGray
            )
        }
    }
}

@Composable
fun RecentInquiriesSection(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxHeight(), // Allow this card to fill height
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Recent Inquiries",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = TextDark,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            Text(
                text = "Latest messages from potential tenants",
                style = MaterialTheme.typography.bodySmall,
                color = TextGray,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Inquiry items
            InquiryItem("John Doe", "Cozy Student Room", "Hi, is this still available?", "2 hours ago", "New", BluePrimary, BlueLight)
            Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
            InquiryItem("Jane Smith", "Campus View Residence", "Can I schedule a viewing?", "5 hours ago", "Replied", TextGray, DividerColor)
            Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
            InquiryItem("Mike Johnson", "Cozy Student Room", "Looking forward to the viewing!", "1 day ago", "Scheduled", TextGray, DividerColor)
            Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
            InquiryItem("Sarah Williams", "Campus View Residence", "Is WiFi included?", "2 days ago", "Replied", TextGray, DividerColor)

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = { /* View All Messages */ }) {
                Text("View All Messages", color = BluePrimary)
            }
        }
    }
}

@Composable
fun InquiryItem(
    name: String,
    property: String,
    message: String,
    time: String,
    tag: String? = null,
    tagTextColor: Color = TextGray,
    tagBackgroundColor: Color = DividerColor
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(name, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, color = TextDark)
            tag?.let {
                Text(
                    text = it,
                    fontSize = 10.sp,
                    color = tagTextColor,
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(tagBackgroundColor)
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
        }
        Text(property, style = MaterialTheme.typography.bodySmall, color = TextGray)
        Text(message, style = MaterialTheme.typography.bodyMedium, color = TextDark, modifier = Modifier.padding(top = 4.dp))
        Text(time, style = MaterialTheme.typography.bodySmall, color = TextGray, modifier = Modifier.padding(top = 4.dp))
    }
}

@Composable
fun PerformanceOverviewSection(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxHeight(), // Allow this card to fill height
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Performance Overview",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = TextDark,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            Text(
                text = "Your listings performance this month",
                style = MaterialTheme.typography.bodySmall,
                color = TextGray,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            PerformanceMetricItem(Icons.Outlined.Visibility, "Total Views", "342", BluePrimary)
            Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
            PerformanceMetricItem(Icons.Outlined.ChatBubbleOutline, "Inquiries", "24", Color(0xFF9C27B0)) // Purple
            Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
            PerformanceMetricItem(Icons.Outlined.StarBorder, "Avg Rating", "4.7", Color(0xFFFFC107)) // Amber
        }
    }
}

@Composable
fun PerformanceMetricItem(icon: ImageVector, title: String, value: String, iconTint: Color) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconTint,
                modifier = Modifier.size(24.dp)
            )
            Spacer(Modifier.width(12.dp))
            Text(title, style = MaterialTheme.typography.bodyLarge, color = TextDark)
        }
        Text(value, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Bold, color = TextDark)
    }
}