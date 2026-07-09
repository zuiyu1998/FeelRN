interface User {
  id: string;
  // …其他用户字段由项目自行扩展
}

interface UserState {
  token: string | null;
  user: User | null;
}

interface UserActions {
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setAuth: (token: string, user: User) => void;
  signOut: () => void;
}

type UserStore = UserState & UserActions;

interface AppState {
  loading: boolean;
}

interface AppActions {
  finishLoading: () => void;
}

type AppStore = AppState & AppActions;

export type { User, UserActions, UserState, UserStore, AppActions, AppState, AppStore };
