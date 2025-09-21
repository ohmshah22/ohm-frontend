import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface VitalChartProps {
  data: Array<{
    date: string;
    bloodSugar: number;
    systolic: number;
    diastolic: number;
    weight: number;
  }>;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 40;
const chartHeight = 200;

export function VitalChart({ data }: VitalChartProps) {
  const bloodSugarData = data.map(d => d.bloodSugar);
  const maxBloodSugar = Math.max(...bloodSugarData);
  const minBloodSugar = Math.min(...bloodSugarData);

  const getPointPosition = (value: number, index: number, max: number, min: number) => {
    const x = (chartWidth / (data.length - 1)) * index;
    const y = chartHeight - ((value - min) / (max - min)) * chartHeight;
    return { x, y };
  };

  const bloodSugarPoints = bloodSugarData.map((value, index) =>
    getPointPosition(value, index, maxBloodSugar, minBloodSugar)
  );

  const pathData = bloodSugarPoints.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${acc} L ${point.x} ${point.y}`;
  }, '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Sugar Trend (mg/dL)</Text>
      <View style={styles.chartContainer}>
        <View style={styles.yAxisLabels}>
          <Text style={styles.axisLabel}>{maxBloodSugar}</Text>
          <Text style={styles.axisLabel}>{Math.round((maxBloodSugar + minBloodSugar) / 2)}</Text>
          <Text style={styles.axisLabel}>{minBloodSugar}</Text>
        </View>
        <View style={styles.chart}>
          <View style={styles.gridLines}>
            {[0, 1, 2].map(line => (
              <View key={line} style={[styles.gridLine, { top: (chartHeight / 2) * line }]} />
            ))}
          </View>
          <View style={styles.dataLine}>
            {bloodSugarPoints.map((point, index) => (
              <View
                key={index}
                style={[
                  styles.dataPoint,
                  {
                    left: point.x - 4,
                    top: point.y - 4,
                  }
                ]}
              />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.xAxisLabels}>
        {data.map((item, index) => (
          <Text key={index} style={styles.axisLabel}>
            {new Date(item.date).getDate()}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    height: chartHeight,
  },
  yAxisLabels: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  chart: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dataLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#14B8A6',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingLeft: 40,
  },
  axisLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
});