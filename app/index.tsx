import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Globe } from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthScreen() {
  const { t, i18n } = useTranslation();
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [userRole, setUserRole] = useState<'patient' | 'health_worker'>('patient');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

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

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert(t('common.error'), 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, {
          name,
          phone,
          address,
          preferredLanguage: i18n.language,
        }, userRole);
      }
      router.replace('/home');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.needsProfileSetup) {
        // Store the selected role for profile setup
        router.replace('/role-selection');
      } else {
        router.replace('/home');
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Aarogya Sahayak</Text>
          <Text style={styles.subtitle}>Your Health Companion</Text>
          
          <View style={styles.headerButtons}>
            {/* Role Selection Button */}
            <TouchableOpacity 
              style={styles.roleButton}
              onPress={() => setShowRoleSelection(!showRoleSelection)}
            >
              <User size={20} color={colors.background.primary} />
              <Text style={styles.roleButtonText}>
                {userRole === 'patient' ? 'Patient / रोगी' : 'Health Worker / स्वास्थ्य कर्मी'}
              </Text>
            </TouchableOpacity>
            
            {/* Language Selector */}
            <TouchableOpacity 
              style={styles.languageButton}
              onPress={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <Globe size={20} color={colors.background.primary} />
              <Text style={styles.languageButtonText}>
                {languages.find(lang => lang.code === i18n.language)?.native || 'English'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {showRoleSelection && (
        <View style={styles.roleSelector}>
          <Text style={styles.roleSelectorTitle}>Select Your Role / अपनी भूमिका चुनें</Text>
          <View style={styles.roleOptions}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                userRole === 'patient' && styles.roleOptionSelected
              ]}
              onPress={() => {
                setUserRole('patient');
                setShowRoleSelection(false);
              }}
            >
              <User size={24} color={userRole === 'patient' ? colors.background.primary : colors.text.primary} />
              <Text style={[
                styles.roleOptionText,
                userRole === 'patient' && styles.roleOptionTextSelected
              ]}>
                Patient / रोगी
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleOption,
                userRole === 'health_worker' && styles.roleOptionSelected
              ]}
              onPress={() => {
                setUserRole('health_worker');
                setShowRoleSelection(false);
              }}
            >
              <User size={24} color={userRole === 'health_worker' ? colors.background.primary : colors.text.primary} />
              <Text style={[
                styles.roleOptionText,
                userRole === 'health_worker' && styles.roleOptionTextSelected
              ]}>
                Health Worker / स्वास्थ्य कर्मी
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isLogin ? 'Sign in to continue' : 'Join us for better health'}
          </Text>


          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={colors.neutral[500]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={colors.neutral[500]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.neutral[500]} />
                ) : (
                  <Eye size={20} color={colors.neutral[500]} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {!isLogin && (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <User size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Phone size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <MapPin size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Address (Optional)"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                  />
                </View>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.authButtonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"
              }
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleButtonText: {
    color: colors.background.primary,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  roleSelector: {
    backgroundColor: colors.background.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  roleSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  roleOptionSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  roleOptionText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    marginLeft: 8,
    textAlign: 'center',
  },
  roleOptionTextSelected: {
    color: colors.background.primary,
    fontWeight: '600',
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
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageButtonText: {
    color: colors.background.primary,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  languageSelector: {
    backgroundColor: colors.background.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  languageOptionSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  languageOptionText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  languageOptionTextSelected: {
    color: colors.background.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.medium,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeIcon: {
    padding: 4,
  },
  authButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  authButtonDisabled: {
    backgroundColor: colors.neutral[400],
  },
  authButtonText: {
    color: colors.background.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.text.secondary,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: colors.background.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  googleButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchButtonText: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: '500',
  },
  roleSelection: {
    marginBottom: 24,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background.primary,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  roleButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  roleButtonText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  roleButtonTextSelected: {
    color: colors.primary[700],
    fontWeight: '600',
  },
});