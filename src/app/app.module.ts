import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MobileSignUpComponent } from './auth/mobile-sign-up/mobile-sign-up.component';
import { MobileOtpComponent } from './auth/mobile-otp/mobile-otp.component';
import { MobileChatComponent } from './user/mobile-chat/mobile-chat.component';
import { MessagesComponent } from './admin/messages/messages.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MobileSignUpComponent,
    MobileOtpComponent,
    MobileChatComponent,
    MessagesComponent,
    AdminLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
