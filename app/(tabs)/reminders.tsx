import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { Bell, Plus, Clock, Pill, Calendar, SquareCheck as CheckSquare, Square } from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';
import { ReminderCard } from '../../components/ReminderCard';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function RemindersScreen() {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderType, setReminderType] = useState('medication');

  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Metformin - Morning Dose',
      time: '08:00 AM',
      type: 'medication',
      completed: true,
      frequency: 'Daily'
    },
    {
      id: 2,
      title: 'Blood Pressure Check',
      time: '09:30 AM',
      type: 'measurement',
      completed: true,
      frequency: 'Daily'
    },
    {
      id: 3,
      title: 'Metformin - Evening Dose',
      time: '08:00 PM',
      type: 'medication',
      completed: false,
      frequency: 'Daily'
    },
    {
      id: 4,
      title: 'Doctor Appointment - Dr. Sharma',
      time: '10:00 AM',
      type: 'appointment',
      completed: false,
      frequency: 'Tomorrow'
    },
    {
      id: 5,
      title: 'Evening Walk',
      time: '06:30 PM',
      type: 'exercise',
      completed: false,
      frequency: 'Daily'
    }
  ]);

  const handleAddReminder = async () => {
    if (!reminderTitle || !reminderTime) {
      Alert.alert(t('common.error'), 'Please fill in all fields');
      return;
    }

    try {
      const newReminder = {
        title: reminderTitle,
        time: reminderTime,
        type: reminderType,
        completed: false,
        frequency: 'Daily',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'reminders'), newReminder);
      setReminderTitle('');
      setReminderTime('');
      setShowAddForm(false);
      Alert.alert(t('common.success'), 'Reminder added successfully!');
      loadReminders();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to add reminder');
    }
  };

  const loadReminders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reminders'));
      const remindersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReminders(remindersData);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const toggleReminderCompletion = (id: number) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const todayReminders = reminders.filter(r => r.frequency === 'Daily');
  const upcomingReminders = reminders.filter(r => r.frequency !== 'Daily');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.warning}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>{t('reminders.title')}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={24} color={colors.background.primary} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add Reminder Form */}
        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>{t('reminders.addReminder')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Reminder title (e.g., Take Medicine)"
              value={reminderTitle}
              onChangeText={setReminderTitle}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 8:00 AM)"
              value={reminderTime}
              onChangeText={setReminderTime}
            />

            <View style={styles.typeSelector}>
              {[
                { key: 'medication', label: t('reminders.medication') },
                { key: 'appointment', label: t('reminders.appointment') },
                { key: 'checkup', label: t('reminders.checkup') },
                { key: 'exercise', label: t('reminders.exercise') }
              ].map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.typeButton,
                    reminderType === key && styles.activeTypeButton
                  ]}
                  onPress={() => setReminderType(key)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    reminderType === key && styles.activeTypeButtonText
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddReminder}
              >
                <Text style={styles.saveButtonText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Today's Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Reminders</Text>
          {todayReminders.map(reminder => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggleCompletion={() => toggleReminderCompletion(reminder.id)}
            />
          ))}
        </View>

        {/* Upcoming Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {upcomingReminders.map(reminder => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggleCompletion={() => toggleReminderCompletion(reminder.id)}
            />
          ))}
        </View>

        {/* Adherence Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Adherence</Text>
          <View style={styles.adherenceCard}>
            <View style={styles.adherenceHeader}>
              <Text style={styles.adherenceTitle}>Medication Compliance</Text>
              <Text style={styles.adherencePercent}>92%</Text>
            </View>
            <View style={styles.adherenceBar}>
              <View style={[styles.adherenceProgress, { width: '92%' }]} />
            </View>
            <Text style={styles.adherenceText}>
              Great job! You've taken 13 out of 14 scheduled medications this week.
            </Text>
          </View>
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <Bell size={24} color="#3B82F6" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Reminder Tips</Text>
              <Text style={styles.tipDescription}>
                Set reminders 30 minutes before meals for diabetes medications. This helps maintain consistent blood sugar levels.
              </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background.primary,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addForm: {
    backgroundColor: colors.background.primary,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  activeTypeButton: {
    backgroundColor: colors.accent.orange,
    borderColor: colors.accent.orange,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[600],
  },
  activeTypeButtonText: {
    color: colors.background.primary,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[600],
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.accent.orange,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background.primary,
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
  adherenceCard: {
    backgroundColor: colors.background.primary,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adherenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adherenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  adherencePercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary[500],
  },
  adherenceBar: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    marginBottom: 12,
  },
  adherenceProgress: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  adherenceText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: colors.background.primary,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipContent: {
    marginLeft: 12,
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});