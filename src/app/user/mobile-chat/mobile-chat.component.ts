import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from '@twilio/conversations';
import { AuthService } from 'src/app/services/auth.service';
import { TwilioService } from 'src/app/services/twilio.service';

@Component({
  selector: 'app-mobile-chat',
  templateUrl: './mobile-chat.component.html',
  styleUrls: ['./mobile-chat.component.css']
})
export class MobileChatComponent implements OnInit{

  @ViewChild('scrollBottom') scrollBottom: any;
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
  userId:string ='';
  displayModal = "block";
  constructor(
    private twilioService: TwilioService,
    private actRoute: ActivatedRoute) { }
  ngOnInit(): void {
    const userAgent = window.navigator.userAgent;
    this.userId = this.actRoute.snapshot.params['id'];
    this.twilioService.getUserByUserId(this.userId).subscribe((data:any)=>{
      this.initClient(data.token);
    })
    
  }

  confirmAmazon(answer:string) {
    this.displayModal = "none";
    this.twilioService.confirmAmazonStatus(this.userId,answer).subscribe((res:any)=>{
      
    })
    this.scrollToBottom()
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

  scrollToBottom(): void {
    try {
        this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  async displayMessages(){
    this.isLoading = true;
    const messages = await this.conversation.getMessages(1000);
    this.messages = messages.items
    setTimeout(()=>{
      this.scrollToBottom()},500)
  }

  async sendMessage(){
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
