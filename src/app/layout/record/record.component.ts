import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { Component, OnInit,ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { ServerService } from './../dashboard/Server.Service';


@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
  animations: [routerTransition()]
})
export class RecordComponent implements OnInit {
 
 isClicked =false;
 displayedColumns = ['id','statuscolor',  'progress','date','name','test', 'color','myprogress'];
 dataSource: MatTableDataSource<UserData>;
 tasks: task[] = [];
 ss = [];
 rows= [];
 status_Color = "assets/images/green.png";
 columns:any = [];
 columns1:any = [];
 updatesarray:updates[] = [];
 recordTemplate: recordTemp[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private serverService:ServerService) {
    // Create 100 users
    this.serverService.GetAlltasks().subscribe((res)=>{
            
            let s = res.json();
            this.ss = s;
            console.log(s);
            for (let i of s){
              // let sj = i['associatedprs'];
              // let prs = '';
              // for(let ij of sj)
              // {
                
              //   prs = prs + ij['prname'] + ' (' + ij['prstatus'] + ')' + '\n';
              // }
              let factor = 0;
              let days = 0;
              let date = new Date();
              let ddate =new Date(i['duedate']);
              alert();
              
              
              days = Math.ceil((date.getTime() - ddate.getTime()) / (1000 * 3600 * 24))
                if(days>0){
                  this.status_Color = "assets/images/red.png";
                }else{
                  if(Math.abs(days)>3){
                    this.status_Color = "assets/images/green.png";
                  }else{
                    this.status_Color = "assets/images/orange.png";
                  }
                  
                }
let entitystring = '';
let prstring = '';
let postring = '';
let effectedentitiesstring = '';
for(let entity of i['entitieshistory']){
  entitystring = entitystring + entity['entityname'] +'%$#' + entity['entityupdate'] +'%$#' + entity['entityduedate'] + '\n'; 
}
for(let pr of i['relatedpr']){
  prstring = prstring + pr['prnumber'] +'%$#' + pr['prstatus']  + '\n'; 
}
for(let pr of i['relatedpo']){
  postring = postring + pr['ponumber'] +'%$#' + pr['postatus'] + '\n'; 
}
for(let eent of i['effectedentities']){
  effectedentitiesstring = effectedentitiesstring + eent['entityname'] +'%$#' + eent['entityupdate'] +'%$#' + eent['dateofupdate'] +'%$#'+eent['updater'] +'%$#'+eent['entityduedate'] +'%$#' + '\n'; 
}
              
              this.recordTemplate.push({
duedate: i['duedate'],
  taskdate: i['taskdate'],
  project: i['project'],
  tasktype: i['tasktype'],
  taskowner: i['taskowner'],
  description:i['description'],
  taskname:i['taskname'],
  closer: i['closer'],
  closestatus: i['closestatus'],
  closedate:i['closedate'],
  relatedpr:prstring,
  relatedpo:postring,
  entitieshistory:entitystring,
  effectedentities:effectedentitiesstring
              });
            
     
            this.tasks.push({
              taskName: i['taskname'],
              taskStaff:i['description'],
              taskSite:i['project'],
              taskStartTime:i['duedate'],
              actiontaken: i['taskownmer'],
              progress:i['progress'],
              taskid:i['_id'],
              statuscolor:this.status_Color
             })
            }
            
           
    const users: UserData[] = [];
     let j:number = 0;
    for (let i of this.tasks) { 
     let date = new Date();
     
      users.push(createNewUser(j,
      this.tasks[j].taskName,
      this.tasks[j].taskSite,
      this.tasks[j].taskStaff,
      this.tasks[j].taskStartTime,
      this.tasks[j].actiontaken,
      this.tasks[j].progress,
      this.tasks[j].statuscolor
      )); 
     j++;}
     
     // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        },
        (error)=>{console.log(error)});
    
    
  }
LoadTask(row)
{
  this.columns = [];
  this.columns1 = [];
  
  this.serverService.GetTaskByID(this.tasks[row['id']]['taskid']).subscribe((res)=>{
    let  myupdates = res.json();
    let updatesarray1 = myupdates['entitieshistory'];
    let entitiesupdates = myupdates['effectedentities'];
    for(let ii of entitiesupdates){
     
      this.updatesarray.push({update:ii['entityname'],date:ii['dateofupdate'],updater:ii['entityupdate']});
      for(let jj of updatesarray1){
          let temparray= [];
        if(ii['entityname'] === jj['entityname']){
          if(jj['entityupdate'] != ''){
                      this.columns.push({name:ii['entityname'],update:jj['entityupdate'],dateofupdate:jj['dateofupdate'],updater:jj['updater'],entityduedate:jj['entityduedate']});
          }  
      
     
        }
      
    }
    }
    
    
  })
this.serverService.GetTaskByID(this.tasks[row['id']]['taskid']).subscribe((res)=>{
    let  myupdates = res.json();
    let updatesarray1 = myupdates['effectedentities'];
    let entitiesupdates = myupdates['effectedentities'];
    for(let ii of entitiesupdates){
     
      this.updatesarray.push({update:ii['entityname'],date:ii['dateofupdate'],updater:ii['entityupdate']});
      for(let jj of updatesarray1){
          let temparray= [];
        if(ii['entityname'] === jj['entityname']){
          this.columns1.push({name:ii['entityname'],update:jj['entityupdate'],dateofupdate:jj['dateofupdate'],updater:jj['updater'],entityduedate:jj['entityduedate']});
         
      
     
        }
      
    }
    }
    
    
  })
  this.isClicked = true;
}
check(row){
  this.rows.push(row['taskid']);
  for(var i=0;i<this.rows.length;i++){
  }
  
}
  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
OnAddTask(){
    console.log('asd');
    this.serverService.AddTask().subscribe();
}
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator;

  }
eventClicked(){
  this
new Angular2Csv(this.recordTemplate, 'My Report',{headers: ['Date','Employee Name','Site Name','Task Category','Task Name','Consumed Time','Charging Time','Action Taken','Approved By','Start Time','Acknowledge Time','Site Entered Time','Closing Time']});
  }
  
}

/** Builds and returns a new User. */
function createNewUser(
  id: number,
  siteName: string,
  taskname: string,
  employee: string,
  startTime:string,
  action:string,
  myprogress:string,
  statuscolor:string
  ): UserData {
  
  return {
    id: id.toString(),
    name: taskname,
    progress: siteName,
    color: startTime,
    test: employee,
    date:action,
    myprogress:myprogress,
    statuscolor:statuscolor
   

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
  date:string,
  myprogress:string,
  statuscolor:string
  
}

interface task{
    taskName: string,
    taskStaff: string,
    taskSite:string,
    taskStartTime: string,
    actiontaken:string,
    progress:string,
    taskid:string,
    statuscolor: string
    
}

interface recordTemp{
  duedate: String,
  taskdate: String,
  project: String,
  tasktype: String,
  taskowner: String,
  description:String,
  taskname:String,
  closer: String,
  closestatus: String,
  closedate:String,
  relatedpr:String,
  relatedpo:String,
  entitieshistory:String,
  effectedentities:string

 
}
interface updates{
  update:string,
  date:string,
  updater:string
}

interface history{
  entityname:   string,
  entityupdate: string,
  entityduedate:string
}