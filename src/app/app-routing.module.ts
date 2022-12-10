import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './admin/messages/messages.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { MobileOtpComponent } from './auth/mobile-otp/mobile-otp.component';
import { MobileSignUpComponent } from './auth/mobile-sign-up/mobile-sign-up.component';
import { MobileChatComponent } from './user/mobile-chat/mobile-chat.component';

const routes: Routes = [
  {path:'messages', component:MessagesComponent},
  {path:'log-in', component:AdminLoginComponent},
  {path:'sign-up', component:MobileSignUpComponent},
  {path:'otp', component:MobileOtpComponent},
  {path:'chat', component:MobileChatComponent},
  {path:'', component:AdminLoginComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
