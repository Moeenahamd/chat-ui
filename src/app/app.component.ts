import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import {Client, Participant, State} from "@twilio/conversations";
import { TwilioService } from './services/twilio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'chat-ui';
  client: any;
  conversation: any;
  constructor(private twilioService: TwilioService){
    
  }
  ngOnInit(): void {
    // this.twilioService.getConfig('').subscribe((data:any)=>{
    //   this.createConversation(data.token);
    // })
  }
  

  async createConversation(token:any){
    this.client = await new Client(token);
    console.log(this.client)
    this.client.on("conversationUpdated",(conversation:any ,updateReasons :any)=>{
      console.log(conversation)
    })
    this.conversation = await this.client.getConversationBySid("CH154734ad7ea44f189b6a18ffc82c79a8")
    // this.conversation = await this.client.createConversation({
    //   attributes: {},
    //   friendlyName: "Hamza Hassan",
    //   uniqueName: "+923458616804",
    // });
    // await this.conversation.add('12345')
    // await this.conversation.join();
    await this.conversation.on("messageAdded", (message:any) => {
      console.log(message)
      // Fired when data of a message has been updated.
    });
    const payload = await this.client.getSubscribedConversations()
    payload.items.forEach((data:any)=>{
      data.on("messageAdded", (message:any) => {
        console.log(message)
        // Fired when data of a message has been updated.
      });
    })
    //await this.conversation.sendMessage('hello world');
      //this.conversation.sendMessage("Hello Mansha")
  }
}
