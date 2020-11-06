import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../services/autocomp.service';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import * as Highcharts from 'highcharts/highstock';
import HC_stock from 'highcharts/modules/stock';
import { Subscription, timer } from 'rxjs';
import { switchMap, timeout } from 'rxjs/operators';
import vbp from 'highcharts/indicators/volume-by-price';
import sma from 'highcharts/indicators/indicators';
import ohlc from 'highcharts/indicators/indicators';
import IndicatorsCore from "highcharts/indicators/indicators";

IndicatorsCore(Highcharts);
// import * as Indicators from "highcharts/indicators/indicators";
HC_stock(Highcharts);
ohlc(Highcharts);
sma(Highcharts);
vbp(Highcharts);

interface Alert {
  type: string;
  message: string;
  starred: boolean;
}

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css']
})
export class DetailspageComponent implements OnInit {


  DailyHighcharts: typeof Highcharts = Highcharts;
  HighchartsSMA: typeof Highcharts = Highcharts;
  // DailyChartOptions: Highcharts.Options = {
  //   series: [{
  //     data: [1, 2, 3],
  //     showInNavigator:true,
  //     type: 'line',
  //     tooltip: {
  //       valueDecimals: 2
  //       },
  //   }],
  //   yAxis:{
  //     opposite: true,
  //     className: undefined,
  //     title:{
  //       text: "",
  //     }
  //   },
  //   navigator: {
  //     enabled: true,      
  // },
  //   title: {
  //     text: 'AAPL'
  //   },
  //   rangeSelector: {
  //       enabled:false,
  //   },
  // };
  DailyChartOptions: Highcharts.Options;
  ChartOptionsSMA: Highcharts.Options;
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
  newsDataObject=[];
  currentNews:object;
  month:string[]=["null","January","February","March","April","May","June","July","August","September","October","November","December"];
  dataReady:boolean;
  subscription: Subscription;
  chartdata;
  chartColor;
  // alerts start
  

  alerts: Alert[];
  close(alert: Alert) {
    if (this.alerts.includes(alert)){
      this.alerts.splice(this.alerts.indexOf(alert), 1);
    }
  }

  
  //alerts end
  constructor(private router:Router, private route:ActivatedRoute, private _autocompservice:AutocompService, private modalService: NgbModal) {this.alerts=[];}

