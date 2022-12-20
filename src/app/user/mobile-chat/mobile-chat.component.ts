import { Component, OnInit } from '@angular/core';
import { Client } from '@twilio/conversations';
import { AuthService } from 'src/app/services/auth.service';
import { TwilioService } from 'src/app/services/twilio.service';

@Component({
  selector: 'app-mobile-chat',
  templateUrl: './mobile-chat.component.html',
  styleUrls: ['./mobile-chat.component.css']
})
export class MobileChatComponent implements OnInit {

  user:string = '923406929265'
  isEmojiPickerVisible =false;
  client: any;
  conversation: any;
  messages:any;
  adminUser = 'admin'
  message:any;
  token:any;
  users:any[]=[];
  isMessages = false;
  isLoading = false;
  constructor(
    private twilioService: TwilioService,
    private authService: AuthService) { }

  ngOnInit(): void {
    var userPhone = localStorage.getItem('userPhone')?.replace('+','');
    this.twilioService.getAccessToken(userPhone).subscribe((data:any)=>{
      this.initClient(data.token);
    })
  }

  async initClient(token:any){
    this.client = await new Client(token);
    const conversation = await this.client.getSubscribedConversations();
    this.conversation = conversation.items[0]
    this.displayMessages()
    this.conversation.on("messageAdded",(conversation:any)=>{
      this.displayMessages()
    })

    //this.getAllConversations()
  }

  async displayMessages(){
    this.isLoading = true;
    const messages = await this.conversation.getMessages();
    this.messages = messages.items
  }

  async sendMessage(){
    console.log(this.message.length)
    if( this.message && this.message != '')
    {
      await this.conversation.sendMessage(this.message);
      this.message = '';
    }
  }

  addEmoji(event:any) {
    this.message = this.message? `${this.message}${event.emoji.native}`:`${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }
 
}
