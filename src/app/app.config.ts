import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "AIzaSyC4VkUKxS659eElCfB0HzLpfRZqnc9q7CY",
  authDomain: "sauce-eats.firebaseapp.com",
  projectId: "sauce-eats",
  storageBucket: "sauce-eats.firebasestorage.app",
  messagingSenderId: "688689112636",
  appId: "1:688689112636:web:18b1828ea87dc6ad47c539",
  measurementId: "G-RC0BJ26M92"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideHttpClient(),
  ]
};
