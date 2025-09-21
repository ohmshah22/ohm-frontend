import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Heart, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit, Globe, Moon } from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature will be available soon.');
  };

  const handleHealthRecords = () => {
    Alert.alert('Health Records', 'Your health records are securely stored and encrypted.');
  };

  const handleNotificationSettings = () => {
    Alert.alert('Notifications', 'Customize your reminder and alert preferences.');
  };

  const handleLanguageChange = () => {
    const languages = ['English', 'हिंदी', 'বাংলা', 'తెలుగు', 'தமிழ்', 'ગુજરાતી', 'ಕನ್ನಡ', 'മലയാളം'];
    Alert.alert('Select Language', 'Choose your preferred language', 
      languages.map(lang => ({
        text: lang,
        onPress: () => Alert.alert('Language Updated', `Language changed to ${lang}`)
      }))
    );
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Contact our support team at support@aarogyasahayak.in or call 1800-XXX-XXXX');
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    console.log('Logout button pressed');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            console.log('Logout confirmed, signing out...');
            setIsLoggingOut(true);
            try {
              await signOut();
              console.log('Sign out successful, redirecting to main page...');
              // Force redirect to main page
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const ProfileOption = ({ icon: Icon, title, subtitle, onPress, rightElement }: any) => (
    <TouchableOpacity style={styles.profileOption} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color="#6B7280" />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={gradients.primary}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatar}>
            <User size={48} color={colors.background.primary} />
          </View>
          <Text style={styles.profileName}>
            {userProfile?.name || user?.displayName || 'User'}
          </Text>
          <Text style={styles.profileSubtitle}>
            {userProfile?.role === 'patient' 
              ? `Age: ${(userProfile as any)?.age || 'N/A'} • ${(userProfile as any)?.medicalConditions?.[0] || 'Patient'}`
              : `Health Worker • ${(userProfile as any)?.specialization?.[0] || 'General Care'}`
            }
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={16} color={colors.primary[500]} />
            <Text style={styles.editButtonText}>{t('profile.personalInfo')}</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Health Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Summary</Text>
          <View style={styles.healthSummary}>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatValue}>85</Text>
              <Text style={styles.healthStatLabel}>Health Score</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatValue}>7</Text>
              <Text style={styles.healthStatLabel}>Day Streak</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatValue}>24</Text>
              <Text style={styles.healthStatLabel}>Records</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          
          <ProfileOption
            icon={Bell}
            title={t('profile.notifications')}
            subtitle="Manage reminders and alerts"
            onPress={handleNotificationSettings}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor={colors.background.primary}
              />
            }
          />

          <ProfileOption
            icon={Globe}
            title={t('profile.language')}
            subtitle="English"
            onPress={handleLanguageChange}
          />

          <ProfileOption
            icon={Moon}
            title="Dark Mode"
            subtitle="Switch to dark theme"
            onPress={() => {}}
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor={colors.background.primary}
              />
            }
          />
        </View>

        {/* Health & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health & Privacy</Text>
          
          <ProfileOption
            icon={Heart}
            title="Health Records"
            subtitle="View and manage your health data"
            onPress={handleHealthRecords}
          />

          <ProfileOption
            icon={Shield}
            title="Privacy Settings"
            subtitle="Control data sharing and permissions"
            onPress={() => Alert.alert('Privacy', 'Your data is encrypted and secure.')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <ProfileOption
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help or contact support"
            onPress={handleHelp}
          />

          <ProfileOption
            icon={Settings}
            title="App Settings"
            subtitle="Advanced app configuration"
            onPress={() => Alert.alert('App Settings', 'Advanced settings coming soon.')}
          />
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>Primary Contact</Text>
            <Text style={styles.emergencyContact}>सुनीता कुमार (Wife)</Text>
            <Text style={styles.emergencyPhone}>+91 98765 43210</Text>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]} 
            onPress={() => {
              console.log('Logout button touched');
              handleLogout();
            }}
            activeOpacity={0.7}
            disabled={isLoggingOut}
          >
            <LogOut size={20} color={colors.status.error} />
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Aarogya Sahayak v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ for better health</Text>
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
  profileHeader: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.background.primary,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: colors.background.primary,
    opacity: 0.9,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background.primary,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  healthSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.primary,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthStat: {
    alignItems: 'center',
  },
  healthStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary[500],
  },
  healthStatLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  profileOption: {
    backgroundColor: colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  emergencyCard: {
    backgroundColor: colors.background.primary,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  emergencyContact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  emergencyPhone: {
    fontSize: 16,
    color: colors.primary[500],
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.status.error + '30',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.status.error,
    marginLeft: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: colors.neutral[400],
    marginBottom: 4,
  },
});