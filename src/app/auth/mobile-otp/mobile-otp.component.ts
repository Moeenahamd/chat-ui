import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mobile-otp',
  templateUrl: './mobile-otp.component.html',
  styleUrls: ['./mobile-otp.component.css']
})
export class MobileOtpComponent implements OnInit {
  phoneNumber:any;
  constructor(
    private authService:AuthService,
    private toastr: ToastrService,
    private router:Router) { }
  otpForm = new FormGroup({
    otp: new FormControl(''),
  });
  ngOnInit(): void {
   this.phoneNumber= history.state.phone
  }
  reSendOtp(){
    const payload ={
      phoneno:this.phoneNumber
    }
    this.authService.reSendOTP(payload).subscribe((data:any)=>{
      if(data.success){
      this.toastr.success(data.message, "OTP")
      }
      else{
        this.toastr.error(data.message, "OTP")
      }
    })
  }
  sendOtp(){
    const payload ={
      phoneno:this.phoneNumber,
      code: this.otpForm.value.otp
    }
    this.authService.verifyAndSignUpUser(payload).subscribe((data:any)=>{
      if(data.success){
        this.toastr.success(data.message, "OTP")
        this.router.navigateByUrl('/chat');
        localStorage.setItem('userPhone', this.phoneNumber)
      }
      else{
        this.toastr.error(data.message, "OTP")
      }
    })
  }

}
