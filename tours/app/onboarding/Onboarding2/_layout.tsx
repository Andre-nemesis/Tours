import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  onNext?: () => void;
  onSkip?: () => void;
};

export default function Onboarding2({ onNext = () => {}, onSkip = () => {} }: Props) {
  return (
    <View style={styles.container}>
      {/* Círculo grande (esquerda, cortado) */}
      <View style={styles.bigCircle}>
        <Image
          source={require('../../../assets/images/Onbg3.png')}
          style={styles.onbg}
        />
      </View>

      {/* Círculo pequeno (direita, cortado) */}
      <View style={styles.smallCircle}>
        <Image
          source={require('../../../assets/images/Onbg4.png')}
          style={styles.onbg}
        />
      </View>

      {/* Texto */}
      <Text style={styles.title}>Aprenda com cada passo</Text>

      {/* Indicadores */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>

      {/* Botões */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
          <Text style={styles.nextText}>Próximo →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CIRCLE_BIG = Math.round(width * 0.9);   // ajuste responsivo conservador
const CIRCLE_SMALL = Math.round(width * 0.45);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  /* Círculo grande (esquerda) */
  bigCircle: {
    width: CIRCLE_BIG,
    height: CIRCLE_BIG,
    borderRadius: CIRCLE_BIG,
    overflow: 'hidden',
    position: 'absolute',
    top: -Math.round(CIRCLE_BIG * 0.15),
    left: -Math.round(CIRCLE_BIG * 0.2), // deixa cortado na esquerda
  },

  /* Círculo pequeno (direita) */
  smallCircle: {
    width: CIRCLE_SMALL,
    height: CIRCLE_SMALL,
    borderRadius: CIRCLE_SMALL,
    overflow: 'hidden',
    position: 'absolute',
    top: Math.round(height * 0.28),
    right: -Math.round(CIRCLE_SMALL * 0.4), // cortado na direita
  },

  /* imagem dentro dos círculos */
  onbg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  /* Texto principal */
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    bottom: Math.round(height * 0.27),
    paddingHorizontal: 20,
  },

  /* Indicadores */
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: Math.round(height * 0.20),
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

  /* Botões */
  buttonsContainer: {
    flexDirection: 'row',
    width: '86%',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: Math.round(height * 0.06),
  },
  skipBtn: {
    backgroundColor: '#E6E6E6',
    paddingVertical: 14,
    paddingHorizontal: 46,
    borderRadius: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
  },
  nextBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
