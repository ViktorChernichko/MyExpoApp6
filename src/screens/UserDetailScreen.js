import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useUserContext } from '../context/UserContext';
import { fetchUserById } from '../api/api';

export default function UserDetailScreen() {
  const { selectedUser } = useUserContext();
  const [details, setDetails] = useState(selectedUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser?.id) {
      loadDetails(selectedUser.id);
    }
  }, [selectedUser]);

  const loadDetails = async (id) => {
    setLoading(true);
    try {
      const data = await fetchUserById(id);
      setDetails(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (!details) {
    return (
      <View style={styles.centered}>
        <Text>Користувача не вибрано</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{details.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{details.name}</Text>
        <Text style={styles.username}>@{details.username}</Text>
      </View>

      <Section title="Контакти">
        <Row label="Email" value={details.email} />
        <Row label="Телефон" value={details.phone} />
        <TouchableOpacity onPress={() => Linking.openURL(`https://${details.website}`)}>
          <Row label="Сайт" value={details.website} valueColor="#4A90D9" />
        </TouchableOpacity>
      </Section>

      <Section title="Адреса">
        <Row label="Вулиця" value={`${details.address?.street}, ${details.address?.suite}`} />
        <Row label="Місто" value={details.address?.city} />
        <Row label="Індекс" value={details.address?.zipcode} />
      </Section>

      <Section title="Компанія">
        <Row label="Назва" value={details.company?.name} />
        <Row label="Гасло" value={details.company?.catchPhrase} />
        <Row label="Сфера" value={details.company?.bs} />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  username: { fontSize: 14, color: '#888', marginTop: 4 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10, color: '#4A90D9' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: '#888', fontSize: 13 },
  rowValue: {
    color: '#1a1a1a',
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
});
