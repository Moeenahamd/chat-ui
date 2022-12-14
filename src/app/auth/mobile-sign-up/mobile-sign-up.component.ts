import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mobile-sign-up',
  templateUrl: './mobile-sign-up.component.html',
  styleUrls: ['./mobile-sign-up.component.css']
})
export class MobileSignUpComponent implements OnInit {
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	
  constructor(
    private authService:AuthService,
    private toastr: ToastrService,
    private router:Router  
  ) { }
  userForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl('')
  });
  ngOnInit(): void {
    
  }
  
  createUser(){
    const payload = {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      phoneno: this.userForm.value.phone.e164Number
    }
    this.authService.addUser(payload).subscribe((data:any)=>{
      if(data.success){
        
        this.toastr.success(data.message, "Sign Up")
        this.router.navigateByUrl('/otp', { state: { phone: this.userForm.value.phone.e164Number} });
      }
      else{
        this.toastr.error(data.message, "Sign Up")
      }

    },
    error =>{
      
      this.toastr.error(error.message, "Sign Up")
    })
  }
}
