import { Router } from '@angular/router';
import { ServerService } from './../dashboard/Server.Service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-tasksapproval',
  templateUrl: './tasksapproval.component.html',
  styleUrls: ['./tasksapproval.component.scss'],
  animations: [routerTransition()]
})
export class TasksapprovalComponent implements OnInit {
  animal: string;
  name: string;
  rows = [];
  isapproved = false;
  actionie = '';
  myDate : userData1[] = [];
  public data: userData1 = {id:'',username: '',sitename:'',action:'',employee:''};
 displayedColumns = ['select','id', 'name', 'progress','test', 'color','closing','action'];
 dataSource: MatTableDataSource<UserData>;
 tasks: task[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private serverService:ServerService,private router:Router,
  public dialog: MatDialog) {
    // Create 100 users
    this.serverService.readTaskApproval().subscribe((res)=>{
          
            let s = res.json();
            
            console.log(s);
            for (let i of s){
         
            this.tasks.push({
              taskName: i['taskname'],
              taskStaff:i['taskassignedto'],
              taskSite:i['sitename'],
              taskStartTime:i['taskstarttime'],
              taskClosingTime:i['closingtime'],
              taskDescription: i['description'],
            taskid:i['_id']})
            }
           
    const users: UserData[] = [];
     let j:number = 0;
    for (let i of this.tasks) { 
     
      
      users.push(createNewUser(j,
      this.tasks[j].taskName,
      this.tasks[j].taskSite,
      this.tasks[j].taskStaff,
      this.tasks[j].taskStartTime,
      this.tasks[j].taskClosingTime,
      this.tasks[j].taskDescription,
      this.tasks[j].taskid)); 
     j++;}
     // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
        },
        (error)=>{console.log(error)});
    
    
  }


  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
    
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  check(row){
    
    this.myDate.push({      
        id:row['taskid'],
        username:localStorage.getItem('userName'),
        employee:row['test'],
        sitename: row['name'],
        action: row['action']});
  }
  selectedRow(){
  for(var i=0;i<this.myDate.length;i++){
    this.actionie = this.myDate[i].action;
    console.log('123123'+this.myDate[i].sitename);
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: {
         name: localStorage.getItem('userName'),
         sitename: this.myDate[i].sitename, 
         actiontaken:this.myDate[i].action,
         employee: this.myDate[i].employee , 
         action:this.myDate[i].action,
         id:this.myDate[i].id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('OK The dialog was closed' + result['action']);
      console.log(this.data.id+'12'+this.data.action+'123'+this.data.username);
      
      this.data.username = localStorage.getItem('userName');
      this.data.action = result['action'];
      this.data.id = result['id'];
      this.serverService.UpdateTask(this.data.id,this.data.action,this.data.username).subscribe((res)=>{
  console.log(res);
  this.isapproved = true;
},(err)=>{
  alert(err);
})
    });
  this.myDate = [];
  }
 
if(this.isapproved){
  this.router.navigate(['/dashboard']);
}
  }
}

/** Builds and returns a new User. */
function createNewUser(
  id: number,
  siteName: string,
  taskname: string,
  employee: string,
  startTime:string, 
  closingTime:string,
  actionTaken: string,
  taskid: string): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
      
  return {
    id: id.toString(),
    name: taskname,
    progress: siteName,
    color: startTime,
    test: employee,
    closing: closingTime,
    action: actionTaken,
    taskid: taskid
  };
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
  test: string;
  closing: string
  action: string,
  taskid: string
}

interface task{
    taskName: string,
    taskStaff: string,
    taskSite:string,
    taskStartTime: string,
    taskClosingTime: string,
    taskDescription: string,
    taskid: string
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['tasksapproval.component.scss']
})
export class DialogOverviewExampleDialog {
  
  constructor(private serverService:ServerService,private router:Router,
    public dialogRef: MatDialogRef <DialogOverviewExampleDialog>,@Inject(MAT_DIALOG_DATA) public data: userData1) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onConfirm(){
    console.log(this.data.id,this.data.action,this.data.username);
  }

}
 export interface userData1 {
   id: string,
   username:string,
   sitename:string,
   action:string,
   employee: string
 }