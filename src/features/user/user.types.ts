export interface Address{
    id:string;
    label: string;
    street: string; 
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}
export interface User {
  uid: string;
  email: string | null;     
  displayName: string | null; 
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  address?: Address[];
  avatar?: string;
  role: "customer" | "admin";       }