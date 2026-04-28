import { Roles } from "../auth/types";

export interface UserModel {
  id?: number;
  name: string;
  telephone: string;
  password: string | null;
  status: "ACTIVE" | "INACTIVE" |"BLOCK";
  role: Roles;
}