import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

// Define icon components as functions that return JSX elements
function HomeIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Ionicons
      name={focused ? 'home' : 'home-outline'}
      size={24}
      color={color}
    />
  );
}

function ScanIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Ionicons
      name={focused ? 'scan-circle' : 'scan-circle-outline'}
      size={24}
      color={color}
    />
  );
}

function LibraryIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Ionicons
      name={focused ? 'library' : 'library-outline'}
      size={24}
      color={color}
    />
  );
}

function RecipesIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Ionicons
      name={focused ? 'restaurant' : 'restaurant-outline'}
      size={24}
      color={color}
    />
  );
}

function NutritionIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Ionicons
      name={focused ? 'nutrition' : 'nutrition-outline'}
      size={24}
      color={color}
    />
  );
}

function ProfileIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Ionicons
      name={focused ? 'person-circle' : 'person-circle-outline'}
      size={24}
      color={color}
    />
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ScanIcon,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: LibraryIcon,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: RecipesIcon,
        }}
      />
      <Tabs.Screen
        name="nutrition-facts"
        options={{
          title: 'Nutrition',
          tabBarIcon: NutritionIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
