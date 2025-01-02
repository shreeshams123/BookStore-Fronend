import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/helper/must-match.validator';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {
    form: boolean = true;
  
    loginForm!: FormGroup;
    signupForm!: FormGroup;
    loginSubmitted: boolean = false
    loginErrorMessage:string=''
    signupSubmitted:boolean=false
    signupErrorMessage:string=''
    constructor(private formBuilder: FormBuilder,private userService:UserService,private router:Router) {}
  
    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required,Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ) ]]
      });
  
      this.signupForm = this.formBuilder.group({
        name:['',Validators.required],
        phone:['',[Validators.required,Validators.pattern('^\\d{10}')]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required,Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ) ]],
          confirmPassword: ['', [Validators.required]]
      },{
        validator: MustMatch('password', 'confirmPassword')
    });
    }
  
  
  
    navigateBtn(): void {
      this.form = !this.form; 
    }
    get loginControls() { return this.loginForm.controls }

    onLoginSubmit(): void {
      console.log('login click');
      const {status = "", value } = this.loginForm
      const {email, password} = value
      console.log(this.loginControls);
      this.loginSubmitted = true;
      if(status == "INVALID") 
        return
      this.userService.loginApiCall({email, password}).subscribe({next: (res: any) => {
        console.log(res);
        const {name,email,phone,token}=res.data;
        const user={name,email,phone,token};
        localStorage.setItem("userDetails",JSON.stringify(user))
        const userDetails: User = JSON.parse(localStorage.getItem("userDetails") || 'null');
        this.userService.updateUserDetails(userDetails);
       this.router.navigate(['/books-container'])
     },
      error: (err) => {
        console.log(err);
        if(err.error?.message){
        this.loginErrorMessage=err.error.message
   }
        else{
          this.loginErrorMessage="Unexpected error occured";        
        }
        setTimeout(() => {
          this.loginErrorMessage = ""; 
      }, 3000);
      }
      })
    }

    get signupControls() {return this.signupForm.controls};

  
    onSignupSubmit(): void {
      console.log('signup click');
      const {status = "", value } = this.signupForm
    const{name,email,phone,password,confirmPassword}=value
    console.log(this.signupForm.controls);
    this.signupSubmitted = true
    if(status == "INVALID") 
      return
    console.log(this.signupForm);
    console.log(this.signupForm.controls);
    this.userService.registerApiCall({name,email,phone,password,confirmPassword}).subscribe({next:(res)=>
      {
        console.log(res)
      },
      error: (err) => {
        console.log(err);
        if(err.error?.message){
        this.signupErrorMessage=err.error.message
        }
        else{
          this.signupErrorMessage="Unexpected error occured";        
        }
        setTimeout(() => {
          this.signupErrorMessage = ""; 
      }, 3000);
      }
      })
      
      
    }
      
    }
  
  
    

