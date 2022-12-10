import { Component, ElementRef, OnInit } from '@angular/core';
import { Client, State } from '@twilio/conversations';
import { AuthService } from 'src/app/services/auth.service';
import { TwilioService } from 'src/app/services/twilio.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  client: any;
  conversation: any;
  constructor(
    private twilioService: TwilioService,
    private authService: AuthService,
    private elementRef: ElementRef) { }
  adminUser= 'admin'
  selectedIndex: any;
  clicked :any
  statusSelection = 'inbox';
  conversations:any;
  inboxConversations:any[] =[];
  doneConversations:any[] =[];
  spamConversations:any[] =[];
  displayConversations: any[]=[];
  selectedConversation:any;
  messages:any;
  section = 'inbox';
  message:any;
  token:any;
  users:any[]=[];
  isMessages = false;
  toggle = false;
  isLoading = false;
  toggleDropDown(){
    this.toggle = !this.toggle;
  }
  ngOnInit(): void {
    const dom: HTMLElement = this.elementRef.nativeElement;
    const elements = dom.querySelectorAll('.side_nav ul li');
    console.log(elements);
    this.getAllUsers()
    this.twilioService.getAccessToken('admin').subscribe((data:any)=>{
      this.initClient(data.token);
    })
  }

  async getAllUsers(){
    await this.authService.getAllUsers().subscribe((data:any)=>{
      this.users = data.usersData
    })
  }

  async initClient(token:any){
    this.client = await new Client(token);
    console.log(this.client.getSubscribedConversations())
    this.client.on("conversationUpdated",(conversation:any ,updateReasons :any)=>{
      this.getAllConversations();
      this.displayMessages(this.selectedConversation)
    })

    this.client.on("conversationAdded",(conversation:any)=>{
      this.getAllConversations();
    })
    this.getAllConversations()
  }

  async getAllConversations(){
    const conversations = await this.client.getSubscribedConversations();
    this.inboxConversations = [];
    this.doneConversations = [];
    this.spamConversations = [];
    this.conversations = conversations.items;
    this.conversations.forEach((element:any) => {
      const mess:any = this.getLastMessage(element);
      element.latestMessage=mess
      const user = this.users.find((x:any) => x["Phone No"] === element._internalState.uniqueName)
      console.log(user)
      if(user && user.Status == 'inbox'){
        this.inboxConversations.push(element)
      }
      else if((user && user.Status == 'Done') || (user &&  user.Status == 'done')){
        this.doneConversations.push(element)
      }
      else if(user && user.Status == 'spam'){
        this.spamConversations.push(element)
      }
    });
    this.selectStatus(this.statusSelection);

    if(this.conversations.length>0){
      // this.conversations = this.conversations.sort((a:any, b:any) => {
      //   const nameA = a._internalState.lastMessage.dateCreated; // ignore upper and lowercase
      //   const nameB = b._internalState.lastMessage.dateCreated; // ignore upper and lowercase
      //   if (nameA < nameB) {
      //     return -1;
      //   }
      //   if (nameA > nameB) {
      //     return 1;
      //   }
      
      //   // names must be equal
      //   return 0;
      // });
    }
    this.selectConversation()
    await this.conversations.forEach((data:any)=>{
      data.on("messageAdded", (message:any) => {
      });
    })
  }

  selectConversation(){
    if(!this.selectedConversation){
      this.selectedConversation = this.displayConversations[0]
    }
    this.displayMessages(this.selectedConversation,0)
  }
  async displayMessages(conversation:any, index?:number){
    this.selectedIndex = index;
    this.selectedConversation = conversation
    this.isLoading = true;
    const messages = await this.selectedConversation.getMessages();
    this.messages = messages.items
    this.isMessages = true;
  }

  async sendMessage(){
    await this.selectedConversation.sendMessage(this.message);
    this.message = '';
  }

  async getLastMessage(conversation:any){
    const lastMessage = await conversation.getMessages()
    const index = lastMessage && await conversation.lastMessage;
    let mess:string =index && lastMessage.items[index.index].state.body;
    return mess;
  }
  selectStatus(status:string){
    this.statusSelection = status;
    if(status == 'inbox'){
      this.displayConversations = this.inboxConversations
      this.displayMessages(this.displayConversations[0],0)
    }
    else if(status == 'done'){
      this.displayConversations = this.doneConversations
      this.displayMessages(this.displayConversations[0],0)
    }
    else if(status == 'spam'){
      this.displayConversations = this.spamConversations
      this.displayMessages(this.displayConversations[0],0)
    }
  }

  markStatus(status:string){
    const adminToken = localStorage.getItem('adminToken');
    this.authService.adminUpdateUser(adminToken,this.selectedConversation._internalState.uniqueName,status).subscribe((data:any)=>{
      this.getAllUsers();
      this.getAllConversations()
    })
  }

}
