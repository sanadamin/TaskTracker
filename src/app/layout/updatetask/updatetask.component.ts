import { ServerService } from './../dashboard/Server.Service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-updatetask',
  templateUrl: './updatetask.component.html',
  styleUrls: ['./updatetask.component.scss'],
    animations: [routerTransition()]

})
export class UpdatetaskComponent implements OnInit {
  isClicked = false;
  Taskid='';
  pendingchoices:any[] = [];
  pendingchoice:string = '';
  pendingArray:any [] = [];
  enitiesmodel:entity[] = [];
  entitieshistory:entity1[] = [];
  budgetline = '';
  isPending = false;
  budgetreserved = '';
  actualbudget = '';
  TaskName = '';
  progress = '';
  RelatedPR = '';
  PRnumber = '';
  PRStatus = '';
  RelatedPO = '';
  PONumber = '';
  POStatus = '';
  duedate = '';
  taskdelegate = '';
  prstatus = '';
  project = '';
  myentitiesarray=[];
  ispendingloaded = false;
  mystringarray = [];
  emps: string = 'Please Select Employee';
  emps1:employee[] = [];
  employeename = '';
  Updatedescription = '123';
  myres: tasks[] = [];
  lastupdate = '';
  isloaded = false;
  displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private serverService:ServerService) {

    this.serverService.getDivs().subscribe((res)=>{
      
        let empJson = res.json();
        let ind = 0;
        for (let emp of empJson){
          this.pendingchoices.push({id: ind,name: emp['name']});
          ind++;
        }
       
         this.ispendingloaded = true;
         this.emps1 = [...this.emps1];
    })
     const users: UserData[] = [];
    for (let i = 1; i <= 100; i++) { ; }

    // Assign the data to the data source for the table to render
    this.serverService.getempdata(localStorage.getItem('userName')).subscribe((res)=>{
            
          let newres = res.json();
          this.employeename = newres['name'];  
          this.serverService.GetAlltasks1(this.employeename).subscribe((res)=>{
          let myres22 = res.json();
          let myind = 0;
          for(let j of myres22){
             this.serverService.GetAlltasks2(j['name']).subscribe((res)=>{
      let myres1 = res.json();
      
      for (let s of myres1){
        this.myres.push({id:s['_id'],taskname:s['taskname'],description:s['description'],progress:s['progress'],taskid:s['_id']});
        users.push(createNewUser(myind,s['taskname'],s['description'],s['progress'],s['taskid']));
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        myind++;
      }
    })
          }
        });
      
        });
        
    
this.serverService.getEmps().subscribe((res)=>{
      console.log(res.json());
        let empJson = res.json();
        let ind = 0;
        for (let emp of empJson){
          this.emps1.push({id: ind,name: emp['name']});
          ind++;
        }
       
         this.isloaded = true;
         this.emps1 = [...this.emps1];
    })
   }
LoadTask(row){
  console.log(row.id);
 
  this.serverService.GetTaskByID(this.myres[row.id]['taskid']).subscribe((res)=>{
    let thisres = res.json();
    this.Taskid= thisres['_id'];
    this.TaskName = thisres['taskname'];
    this.progress = thisres['progress'];
    this.duedate = thisres['duedate'];
    this.PRnumber = thisres['relatedpr']['prnumber'];
    this.PRStatus = thisres['relatedpr']['prstatus'];
    this.PONumber = thisres['relatedpo']['ponumber'];
    this.POStatus = thisres['relatedpo']['postatus'];
     this.budgetline = thisres['budgetline'];
    this.actualbudget = thisres['actualbudget'];
    this.budgetreserved = thisres['budgetamount'];
    for(let s of thisres['updates']){
      this.lastupdate = s['value'];
     
    }
    this.myentitiesarray =[];
    this.enitiesmodel = [];
    this.entitieshistory = [];
    this.pendingArray = [];
    for(let i of thisres['effectedentities']){
      this.myentitiesarray.push({entityname:i['entityname'],entityupdate:i['entityupdate'],entitydueduate:i['entityduedate']});
      this.enitiesmodel.push({entityname:i['entityname'],entityupdate:i['entityupdate'], entityduedate:i['entityduedate'],updater:localStorage.getItem('userName')});
      console.log("123123123"+this.enitiesmodel[0]['updater']);
      this.entitieshistory.push({entityname:i['entityname'],entityupdate:i['entityupdate'],entityduedate:i['entityduedate']});
    //  alert(this.enitiesmodel[0].entityname);
  }
  for(let i of thisres['pending']){
    if(i['pendingon']){
      this.isPending = true;
      this.pendingArray.push({pendingon:i['pendingon'],subtask:i['subtask'],startdate:i['startdate'],enddate:i['enddate'],result:i['feedback']});
      
    }
    
  }
  this.Updatedescription = this.lastupdate;
  this.isClicked = true;
  })
}
  ngOnInit() {
  }
DelegateTo(){
  this.serverService.UpdatePedning(this.Taskid,this.pendingchoice,this.taskdelegate).subscribe((res)=>{
    alert('Task ' + this.taskdelegate + ' Delgated');
    this.serverService.AddPending(this.Taskid,this.pendingchoice,this.taskdelegate,'').subscribe((res)=>{
    alert('Task Delegated');
    this.serverService.getEmps().subscribe((res)=>{
      console.log(res.json());
        let empJson = res.json();
        let ind = 0;
        for (let emp of empJson){
          this.emps1.push({id: ind,name: emp['name']});
          ind++;
        }
         this.isClicked = false;
         this.isloaded = true;
         this.emps1 = [...this.emps1];
    })
   
  })
  })
  console.log(this.Taskid);
  
}
  UpdateTask(){
  
    let username = localStorage.getItem('userName');
     this.serverService.UpdateTaskHistory(this.Taskid,this.entitieshistory).subscribe((res)=>{
       alert(this.PONumber);
      this.serverService.UpdateTaskTracker(this.Taskid,this.progress,this.duedate,this.PRnumber,this.RelatedPO,this.Updatedescription,username,this.enitiesmodel,this.PRStatus,this.PONumber,this.POStatus,this.actualbudget,this.budgetreserved,this.budgetline).subscribe((res)=>{
alert('Task Updated');
this.serverService.getEmps().subscribe((res)=>{
      console.log(res.json());
        let empJson = res.json();
        let ind = 0;
        for (let emp of empJson){
          this.emps1.push({id: ind,name: emp['name']});
          ind++;
        }
         this.isClicked = false;
         this.isloaded = true;
         this.emps1 = [...this.emps1];
    })
this.isClicked = false;
this.entitieshistory = [];
      })
      
    });
  
  }
// ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
interface tasks{
  id: string,
  taskname:string,
  description:string,
  progress: string,
  taskid : string
}
function createNewUser(id: number,taskname: string,taskdescription:string,progress:string, taskid:string): UserData {
  

  return {
    id: id.toString(),
    name: taskname,
    progress: taskdescription,
    color: progress,
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
  taskid: string;
}
interface employee {
   id:number,
   name:string
 }
 interface entity{
   entityname:string,
   entityupdate:string,
   updater:string,
   entityduedate:any
 }
 interface entity1{
   entityname:string,
   entityupdate:string,entityduedate:any

 
 }

