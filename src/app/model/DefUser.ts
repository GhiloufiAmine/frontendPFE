import { DefAgency } from "./DefAgency";
import { DefClient } from "./DefClient";

export class DefUser {
    
    public user_id: number;

    public client_id: DefClient;

    public agency_id: DefAgency;

    public username: string;

    public email: string;

    public password: string;

    public isActive: boolean;

    public isNotLocked: boolean;

    public lastLoginDate: Date;

    public lastLoginDateDisplay: Date;

    public joinDate: Date;

    public role: string;

    public authorities: string[];

  constructor() {
    this.user_id;
    this.client_id;
    this.agency_id;
    this.username;
    this.email;
    this.password;
    this.isActive;
    this.isNotLocked;
    this.lastLoginDate;
    this.lastLoginDateDisplay;
    this.joinDate;
    this.role;
    this.authorities;
  }
}