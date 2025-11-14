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

export default function CreateAccountScreen() {
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
      <Text style={styles.title}>Crie sua conta</Text>
      <Text style={styles.subtitle}>
        Crie sua conta no Tours para descobrir lugares incríveis
      </Text>

      {/* Campo Nome */}
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} placeholder="" />

      {/* Campo Email */}
      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} placeholder="" />

      {/* Campo Senha */}
      <Text style={styles.label}>Senha:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={secure}
          placeholder=""
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Esqueci a senha */}
      <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 6 }}>
        <Text style={styles.forgotText}>Esqueci a senha</Text>
      </TouchableOpacity>

      {/* Botão Criar conta */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.loginText}>Criar uma conta</Text>
      </TouchableOpacity>

      {/* Botão Entrar */}
      <TouchableOpacity style={styles.secundaryButton}>
        <Text style={styles.createText}>Já tenho uma conta</Text>
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
