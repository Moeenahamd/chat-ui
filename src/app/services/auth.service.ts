import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://143.198.187.71:5000';
  constructor(private http: HttpClient) { }
  addUser(user:any) {
    return this.http.post(this.baseUrl+'/addUser',user);
  }

  verifyAndSignUpUser(payload:any) {
    return this.http.post(this.baseUrl+'/verifyAndSignUpUser',payload);
  }
  reSendOTP(payload:any) {
    return this.http.post(this.baseUrl+'/reSendOTP',payload);
  }

  adminUpdateUser(token:any,phoneno:string, status:string){
    const obj = {
      "status": status
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    const requestOptions = { headers: headers };
    return this.http.post(this.baseUrl+'/adminUpdateUser/'+phoneno, obj , requestOptions);
  }
  
  adminLogin(payload:any) {
    return this.http.post(this.baseUrl+'/adminLogin',payload);
  }

  getAllUsers() {
    return this.http.get(this.baseUrl+'/getAllUser');
  }
}
