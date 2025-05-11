import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ManagePreferences = () => {
  const [preference, setPreference] = useState('');
  const [preferencesList, setPreferencesList] = useState<string[]>([]);

  const handleAddPreference = () => {
    if (preference) {
      setPreferencesList([...preferencesList, preference]);
      setPreference('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Food Preferences</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your food preference"
        value={preference}
        onChangeText={setPreference}
      />
      <Button title="Add Preference" onPress={handleAddPreference} />
      <View style={styles.listContainer}>
        {preferencesList.map((pref, index) => (
          <Text key={index} style={styles.preferenceText}>{pref}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  listContainer: {
    marginTop: 20,
  },
  preferenceText: {
    fontSize: 16,
  },
});

export default ManagePreferences;