  calculateCost(x){
    this.numStocks=x;
    if(x<=0){
      this.totalPrice="0.00";
    }
    else{

      this.totalPrice=((x*this.dailypriceObj["last"]).toFixed(2)).toString();
    }
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
    let new_alert:Alert={type:"success",message:this.metadataObj["ticker"]+" bought successfully!",starred:false};
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
    this.currentNews["twitterContent"]=this.currentNews["title"].replace(/\%/g,"%25").replace(/ /g,"%20")+" "+this.currentNews["url"];
    this.modalService.open(newscontent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  toggle(){
    this.isStarred = !this.isStarred;
    
    let watchlistString=localStorage.getItem("watchlist");
    let watchlist={};
    if(watchlistString != null){
      watchlist=JSON.parse(watchlistString);
      }
   
    let new_alert:Alert;
    if (this.isStarred){
      // alert:Alert = {type:"success",message:this.metadataObj["ticker"]+" added to Watchlist."};
      
      watchlist[this.metadataObj["ticker"]]={tickername:this.metadataObj["ticker"],name:this.metadataObj["name"]};
      new_alert={type:"success",message:this.metadataObj["ticker"]+" added to Watchlist.",starred:true}
      
    }
    else{
      if (watchlist.hasOwnProperty(this.metadataObj["ticker"])){
        delete watchlist[this.metadataObj["ticker"]];
      }
      new_alert={type:"danger",message:this.metadataObj["ticker"]+" removed from Watchlist.",starred:true};
    }
    localStorage.setItem("watchlist",JSON.stringify(watchlist));
    for(var i=0;i<this.alerts.length;i++){
      if(this.alerts[i]["starred"]==true){
        this.alerts.splice(i,1);
        break;
      }
    }
    this.alerts.unshift(new_alert);
    setTimeout(this.close.bind(this),5000,new_alert);
    console.log(watchlist);
    // must save data
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  replaceNullWithDashes(){
    var keys = Object.keys(this.dailypriceObj);
    keys.forEach(element => {
      if(this.dailypriceObj[element]==null){
        this.dailypriceObj[element]='-';
      }
    });

  }

  ngOnInit(): void {
    this.tickername=this.route.snapshot.paramMap.get('tickername');
    
    this._autocompservice.getMetaData(this.tickername).subscribe(data=>{
      this.metadataObj=data;
      if(this.metadataObj["detail"]=="Not found." || this.tickername==""){
        this.validStock=false;
        this.alerts.unshift({type:"danger",message:"No results found. Please enter valid Ticker",starred:false});
        this.dataReady=true;
        return;
      }
      else{
        this.validStock=true;
      }
      try {
        if (JSON.parse(localStorage.getItem("watchlist"))[this.metadataObj["ticker"]]){
          this.isStarred=true;
        }
        else{
          this.isStarred=false;
        }
      } catch (error) {
        
      }
     
    });
   
    // this.dailypriceObj=this._autocompservice.getDailyPrice(this.tickername).subscribe(data=>{
    //   this.dailypriceObj=data;
    //   this.dailypriceObj=this.dailypriceObj[0];
    //   this.change = parseFloat((this.dailypriceObj["last"] - this.dailypriceObj["prevClose"]).toFixed(2));
    //   this.changePercent = parseFloat((this.change / this.dailypriceObj["prevClose"] *100).toFixed(2)); 
    //   var date =new Date();
    //   this.marketOpen=true;
    //   this.timestamp=date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')+" "+String(date.getHours()).padStart(2,'0')+":"+String(date.getMinutes()).padStart(2,'0')+":"+String(date.getSeconds()).padStart(2,'0');
    //   // console.log(this.changePercent);
    //   if (this.dailypriceObj["bidPrice"]==null && this.dailypriceObj["bidSize"]==null && this.dailypriceObj["askSize"]==null && this.dailypriceObj["askPrice"]==null){
    //     this.format = this.dailypriceObj["timestamp"].slice(0,10)+" "+this.dailypriceObj["timestamp"].slice(11,19)
    //     this.marketOpen=false;
    //   }
    //   this.dataReady=true;
      
    // });

  this.subscription=timer(0,15000).pipe(switchMap(()=>this._autocompservice.getDailyPrice(this.tickername))).subscribe(data=>{
      this.dailypriceObj=data;
      this.dailypriceObj=this.dailypriceObj[0];
      this.change = parseFloat((this.dailypriceObj["last"] - this.dailypriceObj["prevClose"]).toFixed(2));
      if(this.change<0){
        this.chartColor='red';
      }
      else if(this.change==0){
        this.chartColor='black';
      }
      else{
        this.chartColor='#407f44';
      }
      this.changePercent = parseFloat((this.change / this.dailypriceObj["prevClose"] *100).toFixed(2)); 
      var date =new Date();
      this.marketOpen=true;
      this.timestamp=date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')+" "+String(date.getHours()).padStart(2,'0')+":"+String(date.getMinutes()).padStart(2,'0')+":"+String(date.getSeconds()).padStart(2,'0');
      
      //Date from API "timestamp"
      var t2 = date.getTime(); //current time
      var tempInput = this.dailypriceObj["timestamp"];
      var dateM = new Date(tempInput);
      var t1 = dateM.getTime(); // time from api
      // this.format = dateU.getFullYear() + "-" + ("0" + (+dateU.getMonth() + 1)).slice(-2) + "-" + ("0" + dateU.getDate()).slice(-2) + " " + time
      // console.log(t2);
      // console.log(t1);
      // console.log(this.changePercent);
      if ( t2-t1>60000){
        this.format = this.dailypriceObj["timestamp"].slice(0,10)+" "+(parseFloat(this.dailypriceObj["timestamp"].slice(11,13))-8).toString()+this.dailypriceObj["timestamp"].slice(13,19);
        // this.format = dateM.getFullYear() + "-" + ("0" + (+dateM.getMonth() + 1)).slice(-2) + "-" + ("0" + dateM.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
        this.marketOpen=false;
      }
      // this.DailyHighcharts.
      
        this.refreshChart();
      
      this.dataReady=true;
      console.log("1");
      this.replaceNullWithDashes();// to remove null elements with dashes
      this.totalPrice=(this.numStocks*this.dailypriceObj["last"]).toString();

      //Current date and time
    
    // this.currentDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
    
    






    });

    // this._autocompservice.getChartData(this.tickername).subscribe(data=>{
    //   this.chartdata=data;
    //   console.log(data);
    //   this.DailyChartOptions={
    //       series: [{
    //         name:this.tickername.toUpperCase(),
    //         data: this.chartdata,
    //         showInNavigator:true,
    //         type: 'line',
    //         tooltip: {
    //           valueDecimals: 2,
    //           },
    //         color:this.chartColor,
    //         // navigatorOptions:{
    //         //   opacity:0.5,
    //         // }
    //       }],
    //       xAxis: {  
    //         type: 'datetime',
    //       },
    //       legend:{
    //         enabled:false,
    //       },
    //       yAxis:{
    //         offset: -10,
    //         opposite: true,
    //         className: undefined,
    //         title:{
    //           text: "",
    //         }
    //       },
    //       navigator: {
    //         series:{
    //           fillOpacity:1,
    //         },
    //         enabled: true,      
    //     },
    //       title: {
    //         text: this.tickername.toUpperCase()
    //       },
    //       rangeSelector: {
    //           enabled:false,
    //       },
    //     };
    // });

    this._autocompservice.getChartDataSMA(this.tickername).subscribe(data=>{
      let ohlc=data[0];
      let volume=data[1];
      console.log(ohlc,volume);
      this.ChartOptionsSMA=
    
     {
      title: {
        text: this.tickername.toUpperCase() + ' Historical'
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      tooltip: {
        split: true
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      series: [{
        type: 'candlestick',
        name: this.tickername.toUpperCase(),
        id: 'ohlc',
        zIndex: 2,
        data: ohlc,
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      }, {
        type: 'vbp',
        linkedTo: 'ohlc',
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        linkedTo: 'ohlc',
        zIndex: 1,
        marker: {
          enabled: false
        }
      }],
      rangeSelector:{
        selected:2,
      }
    };
  



});


    this._autocompservice.getNewsData(this.tickername).subscribe(data=>{
      // this.newsDataObject=data;
      var articles=data;
      for(var i=0;i<Object.keys(articles).length;i++){
        if (articles[i].title != null && articles[i].urlToImage != null && articles[i].title != '' && articles[i].urlToImage != '') {
          this.newsDataObject.push(articles[i]);
          
        }
      }
   });
    
    
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

  refreshChart(){
    this._autocompservice.getChartData(this.tickername).subscribe(data=>{
      this.chartdata=data;
      console.log(data);
      this.DailyChartOptions={
          series: [{
            name:this.tickername.toUpperCase(),
            data: this.chartdata,
            showInNavigator:true,
            type: 'line',
            tooltip: {
              valueDecimals: 2,
              },
            color:this.chartColor,
            // navigatorOptions:{
            //   opacity:0.5,
            // }
          }],
          xAxis: {  
            type: 'datetime',
          },
          legend:{
            enabled:false,
          },
          yAxis:{
            offset: -10,
            opposite: true,
            className: undefined,
            title:{
              text: "",
            }
          },
          navigator: {
            series:{
              fillOpacity:1,
            },
            enabled: true,      
        },
          title: {
            text: this.tickername.toUpperCase()
          },
          time:{
            useUTC:false,
          },
          rangeSelector: {
              enabled:false,
          },
        };
    });
  }


}
