import { Module } from '@nestjs/common';
import { FirebaseGuard } from './firebase/firebase.guard'; // FirebaseGuard එක import කරනවා
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  // 1. Imports: AuthModule එකට අවශ්‍ය වෙනත් Modules මෙතනට දාන්න.
  // FirebaseGuard එකට FirebaseService එක ඕන නිසා, අපි FirebaseModule එක මෙතන import කරනවා.
  imports: [FirebaseModule],

  // 2. Providers: මේ Module එකට අයිති Guards, Services වගේ දේවල් මෙතනට දාන්න.
  providers: [FirebaseGuard],

  // 3. Exports: මේ Module එකේ තියෙන දේවල්, වෙනත් Modules වලට පාවිච්චි කරන්න දෙන්න.
  // අපි මේ FirebaseGuard එක UsersModule, ProfileModule වගේ තැන්වල පාවිච්චි කරන නිසා,
  // ඒක මෙතනින් export කරන්න ඕන.
  exports: [FirebaseGuard, FirebaseModule],
})
export class AuthModule {}
