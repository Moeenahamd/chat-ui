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
  messageUpdate =false;
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
    await this.client.on("conversationUpdated",(conversation:any ,updateReasons :any)=>{
      this.getAllUsers();
      this.getAllConversations();
      this.messageUpdate = true;
      this.displayMessages(this.selectedConversation,this.selectedIndex)
    })

    await this.client.on("conversationAdded",(conversation:any)=>{
      console.log('Conversation Added')
      this.messageUpdate = false;
      this.getAllConversations();
    })
  }

  async getAllConversations(){
    const conversations = await this.client.getSubscribedConversations();
    this.inboxConversations = [];
    this.doneConversations = [];
    this.spamConversations = [];
    this.conversations = conversations.items;
    if(this.displayConversations.length>0){
      this.sortConversations(this.displayConversations);
    }
    await this.conversations.forEach((element:any) => {
      element.on("messageAdded", (message:any) => {
      });
      const mess:any = this.getLastMessage(element);
      element.latestMessage=mess
      const user = this.users.find((x:any) => x["Phone No"] === element._internalState.uniqueName)
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
    if(!this.messageUpdate){
      this.selectStatus(this.statusSelection);
    }

    
    this.selectConversation()
  }

  selectConversation(){
    
    if(!this.selectedConversation){
      this.selectedConversation = this.displayConversations[0]
    }
    if(!this.messageUpdate)
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
    this.messageUpdate = true;
    this.selectedIndex = 0;
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
      this.sortConversations(this.displayConversations);
      this.displayMessages(this.displayConversations[0],0);
    }
    else if(status == 'done'){
      this.displayConversations = this.doneConversations
      this.sortConversations(this.displayConversations);
      this.displayMessages(this.displayConversations[0],0)
    }
    else if(status == 'spam'){
      this.displayConversations = this.spamConversations
      this.sortConversations(this.displayConversations);
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

  sortConversations(conversations:any){
    this.displayConversations = conversations.sort((a:any, b:any) => {
      if(!a._internalState.lastMessage ||!b._internalState.lastMessage){
        return 0;
      }
      const nameA = a._internalState.lastMessage.dateCreated; // ignore upper and lowercase
      const nameB = b._internalState.lastMessage.dateCreated; // ignore upper and lowercase
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
    
      // names must be equal
      return 0;
    });
  }

}
