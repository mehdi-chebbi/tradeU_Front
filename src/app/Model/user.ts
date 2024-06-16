export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    phone: string;
    address: string;
    banned: boolean;
    isOnline: boolean;
    token: string;
  }