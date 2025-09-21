import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Heart, Weight, TrendingUp, Plus, Calendar, ChartBar as BarChart3 } from 'lucide-react-native';
import { colors, gradients } from '@/config/colors';
import { VitalCard } from '../../components/VitalCard';
import { VitalChart } from '../../components/VitalChart';

export default function VitalsScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('log');
  const [bloodSugar, setBloodSugar] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [weight, setWeight] = useState('');

  const handleLogVital = () => {
    if (!bloodSugar && !systolic && !weight) {
      Alert.alert(t('common.error'), 'Please enter at least one vital measurement');
      return;
    }
    
    Alert.alert(
      t('common.success'),
      'Vital signs logged successfully!',
      [{ text: t('common.ok'), onPress: () => {
        setBloodSugar('');
        setSystolic('');
        setDiastolic('');
        setWeight('');
      }}]
    );
  };

  const vitalsData = [
    { date: '2024-01-15', bloodSugar: 125, systolic: 130, diastolic: 85, weight: 68.5 },
    { date: '2024-01-16', bloodSugar: 118, systolic: 125, diastolic: 82, weight: 68.3 },
    { date: '2024-01-17', bloodSugar: 122, systolic: 128, diastolic: 84, weight: 68.4 },
    { date: '2024-01-18', bloodSugar: 115, systolic: 122, diastolic: 80, weight: 68.2 },
    { date: '2024-01-19', bloodSugar: 120, systolic: 125, diastolic: 83, weight: 68.1 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.secondary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>{t('vitals.title')}</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'log' && styles.activeTab]}
            onPress={() => setActiveTab('log')}
          >
            <Text style={[styles.tabText, activeTab === 'log' && styles.activeTabText]}>
              {t('vitals.addReading')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              {t('vitals.viewHistory')}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'log' ? (
          <View style={styles.content}>
            {/* Current Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Status</Text>
              <View style={styles.vitalsGrid}>
                <VitalCard
                  title={t('vitals.bloodSugar')}
                  value="120 mg/dL"
                  status="normal"
                  icon={Activity}
                  color={colors.primary[500]}
                />
                <VitalCard
                  title={t('vitals.bloodPressure')}
                  value="125/80"
                  status="good"
                  icon={Heart}
                  color={colors.secondary[500]}
                />
                <VitalCard
                  title={t('vitals.weight')}
                  value="68.5 kg"
                  status="stable"
                  icon={Weight}
                  color={colors.accent.teal}
                />
              </View>
            </View>

            {/* Log New Readings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Log New Readings</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('vitals.bloodSugar')} ({t('vitals.unit.mgdl')})</Text>
                <TextInput
                  style={styles.input}
                  value={bloodSugar}
                  onChangeText={setBloodSugar}
                  placeholder="Enter blood sugar level"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('vitals.bloodPressure')} ({t('vitals.unit.mmhg')})</Text>
                <View style={styles.bpContainer}>
                  <TextInput
                    style={[styles.input, styles.bpInput]}
                    value={systolic}
                    onChangeText={setSystolic}
                    placeholder={t('vitals.systolic')}
                    keyboardType="numeric"
                  />
                  <Text style={styles.bpSeparator}>/</Text>
                  <TextInput
                    style={[styles.input, styles.bpInput]}
                    value={diastolic}
                    onChangeText={setDiastolic}
                    placeholder={t('vitals.diastolic')}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('vitals.weight')} ({t('vitals.unit.kg')})</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Enter weight"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.logButton} onPress={handleLogVital}>
                <Plus size={24} color={colors.background.primary} />
                <Text style={styles.logButtonText}>{t('vitals.addReading')}</Text>
              </TouchableOpacity>
            </View>

            {/* Health Insights */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Insights</Text>
              <View style={styles.insightCard}>
                <TrendingUp size={24} color="#10B981" />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Great Progress!</Text>
                  <Text style={styles.insightDescription}>
                    Your blood sugar has improved by 8% this week. Keep following your meal plan!
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            {/* Charts and Trends */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7-Day Trends</Text>
              <VitalChart data={vitalsData} />
            </View>

            {/* Recent Readings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Readings</Text>
              {vitalsData.reverse().map((reading, index) => (
                <View key={index} style={styles.readingCard}>
                  <View style={styles.readingDate}>
                    <Calendar size={20} color="#6B7280" />
                    <Text style={styles.dateText}>
                      {new Date(reading.date).toLocaleDateString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.readingValues}>
                    <Text style={styles.readingValue}>
                      Sugar: {reading.bloodSugar} mg/dL
                    </Text>
                    <Text style={styles.readingValue}>
                      BP: {reading.systolic}/{reading.diastolic} mmHg
                    </Text>
                    <Text style={styles.readingValue}>
                      Weight: {reading.weight} kg
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
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
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background.primary,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background.primary,
    opacity: 0.8,
  },
  activeTabText: {
    color: colors.background.primary,
    opacity: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  bpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bpInput: {
    flex: 1,
  },
  bpSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral[500],
    marginHorizontal: 12,
  },
  logButton: {
    backgroundColor: colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  logButtonText: {
    color: colors.background.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  insightCard: {
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
  insightContent: {
    marginLeft: 12,
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  insightDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
    lineHeight: 20,
  },
  readingCard: {
    backgroundColor: colors.background.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readingDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[500],
    marginLeft: 8,
  },
  readingValues: {
    gap: 4,
  },
  readingValue: {
    fontSize: 14,
    color: colors.text.primary,
  },
});