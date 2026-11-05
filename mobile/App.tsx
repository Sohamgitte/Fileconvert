import React, { useState } from 'react';
import { SafeAreaView, Text, Pressable, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [file, setFile] = useState('No file selected');
  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({ multiple: false, copyToCacheDirectory: true });
    if (!result.canceled) setFile(result.assets[0].name);
  }
  return <SafeAreaView style={styles.container}><Text style={styles.title}>FileConvert</Text><Text style={styles.subtitle}>Convert files securely.</Text><Pressable style={styles.button} onPress={pickFile}><Text style={styles.buttonText}>Select file</Text></Pressable><Text style={styles.file}>{file}</Text></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f8fafc' }, title: { fontSize: 34, fontWeight: '800', color: '#0f172a' }, subtitle: { marginVertical: 12, color: '#475569' }, button: { padding: 16, borderRadius: 12, backgroundColor: '#2563eb', alignItems: 'center' }, buttonText: { color: '#fff', fontWeight: '700' }, file: { marginTop: 20, color: '#334155' } });
