export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string; // Assuming UserRole is a string enum in Spring Boot
  phone: string;
  address: string; // Corrected spelling from adress to address
  banned: boolean;
  isOnline: boolean;
  token: string;
}
