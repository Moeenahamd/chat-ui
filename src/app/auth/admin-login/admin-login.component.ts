import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private toastr: ToastrService,
    private router:Router) { }

  userForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit(): void {
  }
  signUp(){
    this.router.navigateByUrl('/sign-up');
  }
  logIn(){
    const payload = {
      userName: this.userForm.value.userName,
      password: this.userForm.value.password
    }
    this.authService.adminLogin(payload).subscribe((data:any)=>{
      this.toastr.success("Logged In Successfully", "Admin Login")
      localStorage.setItem('adminToken',data.token)
      this.router.navigateByUrl('/messages');
    },
    error =>{

    })
  }

}
