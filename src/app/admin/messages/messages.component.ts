import { Component, ElementRef, OnInit } from '@angular/core';
import { Client, State } from '@twilio/conversations';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService) { }
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
      this.messageUpdate = false;
      this.getAllConversations();
    })
  }

  async initClient(token:any){
    this.client = await new Client(token);
    await this.client.on("conversationUpdated",(conversation:any ,updateReasons :any)=>{
      this.messageUpdate = true;
      var temp = this.users.find(x=>x["Phone No"] == conversation.conversation.uniqueName)
      if(temp.Status == 'done' ){
        const adminToken = localStorage.getItem('adminToken');
        this.authService.adminUpdateUser(adminToken,conversation.conversation.uniqueName,'inbox').subscribe((data:any)=>{
          this.getAllUsers();
        },
        error=>{
          if(error.status == 200){
            this.getAllUsers(); 
          }
        })
      }
      else{
        this.getAllConversations();
        this.displayMessages(this.selectedConversation,this.selectedIndex)
      }
    })

    await this.client.on("conversationAdded",(conversation:any)=>{
      this.getAllUsers();
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
      this.selectedIndex = this.displayConversations.findIndex((x:any)=>x.sid == this.selectedConversation.sid);
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
    
    this.selectedConversation.updateLastReadMessageIndex(this.messages.length - 1)
    this.isMessages = true;
  }

  async sendMessage(){
    if( this.message && this.message != '' && this.message != '\n')
    {
      await this.selectedConversation.sendMessage(this.message);
      this.message = '';
      this.messageUpdate = true;
      this.selectedIndex = 0;
    }
  }

  async getLastMessage(conversation:any){
    const lastMessage = await conversation.getMessages()
    const index = lastMessage && await conversation.lastMessage;
    let unread= false;
    if(index && conversation.lastReadMessageIndex < index.index){
      unread= true;
    }
    let mess:string =index && lastMessage.items[index.index].state.body;
    const obj = {
      "message":mess,
      "unread":unread
    }
    return obj;
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
      
      this.toastr.success('Conversation moved to ' + status, "Status")
    },
    error=>{
      if(error.status == 200){
        this.getAllUsers(); 
        this.toastr.success('Conversation moved to ' + status, "Status")
      }
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
