import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  goToInicio?: () => void;
  goToMapas?: () => void;
  goToFavoritos?: () => void;
  goToConta?: () => void;
};

export default function HomeScreen(_props: Props) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá, Caroline Melo</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="scan-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#777" />
        <TextInput
          placeholder="Pesquise lugares..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Início</Text>

      {/* Visited Recently */}
      <Text style={styles.subtitleSection}>Visitados recentemente</Text>

      <View style={styles.cardList}>
        <TouchableOpacity style={styles.visitCard}>
          <Image
            source={{
              uri:
                "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.visitTitle}>Centro Dragão do Mar</Text>
            <Text style={styles.visitSubtitle}>Fortaleza, Ce</Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.visitCard}>
          <Image
            source={{
              uri:
                "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.visitTitle}>Centro Dragão do Mar</Text>
            <Text style={styles.visitSubtitle}>Fortaleza, Ce</Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Maybe you like */}
      <Text style={[styles.subtitleSection, { marginTop: 20 }]}>
        Talvez você goste
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Image
          style={styles.suggestion}
          source={{
            uri:
              "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
          }}
        />
        <Image
          style={styles.suggestion}
          source={{
            uri:
              "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
          }}
        />
        <Image
          style={styles.suggestion}
          source={{
            uri:
              "https://images.unsplash.com/photo-1495273967996-d057c23c5d55",
          }}
        />
      </ScrollView>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  hello: {
    fontSize: 18,
    fontWeight: "500",
  },

  searchBox: {
    backgroundColor: "#E9E9E9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },

  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: 25,
  },

  subtitleSection: {
    fontSize: 16,
    marginTop: 18,
    marginBottom: 10,
    color: "#444",
  },

  cardList: {
    gap: 12,
  },

  visitCard: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },

  visitTitle: {
    fontSize: 16,
    fontWeight: "500",
  },

  visitSubtitle: {
    fontSize: 13,
    color: "#777",
  },

  suggestion: {
    width: 140,
    height: 150,
    borderRadius: 14,
    marginRight: 14,
  },
});
