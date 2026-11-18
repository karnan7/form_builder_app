export type User = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};
