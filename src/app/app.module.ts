import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { MobileSignUpComponent } from './auth/mobile-sign-up/mobile-sign-up.component';
import { MobileOtpComponent } from './auth/mobile-otp/mobile-otp.component';
import { MobileChatComponent } from './user/mobile-chat/mobile-chat.component';
import { MessagesComponent } from './admin/messages/messages.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    MobileSignUpComponent,
    MobileOtpComponent,
    MobileChatComponent,
    MessagesComponent,
    AdminLoginComponent,
    HomeComponent
      ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxIntlTelInputModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
