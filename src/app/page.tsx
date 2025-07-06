'use client';
import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Create audio element and play in loop
    const audio = new Audio('/sohamn5.mp3');
    audio.loop = true;
    audio.volume = 0.5; // Adjust volume as needed

    // Play audio when app loads
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.log('Audio autoplay failed:', error);
      }
    };

    playAudio();

    // Cleanup function to stop audio when component unmounts
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center">
        <AuthButton />
      </Page.Main>
    </Page>
  );
}
