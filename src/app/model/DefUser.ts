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
    this.user_id = 0;
    this.client_id = 0;
    this.agency_id = 0;
    this.username = '';
    this.email = '';
    this.password = '';
    this.isActive = false;
    this.isNotLocked = false;
    this.lastLoginDate = new Date;
    this.lastLoginDateDisplay = new Date;
    this.joinDate = new Date;
    this.role = '';
    this.authorities = [];
  }
}