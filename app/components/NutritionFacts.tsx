import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface NutritionFactsProps {
  servingSize: string;
  servingSizeGrams: number;
  servingsPerContainer: number;
  calories: number;
  nutrients: {
    totalFat: { value: number; unit: string; dailyValue: number };
    saturatedFat: { value: number; unit: string; dailyValue: number };
    transFat: { value: number; unit: string };
    cholesterol: { value: number; unit: string; dailyValue: number };
    sodium: { value: number; unit: string; dailyValue: number };
    totalCarbohydrate: { value: number; unit: string; dailyValue: number };
    dietaryFiber: { value: number; unit: string; dailyValue: number };
    addedSugars: { value: number; unit: string; dailyValue: number };
    protein: { value: number; unit: string };
    vitaminD: { value: number; unit: string; dailyValue: number };
    calcium: { value: number; unit: string; dailyValue: number };
    iron: { value: number; unit: string; dailyValue: number };
    potassium: { value: number; unit: string; dailyValue: number };
  };
}

export default function NutritionFacts({
  servingSize,
  servingSizeGrams,
  servingsPerContainer,
  calories,
  nutrients,
}: NutritionFactsProps) {
  const theme = useTheme();

  interface NutrientRowProps {
    label: string;
    value: number;
    unit: string;
    dailyValue?: number;
    indent?: boolean;
    bold?: boolean;
    divider?: boolean;
  }

  const NutrientRow = ({
    label,
    value,
    unit,
    dailyValue,
    indent = false,
    bold = false,
    divider = true
  }: NutrientRowProps) => (
    <>
      <View style={[
        styles.nutrientRow,
        indent && styles.indentedRow,
        !divider && styles.noDivider
      ]}>
        <Text style={[
          styles.nutrientLabel,
          bold && styles.boldText,
          { color: theme.colors.text }
        ]}>
          {label}
        </Text>
        <View style={styles.valueContainer}>
          <Text style={[
            styles.nutrientValue,
            bold && styles.boldText,
            value === 0 && styles.zeroValue,
            { color: theme.colors.text }
          ]}>
            {value}{unit}
          </Text>
          {dailyValue !== undefined && (
            <Text style={[
              styles.dailyValue,
              dailyValue === 0 && styles.zeroValue,
              { color: theme.colors.textSecondary }
            ]}>
              {dailyValue}%
            </Text>
          )}
        </View>
      </View>
      {divider && (
        <View style={[
          styles.divider,
          indent ? styles.indentedDivider : styles.fullDivider,
          { backgroundColor: theme.colors.border }
        ]} />
      )}
    </>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[theme.colors.primary + 'CC', '#FF6B6B', '#FFD166']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <LinearGradient
          colors={[theme.colors.card, theme.colors.card + '99']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: 'transparent' }]}
        >
        <Text style={[styles.header, { color: theme.colors.text, zIndex: 1 }]}>Nutrition Facts</Text>
        <View style={[styles.thickDivider, { backgroundColor: theme.colors.primary, zIndex: 1 }]} />

        <View style={styles.servingContainer}>
          <Text style={[styles.servingInfo, { color: theme.colors.text }]}>
            {servingsPerContainer} serving per container
          </Text>
          <View style={styles.servingSizeRow}>
            <Text style={[styles.servingSizeLabel, { color: theme.colors.text }]}>
              Serving size
            </Text>
            <Text style={[styles.servingSizeValue, { color: theme.colors.text }]}>
              {servingSize} {servingSizeGrams > 0 ? `(${servingSizeGrams}g)` : ''}
            </Text>
          </View>
        </View>

        <View style={[styles.thickDivider, { backgroundColor: theme.colors.text }]} />

        <View style={styles.calorieSection}>
          <Text style={[styles.calorieLabel, { color: theme.colors.text }]}>Calories</Text>
          <Text style={[
            styles.calorieValue,
            calories === 0 && styles.zeroValue,
            { color: theme.colors.text }
          ]}>
            {calories}
          </Text>
        </View>

        <View style={[styles.thickDivider, { backgroundColor: theme.colors.text }]} />

        <Text style={[styles.dailyValueNote, { color: theme.colors.textSecondary }]}>
          % Daily Value*
        </Text>

        <View style={styles.nutrientsContainer}>
          <NutrientRow
            label="Total Fat"
            value={nutrients.totalFat.value}
            unit={nutrients.totalFat.unit}
            dailyValue={nutrients.totalFat.dailyValue}
            bold
          />

          <NutrientRow
            label="Saturated Fat"
            value={nutrients.saturatedFat.value}
            unit={nutrients.saturatedFat.unit}
            dailyValue={nutrients.saturatedFat.dailyValue}
            indent
          />

          <NutrientRow
            label="Trans Fat"
            value={nutrients.transFat.value}
            unit={nutrients.transFat.unit}
            indent
          />

          <NutrientRow
            label="Cholesterol"
            value={nutrients.cholesterol.value}
            unit={nutrients.cholesterol.unit}
            dailyValue={nutrients.cholesterol.dailyValue}
            bold
          />

          <NutrientRow
            label="Sodium"
            value={nutrients.sodium.value}
            unit={nutrients.sodium.unit}
            dailyValue={nutrients.sodium.dailyValue}
            bold
          />

          <NutrientRow
            label="Total Carbohydrate"
            value={nutrients.totalCarbohydrate.value}
            unit={nutrients.totalCarbohydrate.unit}
            dailyValue={nutrients.totalCarbohydrate.dailyValue}
            bold
          />

          <NutrientRow
            label="Dietary Fiber"
            value={nutrients.dietaryFiber.value}
            unit={nutrients.dietaryFiber.unit}
            dailyValue={nutrients.dietaryFiber.dailyValue}
            indent
          />

          <NutrientRow
            label="Includes Added Sugars"
            value={nutrients.addedSugars.value}
            unit={nutrients.addedSugars.unit}
            dailyValue={nutrients.addedSugars.dailyValue}
            indent
          />

          <NutrientRow
            label="Protein"
            value={nutrients.protein.value}
            unit={nutrients.protein.unit}
            bold
          />
        </View>

        <View style={[styles.thickDivider, { backgroundColor: theme.colors.text }]} />

        <View style={styles.vitaminsContainer}>
          <NutrientRow
            label="Vitamin D"
            value={nutrients.vitaminD.value}
            unit={nutrients.vitaminD.unit}
            dailyValue={nutrients.vitaminD.dailyValue}
          />

          <NutrientRow
            label="Calcium"
            value={nutrients.calcium.value}
            unit={nutrients.calcium.unit}
            dailyValue={nutrients.calcium.dailyValue}
          />

          <NutrientRow
            label="Iron"
            value={nutrients.iron.value}
            unit={nutrients.iron.unit}
            dailyValue={nutrients.iron.dailyValue}
          />

          <NutrientRow
            label="Potassium"
            value={nutrients.potassium.value}
            unit={nutrients.potassium.unit}
            dailyValue={nutrients.potassium.dailyValue}
            divider={false}
          />
        </View>

        <Text style={[styles.footnote, { color: theme.colors.textSecondary }]}>
          * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
        </Text>
        </LinearGradient>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardGradient: {
    margin: 16,
    borderRadius: 15,
    padding: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
      }
    }),
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  thickDivider: {
    height: 8,
    marginVertical: 12,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  fullDivider: {
    width: '100%',
  },
  indentedDivider: {
    width: '90%',
    alignSelf: 'flex-end',
  },
  servingContainer: {
    marginVertical: 8,
  },
  servingInfo: {
    fontSize: 15,
    marginVertical: 4,
  },
  servingSizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  servingSizeLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  servingSizeValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  calorieSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  calorieLabel: {
    fontSize: 24,
    fontWeight: '700',
  },
  calorieValue: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  dailyValueNote: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 12,
    fontWeight: '500',
  },
  nutrientsContainer: {
    marginVertical: 8,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  indentedRow: {
    marginLeft: 24,
  },
  nutrientLabel: {
    fontSize: 15,
    flex: 1,
    letterSpacing: 0.2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
    justifyContent: 'flex-end',
  },
  nutrientValue: {
    fontSize: 15,
    marginRight: 8,
    letterSpacing: 0.2,
  },
  dailyValue: {
    fontSize: 15,
    minWidth: 40,
    textAlign: 'right',
    letterSpacing: 0.2,
  },
  boldText: {
    fontWeight: '600',
  },
  noDivider: {
    marginBottom: 0,
  },
  vitaminsContainer: {
    marginVertical: 8,
  },
  footnote: {
    fontSize: 12,
    marginTop: 16,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  zeroValue: {
    opacity: 0.5,
  },
});