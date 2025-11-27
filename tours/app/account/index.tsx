import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { loginRequest, saveToken } from '../../services/auth';
import { setAuthToken } from '../../services/api';

type Props = {
  onLogin?: () => void;
  onBack?: () => void;
};

export default function LoginScreen({ onLogin, onBack }: Props) {
  const [secure, setSecure] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <View style={styles.container}>

      {/* Títulos */}
      <Text style={styles.title}>Bem vindo</Text>
      <Text style={styles.subtitle}>Entre na sua conta da Tours</Text>

      {/* Campo Email */}
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} placeholder="" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      {/* Campo Senha */}
      <Text style={styles.label}>Senha:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={secure}
          placeholder=""
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <Link href={"account/forgot_password_step1"} asChild>
          {/* Esqueci a senha */}
          <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 6 }}>
            <Text style={styles.forgotText}>Esqueci a senha</Text>
          </TouchableOpacity>
      </Link>

      {/* Botão Entrar */}
      {error && <Text style={{ color: '#a00', marginTop: 8 }}>{error}</Text>}
      <TouchableOpacity
        style={styles.primaryButton}
        disabled={loading}
        onPress={async () => {
          setError(null);
          if (!email || !password) {
            setError('Preencha email e senha');
            return;
          }
          setLoading(true);
          try {
            const res = await loginRequest(email, password);
            const token = res.data?.token;
            if (token) {
              await saveToken(token);
              setAuthToken(token);
            }
            if (onLogin) onLogin();
            else router.replace('/homeScreen');
          } catch (err: any) {
            const msg = err?.response?.data?.message || err?.response?.data?.error || 'Erro ao efetuar login';
            setError(msg);
          } finally {
            setLoading(false);
          }
        }}
      >
        <Text style={styles.loginText}>{loading ? 'Entrando...' : 'Entrar na minha conta'}</Text>
      </TouchableOpacity>

      <Link href="account/create_account" asChild>
        {/* Botão Criar conta */}
        <TouchableOpacity style={styles.secundaryButton}>
          <Text style={styles.createText}>Criar uma conta</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  back: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backText: {
    fontSize: 16,
    marginLeft: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#E9E9E9",
    borderRadius: 6,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9E9E9",
    borderRadius: 6,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },

  forgotText: {
    color: "#0077A8",
    fontSize: 14,
  },

  primaryButton: {
    marginTop: 30,
    backgroundColor: "#00C18A",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
  },

  loginText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },

  secundaryButton: {
    marginTop: 14,
    backgroundColor: "#E4E4E4",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  },

  createText: {
    fontSize: 16,
    color: "#444",
  },
});
