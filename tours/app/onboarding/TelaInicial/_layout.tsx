import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function InitialScreen({ goToInicio, goToMapas, goToFavoritos, goToConta }: any) {
  const CIRCLE = width * 1.25;

  // ⏳ Navegar automaticamente após 5 segundos reativado
  useEffect(() => {
    const timer = setTimeout(() => {
      goToFavoritos(); // Usar a função de navegação passada via props
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      
      <View
        style={[
          styles.circle,
          {
            width: CIRCLE,
            height: CIRCLE,
            borderRadius: CIRCLE,
            top: -CIRCLE * 0.15,
          },
        ]}
      >
        <Image
          source={require('../../../assets/images/Onbg7.png')} // Alterado de volta para Onbg7.png
          style={styles.img}
        />
      </View>

      <Text style={styles.title}>Entre e viva a experiência</Text>

      <TouchableOpacity style={styles.buttonGreen} onPress={goToInicio}>
        <Text style={styles.buttonGreenText}>Entrar na minha conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonGray} onPress={goToConta}>
        <Text style={styles.buttonGrayText}>Criar uma conta</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    overflow: 'hidden',
  },

  circle: {
    position: 'absolute',
    overflow: 'hidden',
    alignSelf: 'center',
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  title: {
    marginTop: height * 0.7,
    fontSize: 24,
    fontWeight: '500',
    color: '#000000ff', // Cor do texto mudada para branco para melhor contraste
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  buttonGreen: {
    marginTop: 20,
    width: '90%',
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonGreenText: {
    color: '#040404ff',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonGray: {
    marginTop: 10,
    width: '90%',
    backgroundColor: '#E5E5E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonGrayText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
});
