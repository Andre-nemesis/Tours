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

export default function ForgotPasswordStep1Screen() {
  const [secure, setSecure] = useState(true);
  const navigation = useNavigation();

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
      <TextInput style={styles.input} placeholder="" />

      {/* Botão Criar conta */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.loginText}>Continuar</Text>
      </TouchableOpacity>
      
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
