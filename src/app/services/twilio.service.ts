import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  baseUrl = 'http://143.198.187.71:5000';
  constructor(private http: HttpClient) { }
  getAccessToken(id:any) {
    return this.http.get(this.baseUrl+'/accessToken/'+id);
  }

  getConversations() {
    return this.http.get(this.baseUrl+'/getAllConversations');
  }

  deleteConversations(conversation:string) {
    return this.http.get(this.baseUrl+'/deleteConversation?conversation='+conversation);
  }

  getConversationMessages(conversation:string) {
    return this.http.get(this.baseUrl+'/conversationMessages?conversation='+conversation);
  }
  sendMessagetoConversation(conversation:string, message:string, user:string){
    const obj ={
      conversation:conversation,
      message:message,
      author:user
    }
    return this.http.post('http://localhost:5000/sendMessage',obj);
  }
}
