import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrls: ['./login-prompt.component.scss']
})
export class LoginPromptComponent {
constructor(private router:Router){}

onLogin(){
  this.router.navigate(["login-signup"]);
}
}
