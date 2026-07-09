interface User {
  id: string;
  // …其他用户字段由项目自行扩展
}

interface UserState {
  token: string;
  user: User | null;
}

interface UserActions {
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  setAuth: (token: string, user: User) => void;
  signOut: () => void;
}

type UserStore = UserState & UserActions;

export type { User, UserActions, UserState, UserStore };
