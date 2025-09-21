import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  Activity, 
  Bell, 
  Users, 
  User, 
  LogOut, 
  Settings,
  Globe,
  Plus,
  Home
} from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';
import { useAuth } from '@/contexts/AuthContext';
import { HealthScoreCard } from '@/components/HealthScoreCard';
import { HealthTipCard } from '@/components/HealthTipCard';
import { QuickActionButton } from '@/components/QuickActionButton';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Redirect health workers to their dashboard
  useEffect(() => {
    if (userProfile?.role === 'health_worker') {
      router.replace('/health-worker-dashboard');
    }
  }, [userProfile, router]);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setShowLanguageSelector(false);
  };

  // Calculate health score based on real data
  const calculateHealthScore = () => {
    // This would calculate based on actual vitals data
    // For now, return a base score that can be updated with real data
    return 75; // This should be calculated from actual vitals data
  };

  const handleLogout = async () => {
    console.log('Home logout button pressed');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            console.log('Home logout confirmed');
            try {
              await signOut();
              console.log('Home logout successful, redirecting to main page');
              router.replace('/');
            } catch (error) {
              console.error('Home logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const quickActions = [
    {
      title: 'Log Vitals',
      subtitle: 'Record your health metrics',
      icon: Activity,
      color: colors.primary[500],
      onPress: () => router.push('/(tabs)/vitals'),
    },
    {
      title: 'Set Reminder',
      subtitle: 'Schedule medication & appointments',
      icon: Bell,
      color: colors.accent.orange,
      onPress: () => router.push('/(tabs)/reminders'),
    },
    {
      title: 'Health Workers',
      subtitle: 'Connect with healthcare providers',
      icon: Users,
      color: colors.accent.teal,
      onPress: () => router.push('/(tabs)/health-workers'),
    },
    {
      title: 'Profile',
      subtitle: 'Manage your account',
      icon: User,
      color: colors.accent.purple,
      onPress: () => router.push('/(tabs)/profile'),
    },
  ];

  const healthTips = [
    {
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily',
      category: 'General Health',
    },
    {
      title: 'Regular Exercise',
      description: '30 minutes of moderate exercise daily',
      category: 'Fitness',
    },
    {
      title: 'Balanced Diet',
      description: 'Include fruits, vegetables, and whole grains',
      category: 'Nutrition',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={gradients.primary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                {t('home.welcome')}, {userProfile?.name || 'User'}!
              </Text>
              <Text style={styles.subtitle}>
                {t('home.subtitle')}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowLanguageSelector(!showLanguageSelector)}
              >
                <Globe size={20} color={colors.background.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleLogout}
              >
                <LogOut size={20} color={colors.background.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {showLanguageSelector && (
            <View style={styles.languageSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageOption,
                      i18n.language === lang.code && styles.languageOptionSelected
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text style={[
                      styles.languageOptionText,
                      i18n.language === lang.code && styles.languageOptionTextSelected
                    ]}>
                      {lang.native}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </LinearGradient>

        {/* Health Score Card */}
        <View style={styles.section}>
          <HealthScoreCard 
            score={calculateHealthScore()}
            trend="up"
            lastUpdated="2 hours ago"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={index}
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                color={action.color}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Health Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.healthTips')}</Text>
          {healthTips.map((tip, index) => (
            <HealthTipCard
              key={index}
              title={tip.title}
              description={tip.description}
              category={tip.category}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Activity size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Blood Sugar Logged</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Bell size={20} color={colors.accent.orange} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Medication Reminder</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Tab Navigation */}
        <View style={styles.bottomTabs}>
          <TouchableOpacity 
            style={[styles.tabButton, styles.activeTab]}
            onPress={() => router.push('/home')}
          >
            <Home size={24} color={colors.primary[500]} />
            <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => router.push('/(tabs)/vitals')}
          >
            <Activity size={24} color={colors.neutral[600]} />
            <Text style={styles.tabText}>Vitals</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => router.push('/(tabs)/reminders')}
          >
            <Bell size={24} color={colors.neutral[600]} />
            <Text style={styles.tabText}>Reminders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => router.push('/(tabs)/health-workers')}
          >
            <Users size={24} color={colors.neutral[600]} />
            <Text style={styles.tabText}>Workers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <User size={24} color={colors.neutral[600]} />
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.background.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.background.primary,
    opacity: 0.9,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageSelector: {
    marginTop: 16,
    paddingVertical: 8,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  languageOptionText: {
    fontSize: 14,
    color: colors.background.primary,
  },
  languageOptionTextSelected: {
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: colors.primary[50],
    borderRadius: 8,
  },
  tabText: {
    fontSize: 12,
    color: colors.neutral[600],
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary[700],
    fontWeight: '600',
  },
});
