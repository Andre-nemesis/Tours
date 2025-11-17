import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onNext?: () => void;
  onSkip?: () => void;
};

export default function Onboarding1({ onNext = () => {}, onSkip = () => {} }: Props) {
  return (
    <View style={styles.container}>
      
      {/* Imagem pequena */}
      <View style={styles.smallCircle}>
        <Image
          source={require('../../../assets/images/onbg1.png')}
          style={styles.onbg1}
        />
      </View>

      {/* Imagem grande */}
      <View style={styles.bigCircle}>
        <Image
          source={require('../../../assets/images/onbg2.png')}
          style={styles.onbg2}
        />
      </View>

      {/* Texto */}
      <Text style={styles.title}>Encontre lugares incríveis</Text>

      {/* Indicadores */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  smallCircle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 10,
    right: 150,
    top: -10
  },
  onbg1: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  bigCircle: {
    width: 360,
    height: 360,
    borderRadius: 360,
    overflow: 'hidden',
    marginBottom: 40,
    right: -50,
    top: -100
  },
  onbg2: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: -70,
    right: 0,
    top: -100,
  },

  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#DADADA',
    marginHorizontal: 5,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#22c55e',
  },

  buttonsContainer: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-between',
  },
  skipBtn: {
    backgroundColor: '#E6E6E6',
    paddingVertical: 14,
    paddingHorizontal: 49,
    borderRadius: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
  },
  nextBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#100f0fff',
  },
});
