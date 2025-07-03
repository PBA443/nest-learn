import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service'; // Adjust the import path as necessary

@Injectable()
export class FirebaseGuard implements CanActivate {
  // constructor එක හරහා FirebaseService එක inject කරනවා
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Request header එකෙන් ID Token එක ගන්නවා
    const idToken = request.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      throw new UnauthorizedException('Authorization token not found.');
    }

    try {
      // Firebase Admin SDK එකෙන් token එක verify කරනවා
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(idToken);

      // verify වුණු user ගේ විස්තර request object එකට එකතු කරනවා
      // එතකොට controller එකේදී මේ විස්තර ගන්න පුළුවන්
      request.user = decodedToken;

      return true; // Token එක හරි නම්, request එකට ඉස්සරහට යන්න දෙනවා
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
