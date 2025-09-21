import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Heart, ArrowRight } from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';

export default function RoleSelectionScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'health_worker' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

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
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert(t('common.error'), 'Please select your role');
      return;
    }
    
    router.push({
      pathname: '/profile-setup',
      params: { role: selectedRole, language: selectedLanguage }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.primary}
        style={styles.header}
      >
        <Text style={styles.title}>Aarogya Sahayak</Text>
        <Text style={styles.subtitle}>{t('auth.selectRole')}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Language Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Language / अपनी भाषा चुनें</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    selectedLanguage === lang.code && styles.languageButtonSelected
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Text style={[
                    styles.languageText,
                    selectedLanguage === lang.code && styles.languageTextSelected
                  ]}>
                    {lang.native}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Role Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I am a / मैं हूं</Text>
            
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'patient' && styles.roleCardSelected
              ]}
              onPress={() => setSelectedRole('patient')}
            >
              <View style={styles.roleIcon}>
                <User size={32} color={selectedRole === 'patient' ? colors.background.primary : colors.primary[500]} />
              </View>
              <View style={styles.roleContent}>
                <Text style={[
                  styles.roleTitle,
                  selectedRole === 'patient' && styles.roleTitleSelected
                ]}>
                  Patient / रोगी
                </Text>
                <Text style={[
                  styles.roleDescription,
                  selectedRole === 'patient' && styles.roleDescriptionSelected
                ]}>
                  I need health monitoring and support
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'health_worker' && styles.roleCardSelected
              ]}
              onPress={() => setSelectedRole('health_worker')}
            >
              <View style={styles.roleIcon}>
                <Heart size={32} color={selectedRole === 'health_worker' ? colors.background.primary : colors.primary[500]} />
              </View>
              <View style={styles.roleContent}>
                <Text style={[
                  styles.roleTitle,
                  selectedRole === 'health_worker' && styles.roleTitleSelected
                ]}>
                  Health Worker / स्वास्थ्य कार्यकर्ता
                </Text>
                <Text style={[
                  styles.roleDescription,
                  selectedRole === 'health_worker' && styles.roleDescriptionSelected
                ]}>
                  I provide health support to patients
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedRole && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedRole}
          >
            <Text style={styles.continueButtonText}>
              Continue / जारी रखें
            </Text>
            <ArrowRight size={20} color={colors.background.primary} />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.background.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.background.primary,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  languageScroll: {
    marginBottom: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  languageButtonSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  languageText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  languageTextSelected: {
    color: colors.background.primary,
    fontWeight: '600',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  roleCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  roleTitleSelected: {
    color: colors.primary[700],
  },
  roleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  roleDescriptionSelected: {
    color: colors.primary[600],
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  continueButtonDisabled: {
    backgroundColor: colors.neutral[400],
  },
  continueButtonText: {
    color: colors.background.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
