import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../services/api";
import { useRouter } from "expo-router";

export default function ForgotPasswordStep2Screen() {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRoute();
  const params = (route.params || {}) as any;
  const emailParam = params.email as string | undefined;
  const expiresParam = params.expires as number | undefined;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailParam || !expiresParam) {
      Alert.alert("Parâmetros inválidos", "Link inválido ou expirado.");
      // volta para tela anterior/login
      navigation.goBack();
    }
  }, [emailParam, expiresParam, navigation]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Erro", "Preencha os dois campos de senha.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    if (!emailParam || !expiresParam) {
      Alert.alert(
        "Erro",
        "Parâmetros inválidos. Tente novamente pelo link enviado."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        encodedEmail: emailParam,
        password,
        expires: expiresParam,
      };

      const res = await api.post("api/users/reset-password", payload);

      if (res.status === 200 || res.status === 201) {
        router.replace('/account');
        Alert.alert("Sucesso", "Senha alterada com sucesso.", [
          {
            text: "OK",
            onPress: () => {
              router.replace('/');
            },
          },
        ]);
      } else {
        Alert.alert(
          "Erro",
          res.data?.message || "Não foi possível redefinir a senha."
        );
      }
    } catch (error: any) {
      console.error("reset password error", error);
      if (error.response?.data?.message) {
        Alert.alert("Erro", error.response.data.message);
      } else {
        Alert.alert("Erro", "Não foi possível redefinir a senha. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      {/* Títulos */}
      <Text style={styles.title}>Estamos quase lá...</Text>
      <Text style={styles.subtitle}>Cadastre sua nova senha</Text>

      {/* Campo Senha */}
      <Text style={styles.label}>Senha:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={securePassword}
          placeholder="Nova senha"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setSecurePassword(!securePassword)}
          disabled={loading}
        >
          <Ionicons
            name={securePassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirmar senha:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={secureConfirm}
          placeholder="Confirme a senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setSecureConfirm(!secureConfirm)}
          disabled={loading}
        >
          <Ionicons
            name={secureConfirm ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Botão Concluir */}
      <TouchableOpacity
        style={[styles.primaryButton, loading && { opacity: 0.7 }]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Concluir recuperação de senha</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
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
    maxWidth: "85%",
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
});
