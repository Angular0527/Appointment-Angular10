import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isCreateBtn : boolean = true;
  isLoginBtn: boolean = true;
  handleUser:String = 'loginUser';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onCreateAccount() : void {
    this.handleUser = 'createUser';
    this.isCreateBtn = true;
    this.isLoginBtn = false;
  }

  onLogin () : void {
    this.handleUser = 'loginUser';
    this.isLoginBtn = true;
    this.isCreateBtn = false;
  }
}
