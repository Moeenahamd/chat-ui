import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mobile-sign-up',
  templateUrl: './mobile-sign-up.component.html',
  styleUrls: ['./mobile-sign-up.component.css']
})
export class MobileSignUpComponent implements OnInit {

  constructor(private authService:AuthService,
              private router:Router  
  ) { }
  userForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
  });
  ngOnInit(): void {
    
  }
  createUser(){
    const payload = {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      phoneno: this.userForm.value.phone,
      password: this.userForm.value.password
    }
    this.authService.addUser(payload).subscribe((data:any)=>{
      if(data.success){
        this.router.navigateByUrl('/otp', { state: { phone: this.userForm.value.phone} });
      }
      else{
        alert(data.message)
      }

    },
    error =>{

    })
  }
}
