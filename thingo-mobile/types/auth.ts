export interface UserInfo {
  uuid: string;
  name: string;
  email: string;
  profileImageUrl: string;
  gender: string;
  nickname: string;
  college: string;
  departmentName: string;
  departmentUuid: string;
  studentNumber: string;
  role: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  login: (user: UserInfo) => void;
  logout: () => void;
  setUser: (user: UserInfo) => void;
}
