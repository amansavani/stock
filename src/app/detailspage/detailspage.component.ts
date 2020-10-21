import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../services/autocomp.service';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MatTabsModule} from '@angular/material/tabs';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css']
})
export class DetailspageComponent implements OnInit {

  tickername:string = '';
  dailypriceObj:object;
  metadataObj:object;
  format: string = "";
  totalPrice: string="0.00";
  change:number;
  changePercent:number;
  timestamp:string;
  marketOpen:boolean=true;
  closeResult:string;
  isStarred:boolean=false;
  numStocks:number;
  validStock:boolean;
  newsDataObject:object;
  currentNews:object;
  month:string[]=["null","January","February","March","April","May","June","July","August","September","October","November","December"];
  
  // alerts start
  

  alerts: Alert[];
  close(alert: Alert) {

    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  
  //alerts end
  constructor(private router:Router, private route:ActivatedRoute, private _autocompservice:AutocompService, private modalService: NgbModal) {this.alerts=[];}

  calculateCost(x){
    this.numStocks=x;
    this.totalPrice=((x*this.dailypriceObj["last"]).toFixed(2)).toString();
    // console.log(this.totalPrice);
  }
  
  open(content) {
    this.totalPrice="0.00";
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    
      // this.totalPrice="0.00";
    // this.numStocks=0;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  buyStock(){
    let new_alert:Alert={type:"success",message:this.metadataObj["ticker"]+" bought successfully!"};
    this.alerts.unshift(new_alert);
    setTimeout(this.close.bind(this),5000,new_alert);
    console.log("must buy "+this.metadataObj["ticker"]+" at rate "+this.dailypriceObj["last"]+" quantity "+this.numStocks+" total cost "+this.totalPrice);
    
    // let purchasedStockList = {};
    // if(localStorage.getItem("purchased")!=null){
    //   purchasedStockList=JSON.parse(localStorage.getItem("purchased"));
    // }
    // let purchasedStockDetails={};
    // if(!purchasedStockList[this.metadataObj["ticker"]]){
    //   purchasedStockDetails["stockQuantity"]=0;
    //   purchasedStockDetails["totalCost"]=0;
    // }
    // else{
    //   purchasedStockDetails=purchasedStockList[this.metadataObj["ticker"]];
    // }
    // purchasedStockDetails["stockQuantity"]=parseFloat(purchasedStockDetails["stockQuantity"])+ this.numStocks;
    // purchasedStockDetails["totalCost"]=parseFloat(purchasedStockDetails["totalCost"])+this.totalPrice;

    // purchasedStockList[this.metadataObj["ticker"]]=purchasedStockDetails;
    // localStorage.setItem("purchased",JSON.stringify(purchasedStockList));

    let purchasedStockList = {};
    if(localStorage.getItem("purchased")!=null){
      purchasedStockList=JSON.parse(localStorage.getItem("purchased"));
    }
    let purchasedStockDetails = {};
    if(!purchasedStockList[this.metadataObj["ticker"]]){ // the ticker name does NOT exists in the list
      purchasedStockList[this.metadataObj["ticker"]]={name:this.metadataObj["name"], stockQuantity:+this.numStocks, totalCost:+this.totalPrice, tickername:this.metadataObj["ticker"]};
    }
    else{
      purchasedStockDetails=purchasedStockList[this.metadataObj["ticker"]];
      // purchasedStockDetails["stockQuantity"]=+parseFloat(purchasedStockDetails["stockQuantity"])+ +this.numStocks;
      purchasedStockDetails["stockQuantity"]+= +this.numStocks;
      // purchasedStockDetails["totalCost"]=+parseFloat(purchasedStockDetails["totalCost"])+ +this.totalPrice;
      purchasedStockDetails["totalCost"]+= +this.totalPrice;
      purchasedStockDetails["totalCost"] = parseFloat(purchasedStockDetails["totalCost"].toFixed(2));
      purchasedStockList[this.metadataObj["ticker"]]=purchasedStockDetails;
    }
    localStorage.setItem("purchased",JSON.stringify(purchasedStockList));
    // localStorage.setItem("purchased",purchasedStockList.toString());

    this.numStocks=0;
  }

  openNewsModal(newscontent,news){

    this.currentNews=news;
    let dateStringArray = this.currentNews["publishedAt"].split('T')[0].split('-');
    // console.log(dateStringArray)
    this.currentNews["publishedAtModified"]=this.month[parseInt(dateStringArray[1])].toString()+" "+dateStringArray[2]+", "+dateStringArray[0];
    this.currentNews["twitterContent"]=this.currentNews["title"].replace(/ /g,"%20")+" "+this.currentNews["url"];
    this.modalService.open(newscontent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  toggle(){
    this.isStarred = !this.isStarred;
    
    // this._success.next(this.metadataObj["ticker"]+ " added to Watchlist.");
    // this._success.subscribe(message => this.successMessage = message);
    // this._success.pipe(
    //   debounceTime(5000)
    // ).subscribe(() => this.successMessage = '');
    let watchlistString=localStorage.getItem("watchlist");
    let watchlist=[];
    if(watchlistString != null){
      watchlist=JSON.parse(watchlistString);
      }
   
    let new_alert:Alert;
    if (this.isStarred){
      // alert:Alert = {type:"success",message:this.metadataObj["ticker"]+" added to Watchlist."};
      
      watchlist.push(this.metadataObj["ticker"]);
      new_alert={type:"success",message:this.metadataObj["ticker"]+" added to Watchlist."}
      
    }
    else{
      if (watchlist.includes(this.metadataObj["ticker"])){
        watchlist.splice(watchlist.indexOf(this.metadataObj["ticker"],1));
      }
      new_alert={type:"danger",message:this.metadataObj["ticker"]+" removed from Watchlist."};
    }
    localStorage.setItem("watchlist",JSON.stringify(watchlist));
    this.alerts.unshift(new_alert);
    setTimeout(this.close.bind(this),5000,new_alert);
    console.log(watchlist);
    // must save data
  }
  ngOnInit(): void {
    this.tickername=this.route.snapshot.paramMap.get('tickername');
    
    this._autocompservice.getMetaData(this.tickername).subscribe(data=>{
      this.metadataObj=data;
      if(this.metadataObj["detail"]=="Not found." || this.tickername==""){
        this.validStock=false;
        this.alerts.unshift({type:"danger",message:"No results found. Please enter valid Ticker"});
        return;
      }
      else{
        this.validStock=true;
      }
      if (JSON.parse(localStorage.getItem("watchlist")).includes(this.metadataObj["ticker"])){
        this.isStarred=true;
      }
      else{
        this.isStarred=false;
      }
    });
    
    this.dailypriceObj=this._autocompservice.getDailyPrice(this.tickername).subscribe(data=>{
      this.dailypriceObj=data;
      this.dailypriceObj=this.dailypriceObj[0];
      this.change = parseFloat((this.dailypriceObj["last"] - this.dailypriceObj["prevClose"]).toFixed(2));
      this.changePercent = parseFloat((this.change / this.dailypriceObj["prevClose"] *100).toFixed(2)); 
      var date =new Date();
      this.marketOpen=true;
      this.timestamp=date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')+" "+String(date.getHours()).padStart(2,'0')+":"+String(date.getMinutes()).padStart(2,'0')+":"+String(date.getSeconds()).padStart(2,'0');
      // console.log(this.changePercent);
      if (this.dailypriceObj["bidPrice"]==null && this.dailypriceObj["bidSize"]==null && this.dailypriceObj["askSize"]==null && this.dailypriceObj["askPrice"]==null){
        this.format = this.dailypriceObj["timestamp"].slice(0,10)+" "+this.dailypriceObj["timestamp"].slice(11,19)
        this.marketOpen=false;
      }
      
    });
    // this.apiCall();
    // setInterval(this.apiCall,5000);

    this._autocompservice.getNewsData(this.tickername).subscribe(data=>{this.newsDataObject=data;});
    
      
    
  }

  // apiCall(){

  //   this.dailypriceObj=this._autocompservice.getDailyPrice(this.tickername).subscribe(data=>{
  //     this.dailypriceObj=data;
  //     this.dailypriceObj=this.dailypriceObj[0];
  //     this.change = parseFloat((this.dailypriceObj["last"] - this.dailypriceObj["prevClose"]).toFixed(2));
  //     this.changePercent = parseFloat((this.change / this.dailypriceObj["prevClose"] *100).toFixed(2)); 
  //     var date =new Date();
  //     this.marketOpen=true;
  //     this.timestamp=date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')+" "+String(date.getHours()).padStart(2,'0')+":"+String(date.getMinutes()).padStart(2,'0')+":"+String(date.getSeconds()).padStart(2,'0');
  //     // console.log(this.changePercent);
  //     if (this.dailypriceObj["bidPrice"]==null && this.dailypriceObj["bidSize"]==null && this.dailypriceObj["askSize"]==null && this.dailypriceObj["askPrice"]==null){
  //       this.format = this.dailypriceObj["timestamp"].slice(0,10)+" "+this.dailypriceObj["timestamp"].slice(11,19)
  //       this.marketOpen=false;
  //     }
  //     console.log(data);
      
  //   });
    
  // }

}
