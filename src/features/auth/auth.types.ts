

import { User } from "../user/user.types";
export interface AuthState {
  user: User | null;   // ممكن يكون فيه user أو null
  isLoading: boolean;
  error:string | null;
}