import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  onFinish?: () => void;
};

export default function Onboarding3({ onFinish = () => {} }: Props) {
  const CIRCLE_BIG = Math.round(width * 0.75);
  const CIRCLE_SMALL = Math.round(width * 0.55);

  return (
    <View style={styles.container}>

      {/* Círculo grande (direita) — prédios */}
      <View
        style={[
          styles.circle,
          {
            width: CIRCLE_BIG,
            height: CIRCLE_BIG,
            borderRadius: CIRCLE_BIG / 2, // deixa redonda de verdade
            top: height * -0.04, // MAIS PRA CIMA
            right: -CIRCLE_BIG * 0.19,
            left: -CIRCLE_SMALL * -0.69,
            
          },
        ]}
      >
        <Image
          source={require('../../../assets/images/Onbg5.png')}
          style={styles.img}
        />
      </View>

      {/* Círculo pequeno — parede laranja COM MAIS JANELA VISÍVEL */}
      <View
        style={[
          styles.circle,
          {
            width: CIRCLE_SMALL,
            height: CIRCLE_SMALL,
            borderRadius: CIRCLE_SMALL / 2,
            top: height * 0.20,
            left: -CIRCLE_SMALL * 0.32,
            marginLeft: -30, 
          },
        ]}
      >
        <Image
          source={require('../../../assets/images/Onbg6.png')}
          style={[
            styles.img,
            {
              transform: [{ scaleX: -1 }],
              marginLeft: -20, // remove área azul
              marginTop: -10,  // mostra mais da janela
            },
          ]}
        />
      </View>

      {/* Título */}
      <Text style={styles.title}>Comece sua jornada agora</Text>

      {/* Indicadores */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
      </View>

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={onFinish}>
        <Text style={styles.buttonText}>Começar minha jornada</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  circle: {
    position: 'absolute',
    overflow: 'hidden',
  },

  img: {
    width: '120%',      // aumenta zoom para tirar lateral azul
    height: '120%',
    resizeMode: 'cover',
  },

  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#111',
    marginTop: height * 0.45,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  dotsContainer: {
    flexDirection: 'row',
    marginTop: 39,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#DADADA',
    marginHorizontal: 6,
  },

  dotActive: {
    width: 22,
    backgroundColor: '#22c55e',
  },

  button: {
    position: 'absolute',
    bottom: height * 0.07,
    width: '86%',
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
