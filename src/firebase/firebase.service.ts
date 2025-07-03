import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY_PATH environment variable not found.',
      );
    }

    const serviceAccountPath = path.resolve(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH,
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });

    console.log('Firebase Admin SDK initialized successfully!');
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }
}
