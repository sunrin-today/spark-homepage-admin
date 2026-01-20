import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

const TOKEN_KEY = "firebase_auth_token";

// Google Provider 설정
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Google 로그인
export async function signInWithGoogle(): Promise<{ user: User; token: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // ID 토큰 가져오기
    const idToken = await user.getIdToken();

    // localStorage에 토큰 저장
    saveTokenToLocalStorage(idToken);

    return { user, token: idToken }; // 토큰도 함께 반환
  } catch (error: any) {
    console.error("Google 로그인 실패:", error);
    throw new Error(error.message || "로그인에 실패했습니다.");
  }
}

export async function signOut(): Promise<void> {
  try {
    // localStorage에서 토큰 제거
    removeTokenFromLocalStorage();
    
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("로그아웃 실패:", error);
    throw new Error(error.message || "로그아웃에 실패했습니다.");
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // 사용자가 로그인 상태일 때 토큰 갱신
      try {
        const idToken = await user.getIdToken();
        saveTokenToLocalStorage(idToken);
      } catch (error) {
        console.error("토큰 갱신 실패:", error);
      }
    } else {
      // 로그아웃 상태일 때 토큰 제거
      removeTokenFromLocalStorage();
    }
    callback(user);
  });
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// localStorage에 토큰 저장
function saveTokenToLocalStorage(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("토큰이 localStorage에 저장되었습니다.");
  } catch (error) {
    console.error("localStorage 저장 실패:", error);
  }
}

// localStorage에서 토큰 제거
function removeTokenFromLocalStorage(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log("토큰이 localStorage에서 제거되었습니다.");
  } catch (error) {
    console.error("localStorage 제거 실패:", error);
  }
}

// localStorage에서 토큰 가져오기
export function getTokenFromLocalStorage(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("localStorage 읽기 실패:", error);
    return null;
  }
}

// API 요청 시 사용할 헤더에 토큰 추가
export function getAuthHeaders(): HeadersInit {
  const token = getTokenFromLocalStorage();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// 사용자 정보 가져오기
export async function getCurrentUserInfo(): Promise<any> {
  try {
    const token = getTokenFromLocalStorage();
    if (!token) {
      throw new Error("토큰이 없습니다.");
    }

    const response = await fetch('/api/users/me', {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("사용자 정보를 가져올 수 없습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    throw error;
  }
}