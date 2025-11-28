import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import ConfirmModal from "@/components/ConfirmModal";

export default function ForgotPasswordStep1Screen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, insira um email");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Email inválido");
      return;
    }

    setLoading(true);
    try {
      // Faz chamada à API para verificar se email existe
      const response = await api.post("api/users/forgot-password", { email });

      if (response.data.exists) {
        setModalVisible(true);
        Alert.alert("Email encontrado", "Um email para redefinição de senha foi enviado.");
      } else {
        Alert.alert("Email não encontrado", "Este email não está registrado em nossa plataforma");
      }
    } catch (error: any) {
      console.error("Erro ao verificar email:", error);

      if (error.response?.status === 404) {
        Alert.alert("Email não encontrado", "Este email não está registrado em nossa plataforma");
      } else if (error.response?.status === 400) {
        Alert.alert("Erro", error.response.data?.message || "Email inválido");
      } else {
        Alert.alert("Erro", "Não foi possível verificar o email. Tente novamente mais tarde.");
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
      <Text style={styles.title}>Esqueceu a sua senha?</Text>
      <Text style={styles.subtitle}>
        Insira o email que você criou a sua conta na Tours
      </Text>

      {/* Campo Email */}
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="seu-email@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      {/* Botão Continuar */}
      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.loginText}>Continuar</Text>
        )}
      </TouchableOpacity>
      <ConfirmModal
        visible={modalVisible}
        title="Remover favorito"
        message={"E-mail Enviado!"}
        confirmText="Continuar"
        cancelText="Cancelar"
        onCancel={() => { setModalVisible(false); }}
        onConfirm={async () => {setModalVisible(false);}}
      />
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

  primaryButton: {
    marginTop: 30,
    backgroundColor: "#00C18A",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  loginText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
