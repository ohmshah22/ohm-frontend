import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface QuickActionButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

export function QuickActionButton({ icon: Icon, title, subtitle, color, onPress }: QuickActionButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: `${color}15` }]} 
      onPress={onPress}
    >
      <Icon size={24} color={color} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
});