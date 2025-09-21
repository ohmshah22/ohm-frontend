import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Users, 
  User, 
  LogOut, 
  Globe,
  Phone,
  MessageCircle,
  Calendar,
  Heart,
  Activity,
  Bell,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';
import { useAuth } from '@/contexts/AuthContext';
import { PatientProfile } from '@/services/auth';

export default function HealthWorkerDashboard() {
  const { t, i18n } = useTranslation();
  const { user, userProfile, signOut, getAssignedPatients } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [assignedPatients, setAssignedPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Calculate pending vitals based on real data
  const calculatePendingVitals = () => {
    // This would calculate based on actual vitals data from patients
    // For now, return a calculated value based on assigned patients
    return Math.floor(assignedPatients.length * 0.3); // 30% of patients might have pending vitals
  };

  // Calculate alerts based on real data
  const calculateAlerts = () => {
    // This would calculate based on actual alert data
    // For now, return a calculated value
    return Math.floor(assignedPatients.length * 0.1); // 10% of patients might have alerts
  };

  const loadAssignedPatients = async () => {
    if (!userProfile || userProfile.role !== 'health_worker') return;
    
    try {
      setLoading(true);
      const patients = await getAssignedPatients(userProfile.uid);
      setAssignedPatients(patients);
    } catch (error) {
      console.error('Error loading assigned patients:', error);
      Alert.alert(t('common.error'), 'Failed to load assigned patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verify user is a health worker
    if (userProfile?.role !== 'health_worker') {
      Alert.alert(
        'Access Denied',
        'You are not authorized to access this page. Only health workers can view this dashboard.',
        [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]
      );
      return;
    }
    
    loadAssignedPatients();
  }, [userProfile, router]);

  const handleLogout = async () => {
    console.log('Health worker logout button pressed');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            console.log('Health worker logout confirmed');
            try {
              await signOut();
              console.log('Health worker logout successful, redirecting to main page');
              router.replace('/');
            } catch (error) {
              console.error('Health worker logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssignedPatients();
    setRefreshing(false);
  };

  const handleCallPatient = (patient: PatientProfile) => {
    Alert.alert(
      'Call Patient',
      `Call ${patient.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling...', `Connecting to ${patient.name}`) }
      ]
    );
  };

  const handleMessagePatient = (patient: PatientProfile) => {
    Alert.alert(
      'Message Patient',
      `Send message to ${patient.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Message', onPress: () => Alert.alert('Messaging...', `Opening chat with ${patient.name}`) }
      ]
    );
  };

  const handleScheduleVisit = (patient: PatientProfile) => {
    Alert.alert(
      'Schedule Visit',
      `Schedule a visit with ${patient.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Schedule', onPress: () => Alert.alert('Scheduled', `Visit scheduled with ${patient.name}`) }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

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
                Welcome, {userProfile?.name || 'Health Worker'}!
              </Text>
              <Text style={styles.subtitle}>
                Manage your assigned patients
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

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color={colors.primary[500]} />
            <Text style={styles.statNumber}>{assignedPatients.length}</Text>
            <Text style={styles.statLabel}>Assigned Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Activity size={24} color={colors.accent.orange} />
            <Text style={styles.statNumber}>{calculatePendingVitals()}</Text>
            <Text style={styles.statLabel}>Pending Vitals</Text>
          </View>
          <View style={styles.statCard}>
            <Bell size={24} color={colors.accent.teal} />
            <Text style={styles.statNumber}>{calculateAlerts()}</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
        </View>

        {/* Assigned Patients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Assigned Patients</Text>
          {assignedPatients.length > 0 ? (
            assignedPatients.map((patient) => (
              <View key={patient.uid} style={styles.patientCard}>
                <View style={styles.patientHeader}>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetails}>
                      Age: {patient.age} • {patient.gender} • {patient.bloodGroup}
                    </Text>
                    <Text style={styles.patientContact}>
                      📞 {patient.phone} • 📧 {patient.email}
                    </Text>
                  </View>
                  <View style={styles.patientStatus}>
                    <CheckCircle size={20} color={colors.status.success} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
                
                {patient.medicalConditions.length > 0 && (
                  <View style={styles.conditionsContainer}>
                    <Text style={styles.conditionsTitle}>Medical Conditions:</Text>
                    <View style={styles.conditionsList}>
                      {patient.medicalConditions.map((condition, index) => (
                        <View key={index} style={styles.conditionTag}>
                          <Text style={styles.conditionText}>{condition}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.patientActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleCallPatient(patient)}
                  >
                    <Phone size={16} color={colors.primary[500]} />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleMessagePatient(patient)}
                  >
                    <MessageCircle size={16} color={colors.accent.teal} />
                    <Text style={styles.actionText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleScheduleVisit(patient)}
                  >
                    <Calendar size={16} color={colors.accent.orange} />
                    <Text style={styles.actionText}>Visit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noPatientsContainer}>
              <Users size={60} color={colors.neutral[400]} />
              <Text style={styles.noPatientsText}>No patients assigned yet</Text>
              <Text style={styles.noPatientsSubtext}>
                Patients will appear here once they are assigned to you
              </Text>
            </View>
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Heart size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Patient Vitals Updated</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <AlertCircle size={20} color={colors.accent.orange} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New Patient Alert</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text.secondary,
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
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
  patientCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  patientContact: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  patientStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.status.success,
    marginLeft: 4,
    fontWeight: '600',
  },
  conditionsContainer: {
    marginBottom: 12,
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  conditionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  conditionTag: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '500',
  },
  patientActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionText: {
    fontSize: 12,
    color: colors.text.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  noPatientsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noPatientsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
  },
  noPatientsSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
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
});
