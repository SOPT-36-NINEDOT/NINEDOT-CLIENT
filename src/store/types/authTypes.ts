export interface AnswerType {
  questionId: number;
  choiceId: number;
}

export interface UserType {
  id?: number;
  name: string;
  email: string;
  birthday?: string;
  job?: string;
  profileImageUrl: string;
  answers?: AnswerType[];
  onboardingCompleted: boolean;
  nextPage: string;
}

export interface AuthStoreType {
  user: UserType;
  isLoggedIn: boolean;
  setUser: (newUser: UserType) => void;
  resetUser: () => void;
  updateLoginStatus: () => void;
}
