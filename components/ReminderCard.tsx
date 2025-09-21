import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SquareCheck as CheckSquare, Square, Pill, Activity, Calendar, Zap } from 'lucide-react-native';

interface ReminderCardProps {
  reminder: {
    id: number;
    title: string;
    time: string;
    type: 'medication' | 'measurement' | 'appointment' | 'exercise';
    completed: boolean;
    frequency: string;
  };
  onToggleCompletion: () => void;
}

export function ReminderCard({ reminder, onToggleCompletion }: ReminderCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill size={20} color="#3B82F6" />;
      case 'measurement':
        return <Activity size={20} color="#10B981" />;
      case 'appointment':
        return <Calendar size={20} color="#F59E0B" />;
      case 'exercise':
        return <Zap size={20} color="#8B5CF6" />;
      default:
        return <Activity size={20} color="#6B7280" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication':
        return '#3B82F6';
      case 'measurement':
        return '#10B981';
      case 'appointment':
        return '#F59E0B';
      case 'exercise':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={[styles.container, reminder.completed && styles.completedContainer]}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: `${getTypeColor(reminder.type)}15` }]}>
          {getTypeIcon(reminder.type)}
        </View>
        <View style={styles.reminderInfo}>
          <Text style={[styles.title, reminder.completed && styles.completedTitle]}>
            {reminder.title}
          </Text>
          <Text style={styles.time}>{reminder.time}</Text>
          <Text style={styles.frequency}>{reminder.frequency}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onToggleCompletion} style={styles.checkbox}>
        {reminder.completed ? (
          <CheckSquare size={24} color="#10B981" />
        ) : (
          <Square size={24} color="#6B7280" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  completedContainer: {
    backgroundColor: '#F0FDF4',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#14B8A6',
    marginBottom: 2,
  },
  frequency: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkbox: {
    padding: 4,
  },
});