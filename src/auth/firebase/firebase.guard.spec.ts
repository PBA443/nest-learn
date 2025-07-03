import { FirebaseGuard } from './firebase.guard';

describe('FirebaseGuard', () => {
  it('should be defined', () => {
    const mockFirebaseService = {
      getAuth: () => ({
        verifyIdToken: async () => ({ uid: '123' }),
      }),
    };

    expect(new FirebaseGuard(mockFirebaseService as any)).toBeDefined();
  });
});
