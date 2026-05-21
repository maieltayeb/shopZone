import { Address } from "../features/user/user.types";
export type LoginFormData ={
  email: string;
  password: string;
}
export type LoginFormDataErrors= {
  email?: string;
  password?: string;
}
export type RegisterFormData ={
  firstName: string;
  lastName : string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}


export type RegisterFormDataErrors ={
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

export type ProfileFormData ={
 firstName: string;
  lastName : string;
  email: string;

  phone: string
}
export type ResetPasswordFormData={
    currentPassword: string;
     newPassword: string;
     confirmNewPassword: string;
  email: string;
}
export type ResetPasswordDataErrors= {
  email?: string;
}



export type AddressFormData = Omit<Address, 'id'>