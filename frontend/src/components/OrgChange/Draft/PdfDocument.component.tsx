import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Header } from '@sk-web-gui/react';
// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
export const PdfDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Header title={`Masterdata`} subtitle={`Hantera organisation`} />
        <Text>Sundsvalls Kommun</Text>
      </View>
    </Page>
  </Document>
);
