export interface PartnerModel {
  password: string
  partner_id: string
  email: string
  username: string
}

export interface AdminModel {
  password: string
  admin_id: string
  username: string
  level: string
}

export interface TokenPayloadModel {
  id: number
  telephone: string
  role: Roles
  name: string
}

export type Roles = 'OPERATOR' | 'ADMIN' | 'VIEWER'


export interface PartnerApiKey {
  id: number;
  partner_id: number;
  username: string;
  expire_in: Date;
  level: string;
}

export interface FindSessionPartnerData {
  session_id: string | null | undefined
  partner_id: string
}

export interface UserPartnerModel {
  id: number;
  telephone: string;
  password: string;
  status: string;
  role: string;
  name: string;
}
