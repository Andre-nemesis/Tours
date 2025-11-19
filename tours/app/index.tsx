import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import SplashScreen from './onboarding/SplashScreen';
import Onboarding1 from './onboarding/Onboarding1';
import Onboarding2 from './onboarding/Onboarding2';
import Onboarding3 from './onboarding/Onboarding3';
import Account from './account';
import HomeScreen from './homeScreen';
import Favorites from './homeScreen/Favorites/index';
import Profile from './homeScreen/Profile/index';


export default function Home() {
  const router = useRouter();
  const [screen, setScreen] = useState('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('on1'); // Após 2,5 segundos, vá para a tela de onboarding 1
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const goToOn2 = () => setScreen('on2');
  const skipAll = () => {
    router.replace('/homeScreen');
  };

  const goToInicio = () => router.replace('/homeScreen');
  const goToMapas = () => router.replace('/homeScreen');
  const goToFavoritos = () => router.replace('/homeScreen/favorites');
  const goToConta = () => router.replace('/account');

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'on1' && <Onboarding1 onNext={goToOn2} onSkip={skipAll} />}
      {screen === 'on2' && <Onboarding2 onNext={() => setScreen('on3')} onSkip={skipAll} />}
      {screen === 'on3' && <Onboarding3 onFinish={() => router.replace('/account')} />}
      {screen === 'initial' && null}
      {screen === 'favoritos' && null}
      {screen === 'conta' && null}
    </>
  );
}
