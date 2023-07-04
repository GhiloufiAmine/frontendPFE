import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { DefUser } from '../model/DefUser';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit{

  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: DefUser[];
  public refreshing: boolean;
  public selectedUser: DefUser;
  public subscriptions: Subscription[] = [];
  public editUser = new DefUser();
  private currentUser: string;

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private notificationService: NotificationService, private userService: UserService) {}
  
  ngOnInit(): void {
    this.getUsers(true);
  }
  
  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }


  public getUsers (showNotification : boolean ):void {
    this.refreshing = true ;
    this.subscriptions.push(
    this.userService.getUsers().subscribe(
        (response : DefUser[] ) => {
          this.userService.addUsersToLocalCache(response);
          this.users  = response ;
          this.refreshing = false ;
          if (showNotification){
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully . `) ;
          }
        },
        (errorResponse : HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR , errorResponse.error.message) ;
          this.refreshing = false ;
        }
      )
    );
  }

  public onSelectUser(selectedUser: DefUser): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }
  
  public onLogout(): void {
  this.authenticationService.logOut();
  this.router.navigateByUrl('/login');
  this.sendNotification(NotificationType.SUCCESS, `You've been successfully logged out.`)
  }

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormData(null, userForm.value);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: DefUser) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS , `${response.username} added successfully`) ;
        },
        (errorResponse : HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR , errorResponse.error.message) ;
        }
      )
    );
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormData(this.currentUser, this.editUser);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: DefUser) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.sendNotification(NotificationType.SUCCESS , `${response.username} updated successfully`) ;
        },
        (errorResponse : HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR , errorResponse.error.message) ;
        }
      )
    );
  }

  public searchUsers(searchTerm: string): void {
    const results: DefUser[] = [];
    for (const user of this.userService.getUsersFromLocalCache()) {
      if (user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.user_id.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ) {
            results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalCache();
    }
  }

  public onEditUser(editUser: DefUser): void {
    this.editUser = editUser;
    this.currentUser = editUser.username;
    this.clickButton('openUserEdit');
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occured, please try again.');
    }
  }
}