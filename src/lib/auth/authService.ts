import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

// Google Provider 설정
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Google 로그인
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // ID 토큰 가져오기
    const idToken = await user.getIdToken();

    // 백엔드에 토큰 전송 
    await sendTokenToBackend(idToken);

    return user;
  } catch (error: any) {
    console.error("Google 로그인 실패:", error);
    throw new Error(error.message || "로그인에 실패했습니다.");
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("로그아웃 실패:", error);
    throw new Error(error.message || "로그아웃에 실패했습니다.");
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

async function sendTokenToBackend(idToken: string): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) {
      throw new Error("백엔드 인증 실패");
    }

    const data = await response.json();
    console.log("백엔드 인증 성공:", data);
  } catch (error) {
    console.error("백엔드 토큰 전송 실패:", error);
  }
}