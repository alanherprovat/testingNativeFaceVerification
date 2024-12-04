import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Check from 'react-native-vector-icons/FontAwesome5';

const CustomCheckBox = ({ 
  options = [], 
  selectedValues = [], // External selected values
  onChange, // Callback to handle value changes
  style,
  labelStyle,
  selectedButtStyle, 
  direction = 'vertical',
  disabled = false,
  label,
}) => {

  // Handle checkbox selection change
  const handleSelect = (value) => {
    let updatedValues;
    if (selectedValues.includes(value)) {
      // Remove value if already selected
      updatedValues = selectedValues.filter((item) => item !== value);
    } else {
      // Add value if not already selected
      updatedValues = [...selectedValues, value];
    }
    // Pass the updated values to the parent via onChange
    onChange && onChange(updatedValues);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.checkboxGroup,
        direction === 'horizontal' && styles.horizontal
      ]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option?.value} 
            style={[
              styles.checkboxItem,
              direction === 'horizontal' && styles.horizontalItem
            ]}
            onPress={() => !disabled && handleSelect(option?.value)}
            disabled={disabled}
          >
            <View style={[
              styles.checkboxButton,
              style,
              selectedValues.includes(option?.value) && [styles.checkboxButtonSelected, selectedButtStyle],
              disabled && styles.checkboxButtonDisabled,
            ]}>
              {selectedValues.includes(option?.value) && (
                <Check name="check" size={10} color="white" />
              )}
            </View>
            <Text 
              style={[
                styles.checkboxLabel,
                labelStyle,
                disabled && styles.disabledText,
                selectedValues.includes(option?.value) && styles.selectedText
              ]}
            >
              {option.label}
            </Text>

          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    // marginBottom: 8,
    color: 'hsl(357 91% 42%)',
  },
  checkboxGroup: {
    gap: 12,
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalItem: {
    marginRight: 16,
  },
  checkboxButton: {
    width: 24,
    height: 24,
    borderRadius: 12, // Square with rounded corners
    borderWidth: 2.5,
    borderColor: '#CC0A13', // Circle border color
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#ffffff",
    marginRight: 20,
    marginHorizontal: 5,
  },
  checkboxButtonSelected: {
    backgroundColor: '#CC0A13', // Background color when selected
    borderWidth: 0,
  },
  checkboxButtonDisabled: {
    // opacity: 0.5, // Lighter color when disabled
  },
  checkboxLabel: {
    fontSize: 20,
    fontWeight: '400',
    // marginLeft: 8,
    color: '#CC0A13',
  },
  selectedText: {
    color: '#0F7C4B',
  },
  disabledText: {
    // opacity: 0.5,
  },
});

export default CustomCheckBox;
