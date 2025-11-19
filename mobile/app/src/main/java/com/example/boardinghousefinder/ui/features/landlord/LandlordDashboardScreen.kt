package com.example.boardinghousefinder.ui.features.landlord

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
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

// Import your custom colors
import com.example.boardinghousefinder.ui.theme.BluePrimary

// Local colors
val BlueLight = Color(0xFFE8F0FE)
val TextDark = Color(0xFF202124)
val TextGray = Color(0xFF5F6368)
val CardBackground = Color.White
val DividerColor = Color(0xFFE0E0E0)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LandlordDashboardScreen(navController: NavController) {
    // --- STATE MANAGEMENT ---
    // 1. Controls which tab is active (0=Overview, 1=Listings, 2=Inquiries)
    var selectedTabIndex by remember { mutableIntStateOf(0) }

    // 2. Controls the Profile Dropdown Menu
    var menuExpanded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Logo",
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Landlord Portal",
                            color = Color.White,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                actions = {
                    // --- PROFILE MENU ---
                    Box {
                        IconButton(onClick = { menuExpanded = true }) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(Color.White.copy(alpha = 0.2f))
                                    .wrapContentSize(Alignment.Center)
                            ) {
                                Text("L", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }

                        DropdownMenu(
                            expanded = menuExpanded,
                            onDismissRequest = { menuExpanded = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("Edit Profile") },
                                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                                onClick = {
                                    menuExpanded = false
                                    navController.navigate("editProfile") // Assuming this route exists
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Logout") },
                                leadingIcon = { Icon(Icons.Default.ExitToApp, contentDescription = null) },
                                onClick = {
                                    menuExpanded = false
                                    // Clear back stack and go to login
                                    navController.navigate("login") {
                                        popUpTo("login") { inclusive = true }
                                    }
                                }
                            )
                        }
                    }
                    Spacer(Modifier.width(16.dp))
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = BluePrimary
                )
            )
        },
        floatingActionButton = {
            // Only show FAB on Overview or Listings tab
            if (selectedTabIndex != 2) {
                FloatingActionButton(
                    onClick = { /* Handle Create New Listing */ },
                    containerColor = BluePrimary,
                    contentColor = Color.White,
                    shape = CircleShape
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Create New Listing")
                }
            }
        },
        containerColor = BlueLight
    ) { paddingValues ->

        // --- MAIN CONTENT SCROLLABLE AREA ---
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Header
            item {
                Column {
                    Text(
                        text = "Dashboard",
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
            }

            // 2. Tabs Row (Passes state to the composable)
            item {
                DashboardTabs(
                    selectedIndex = selectedTabIndex,
                    onTabSelected = { index -> selectedTabIndex = index }
                )
            }

            // 3. Switch Content based on selected Tab
            when (selectedTabIndex) {
                0 -> { // OVERVIEW TAB
                    item { OverviewSection() }
                    item { RecentInquiriesSection(navController) }
                    item { PerformanceOverviewSection() }
                }
                1 -> { // MY LISTINGS TAB
                    items(3) { i ->
                        LandlordListingItem(index = i)
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
                2 -> { // INQUIRIES TAB
                    item {
                        // Show a fuller list of inquiries
                        InquiryItem("John Doe", "Cozy Student Room", "Hi, is this still available?", "2h ago", "New", BluePrimary, BlueLight)
                        Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
                        InquiryItem("Jane Smith", "Campus View", "Can I schedule a viewing?", "5h ago", "Replied", TextGray, DividerColor)
                        Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
                        InquiryItem("Mike Johnson", "Cozy Student Room", "Looking forward to it!", "1d ago", "Done", TextGray, DividerColor)
                        Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
                        InquiryItem("Sarah Lee", "Modern Apt", "Is the price negotiable?", "2d ago", "Pending", Color(0xFFFF9800), Color(0xFFFFF3E0))
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(60.dp))
            }
        }
    }
}

// --- COMPONENTS ---

@Composable
fun DashboardTabs(selectedIndex: Int, onTabSelected: (Int) -> Unit) {
    val tabs = listOf("Overview", "My Listings", "Inquiries")

    TabRow(
        selectedTabIndex = selectedIndex,
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp)),
        containerColor = CardBackground,
        contentColor = BluePrimary
    ) {
        tabs.forEachIndexed { index, title ->
            Tab(
                selected = selectedIndex == index,
                onClick = { onTabSelected(index) },
                text = {
                    Text(
                        title,
                        color = if (selectedIndex == index) BluePrimary else TextGray,
                        fontWeight = if (selectedIndex == index) FontWeight.SemiBold else FontWeight.Normal
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
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        DashboardMetricCard(
            modifier = Modifier.weight(1f),
            title = "Listings",
            value = "3",
            subText = "2 Active",
            icon = Icons.Default.Home,
            iconTint = BluePrimary,
            iconBackground = BlueLight
        )
        DashboardMetricCard(
            modifier = Modifier.weight(1f),
            title = "Inquiries",
            value = "24",
            subText = "1 New",
            icon = Icons.Filled.ChatBubble,
            iconTint = Color(0xFF9C27B0),
            iconBackground = Color(0xFFF3E5F5)
        )
        DashboardMetricCard(
            modifier = Modifier.weight(1f),
            title = "Rating",
            value = "4.7",
            subText = "136 Rev.",
            icon = Icons.Filled.Star,
            iconTint = Color(0xFFFFC107),
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
        modifier = modifier.height(130.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Box(
                    modifier = Modifier.size(32.dp).clip(CircleShape).background(iconBackground),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(18.dp))
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = title, style = MaterialTheme.typography.labelMedium, color = TextGray, maxLines = 1)
            }
            Column {
                Text(text = value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = TextDark)
                Text(text = subText, style = MaterialTheme.typography.labelSmall, color = TextGray, maxLines = 1)
            }
        }
    }
}

@Composable
fun RecentInquiriesSection(navController: NavController) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recent Inquiries",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextDark
                )
                TextButton(onClick = { /* Navigate to Inquiries Tab logic could go here */ }) {
                    Text("View All", fontSize = 12.sp)
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            InquiryItem("John Doe", "Cozy Student Room", "Hi, is this still available?", "2h ago", "New", BluePrimary, BlueLight)
            Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
            InquiryItem("Jane Smith", "Campus View", "Can I schedule a viewing?", "5h ago", "Replied", TextGray, DividerColor)
        }
    }
}

@Composable
fun LandlordListingItem(index: Int) {
    val titles = listOf("Cozy Student Room", "Modern Apartment", "Budget Bedspace")
    val prices = listOf("₱4,500", "₱8,000", "₱2,500")
    val status = listOf("Active", "Active", "Full")

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Placeholder Image
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color.Gray)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(text = titles[index], style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(text = prices[index] + "/month", style = MaterialTheme.typography.bodySmall, color = TextGray)
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Outlined.Visibility, null, modifier = Modifier.size(14.dp), tint = TextGray)
                    Text(" 124 Views", fontSize = 12.sp, color = TextGray)
                }
            }
            // Status Badge
            Text(
                text = status[index],
                color = if (status[index] == "Active") Color(0xFF1B5E20) else Color.Red,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .background(
                        if (status[index] == "Active") Color(0xFFE8F5E9) else Color(0xFFFFEBEE),
                        RoundedCornerShape(4.dp)
                    )
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            )
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
        Text(property, style = MaterialTheme.typography.labelSmall, color = TextGray)
        Text(message, style = MaterialTheme.typography.bodyMedium, color = TextDark, modifier = Modifier.padding(top = 4.dp))
        Text(time, style = MaterialTheme.typography.labelSmall, color = TextGray, modifier = Modifier.padding(top = 4.dp))
    }
}

@Composable
fun PerformanceOverviewSection() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Performance (This Month)",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = TextDark,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            PerformanceMetricItem(Icons.Outlined.Visibility, "Total Views", "342", BluePrimary)
            Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
            PerformanceMetricItem(Icons.Outlined.ChatBubbleOutline, "Inquiries", "24", Color(0xFF9C27B0))
            Divider(color = DividerColor, thickness = 1.dp, modifier = Modifier.padding(vertical = 12.dp))
            PerformanceMetricItem(Icons.Outlined.StarBorder, "Avg Rating", "4.7", Color(0xFFFFC107))
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
            Text(title, style = MaterialTheme.typography.bodyMedium, color = TextDark)
        }
        Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextDark)
    }
}