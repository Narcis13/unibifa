export type User = {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    password: string;
    permissions?: string | null;
    avatar?: string | null;
    role: "CFPP" | "ADMIN" | "GENERAL" | "RESPONSABIL"| "CONTABIL"| "ECONOMIST";
    current_password?: string;
    new_password?: string;
    email_verified: boolean;
    is_active: boolean;
    last_login: Date | null;
    created_at: Date;
  };
  
  export type UserDetails = {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    role:string;
  }

  export type Transfer = {
      nume_pacient: string;
      email:string;
      mesaj?:string;
      numefiser?:string;
  
  }
  
  export type TransferFinalizat = {
    id:number;
    numepacient: string;
    adresaemail:string;
    mesaj?:string;
    numefiser?:string;
    stare:string;
    dataincarcare:Date;
    dataexpirare?:Date;
    updated_at?:Date;
  
  } 
  
  export type ProviderUser = {
    id: number;
    provider: "GOOGLE";
    provider_user_id: string;
    user_id: number;
  };
  
  export type JSONResponse = {
    status: "success" | "fail";
    data?: any;
    error?: any;
  };
  
  export type TokensSession = {
    accessToken: string;
    refreshToken?: string;
    sid?: string;
  };
  
  export type ClientPlatforms = "app" | "browser" | "browser-dev";
  
  export type EmailOptions = {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
  };
  
  export type UserEditable = {
    first_name?: string;
    last_name?: string;
    role?: string;
    csrf_token?: string;
    is_active?: boolean;
    permissions?: string;
  };
  
  export type NewUser = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    csrf_token?: string;
  };
  
  export type RefreshToken = {
    id: number;
    token_id: string;
    user_id: number;
    is_active: boolean;
    date_created: DateTime;
  };
  
  export type RefreshTokens = Array<RefreshToken>;
  
  export type Session = {
    id: number;
    user_id: number;
    sid: string;
    start_time: DateTime;
    end_time?: DateTime;
    access_token: string;
    csrf_token: string;
    is_active: boolean;
    ip_address: string;
  };
  
  export enum Roles {
    "SUPER_ADMIN",
    "ADMIN",
    "GENERAL",
  }
  
  export type NxFormInput = {
    label?: string;
    id: string;
    type?:
      | "input:text"
      | "input:password"
      | "input:email"
      | "input:number"
      | "textarea"
      | "select";
    options?: Array<string>;
    disabled?: boolean;
    show?: boolean;
    value?: string;
  };
  
  export type NxLink = {
    name: string;
    link?: string;
    disabled?: boolean;
    show?: boolean;
    hasBorder?: boolean;
    showChildren?: boolean;
    children?: Links;
    bold?: boolean;
    group?: string;
  };
  
  export type NxLinks = Array<NxLink>;