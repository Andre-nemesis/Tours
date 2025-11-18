import React, { useEffect, useState } from 'react';
import SplashScreen from './onboarding/SplashScreen';
import Onboarding1 from './onboarding/Onboarding1';
import Onboarding2 from './onboarding/Onboarding2';
import Onboarding3 from './onboarding/Onboarding3';
import TelaInicial from './onboarding/TelaInicial';
import Favoritos from './onboarding/Favoritos';
import Conta from './onboarding/conta'; // Import the new Conta component

// <-- import com nome em PascalCase

export default function Home() {
  const [screen, setScreen] = useState('splash'); // Alterado de volta para iniciar na SplashScreen

  // useEffect para navegação inicial para on1 reativado
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('on1'); // muda para o Onboarding 1
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Funções enviadas para os botões
  const goToOn2 = () => setScreen('on2');
  const skipAll = () => setScreen('initial'); // agora pula para a tela inicial

  const goToInicio = () => setScreen('initial');
  const goToMapas = () => setScreen('mapas');
  const goToFavoritos = () => setScreen('favoritos');
  const goToConta = () => setScreen('conta');

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'on1' && <Onboarding1 onNext={goToOn2} onSkip={skipAll} />}
      {screen === 'on2' && <Onboarding2 onNext={() => setScreen('on3')} onSkip={skipAll} />}
      {screen === 'on3' && <Onboarding3 onFinish={() => setScreen('initial')} />}
      {screen === 'initial' && <TelaInicial goToInicio={goToInicio} goToMapas={goToMapas} goToFavoritos={goToFavoritos} goToConta={goToConta} />}
      {screen === 'favoritos' && <Favoritos goToInicio={goToInicio} goToMapas={goToMapas} goToFavoritos={goToFavoritos} goToConta={goToConta} />}
      {screen === 'conta' && <Conta goToInicio={goToInicio} goToMapas={goToMapas} goToFavoritos={goToFavoritos} goToConta={goToConta} />} {/* Conditionally render Conta */}
    </>
  );
}
