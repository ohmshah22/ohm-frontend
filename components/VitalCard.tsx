import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface VitalCardProps {
  title: string;
  value: string;
  status: 'normal' | 'good' | 'stable' | 'warning';
  icon: LucideIcon;
  color: string;
}

export function VitalCard({ title, value, status, icon: Icon, color }: VitalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'good':
      case 'stable':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '32%',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});