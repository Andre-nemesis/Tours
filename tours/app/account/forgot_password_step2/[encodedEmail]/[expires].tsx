import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ForgotPasswordDeepLinkRedirect() {
  const params = useLocalSearchParams() as any;
  const router = useRouter();

  useEffect(() => {
    const rawEncoded = params.encodedEmail ?? params[0] ?? '';
    const rawExpires = params.expires ?? params[1] ?? '';
    const encodedEmail = decodeURIComponent(String(rawEncoded));
    const expires = Number(rawExpires);

    // Substitua o caminho abaixo caso sua tela esteja em outra rota
    router.replace({
      pathname: '/account/forgot_password_step2',
      params: { email: encodedEmail, expires },
    });
  }, [params, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00C18A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});