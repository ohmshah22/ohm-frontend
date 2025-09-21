import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, MapPin, Calendar, Briefcase, Star, Clock } from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';
import { useAuth } from '@/contexts/AuthContext';
import { PatientProfile, HealthWorkerProfile } from '@/services/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function ProfileSetupScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { role, language } = useLocalSearchParams();
  const { signUp, user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Set language
  React.useEffect(() => {
    if (language && typeof language === 'string') {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Common fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Patient specific fields
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');

  // Health Worker specific fields
  const [employeeId, setEmployeeId] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState('');
  const [workingHoursStart, setWorkingHoursStart] = useState('09:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('17:00');
  const [workingDays, setWorkingDays] = useState('Monday,Tuesday,Wednesday,Thursday,Friday');

  const isPatient = role === 'patient';

  const handleSubmit = async () => {
    if (!name || !phone) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let userData: Partial<PatientProfile | HealthWorkerProfile>;

      if (isPatient) {
        userData = {
          name,
          phone,
          address,
          age: parseInt(age) || 0,
          gender,
          bloodGroup,
          medicalConditions: medicalConditions.split(',').map(c => c.trim()).filter(c => c),
          medications: medications.split(',').map(m => m.trim()).filter(m => m),
          allergies: allergies.split(',').map(a => a.trim()).filter(a => a),
          emergencyContact: {
            name: emergencyContactName,
            phone: emergencyContactPhone,
            relationship: emergencyContactRelation,
          },
          preferredLanguage: language as string || 'en',
        } as Partial<PatientProfile>;
      } else {
        userData = {
          name,
          phone,
          address,
          employeeId,
          specialization: specialization.split(',').map(s => s.trim()).filter(s => s),
          experience: parseInt(experience) || 0,
          languages: languages.split(',').map(l => l.trim()).filter(l => l),
          workingHours: {
            start: workingHoursStart,
            end: workingHoursEnd,
          },
          workingDays: workingDays.split(',').map(d => d.trim()).filter(d => d),
          location: {
            latitude: 0,
            longitude: 0,
            address: address,
          },
          preferredLanguage: language as string || 'en',
        } as Partial<HealthWorkerProfile>;
      }

      if (user) {
        // User is already authenticated (Google sign-in), just update their profile
        const userProfile = {
          ...userData,
          uid: user.uid,
          email: user.email || '',
          role: role as 'patient' | 'health_worker',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
        await updateProfile(userProfile as any);
      } else {
        // New user signup
        const email = `${name.toLowerCase().replace(/\s+/g, '')}@aarogya.com`;
        const password = 'demo123';
        await signUp(email, password, userData, role as 'patient' | 'health_worker');
      }
      
      Alert.alert(
        t('common.success'),
        'Profile created successfully! Please check your email for verification.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/home'),
          },
        ]
      );
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
      >
        <Text style={styles.title}>Profile Setup</Text>
        <Text style={styles.subtitle}>
          {isPatient ? 'Tell us about yourself' : 'Complete your professional profile'}
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Common Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <User size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name *"
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
                  placeholder="Phone Number *"
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
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </View>
            </View>
          </View>

          {isPatient ? (
            /* Patient Specific Fields */
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Information</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Calendar size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  {['male', 'female', 'other'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderButton,
                        gender === g && styles.genderButtonSelected
                      ]}
                      onPress={() => setGender(g as 'male' | 'female' | 'other')}
                    >
                      <Text style={[
                        styles.genderText,
                        gender === g && styles.genderTextSelected
                      ]}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Blood Group (e.g., A+, B-, O+)"
                  value={bloodGroup}
                  onChangeText={setBloodGroup}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Medical Conditions (comma separated)"
                  value={medicalConditions}
                  onChangeText={setMedicalConditions}
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Current Medications (comma separated)"
                  value={medications}
                  onChangeText={setMedications}
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Allergies (comma separated)"
                  value={allergies}
                  onChangeText={setAllergies}
                  multiline
                />
              </View>

              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Emergency Contact Name"
                  value={emergencyContactName}
                  onChangeText={setEmergencyContactName}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Emergency Contact Phone"
                  value={emergencyContactPhone}
                  onChangeText={setEmergencyContactPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Relationship (e.g., Spouse, Son, Daughter)"
                  value={emergencyContactRelation}
                  onChangeText={setEmergencyContactRelation}
                />
              </View>
            </View>
          ) : (
            /* Health Worker Specific Fields */
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Briefcase size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Employee ID"
                    value={employeeId}
                    onChangeText={setEmployeeId}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Specialization (comma separated, e.g., Diabetes Care, Hypertension)"
                  value={specialization}
                  onChangeText={setSpecialization}
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Star size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Years of Experience"
                    value={experience}
                    onChangeText={setExperience}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Languages (comma separated, e.g., Hindi, English, Telugu)"
                  value={languages}
                  onChangeText={setLanguages}
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Working Hours</Text>
                <View style={styles.timeContainer}>
                  <View style={styles.inputWrapper}>
                    <Clock size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Start Time"
                      value={workingHoursStart}
                      onChangeText={setWorkingHoursStart}
                    />
                  </View>
                  <Text style={styles.timeSeparator}>to</Text>
                  <View style={styles.inputWrapper}>
                    <Clock size={20} color={colors.neutral[500]} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="End Time"
                      value={workingHoursEnd}
                      onChangeText={setWorkingHoursEnd}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Working Days (comma separated, e.g., Monday, Tuesday, Wednesday)"
                  value={workingDays}
                  onChangeText={setWorkingDays}
                  multiline
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating Profile...' : 'Create Profile'}
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
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.background.primary,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
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
  textArea: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.medium,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  genderText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: colors.background.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeSeparator: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: colors.neutral[400],
  },
  submitButtonText: {
    color: colors.background.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
