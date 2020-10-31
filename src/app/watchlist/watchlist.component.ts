import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../services/autocomp.service';
import { Router } from '@angular/router';

// interface StockDetails {
//   tickername: string;
//   name: string;
//   price: number;
//   change: number;
//   changepercent: number;
// }

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})


export class WatchlistComponent implements OnInit {

  watchListEmpty:boolean;
  watchlist=[];
  StockDetailsArray=[];
  dataReady:boolean;
  constructor(private _autocompservice:AutocompService, private router: Router) { }

  ngOnInit(): void {
    
    if(localStorage.getItem("watchlist")==null){
      this.watchListEmpty=true;
      this.dataReady=true;
    }
    else{
      this.watchlist=JSON.parse(localStorage.getItem("watchlist"));
      if (Object.keys(this.watchlist).length !=0){
        this.watchListEmpty=false;
        let keys = Object.keys(this.watchlist).sort();
        for(let i=0;i<keys.length;i++){
          this.StockDetailsArray.push(this.watchlist[keys[i]]);
        }
        this._autocompservice.getMutlipleDailyPrice(keys).subscribe(data=>{
          let temp=[]
          for(let i=0;i<keys.length;i++){
            temp.push(data[i]["ticker"]);
          }
          for(let i=0;i<keys.length;i++){
            let index = temp.indexOf(keys[i]); 
           
            this.StockDetailsArray[i]["price"]=data[index]["last"];
            this.StockDetailsArray[i]["change"]=parseFloat((data[index]["last"]-data[index]["prevClose"]).toFixed(2));
            this.StockDetailsArray[i]["changepercent"]=parseFloat(((data[index]["last"]-data[index]["prevClose"])*100/data[index]["prevClose"]).toFixed(2));
          }
          console.log(this.StockDetailsArray);
          this.dataReady=true;
        });
      }
        
      else{
        this.watchListEmpty=true;
        this.dataReady=true;
      }
    }
  }

removeFromWatch(stock){
  this.StockDetailsArray.splice(this.StockDetailsArray.indexOf(stock),1);
  let watchlist=JSON.parse(localStorage.getItem("watchlist"));
  // watchlist.splice(watchlist.indexOf(stock["tickername"],1));
  delete watchlist[stock["tickername"]];
  if(this.StockDetailsArray.length==0){
    this.watchListEmpty=true;
  }
  localStorage.setItem("watchlist",JSON.stringify(watchlist));
  this.refreshData();
}
NavigateStock(stock){
  // console.log("hello");
  this.router.navigate(['/details',stock["tickername"]]);
}

 async getDataAsync(){
     for(var i=0;i<this.watchlist.length;i++){
      //  let temp:StockDetails= {};
      //   let temp:StockDetails;  
      //   this._autocompservice.getMetaData(ticker).subscribe(data=>{
      //     temp.name=data["name"];
      //     temp.tickername = ticker;
      //   });
      //   this._autocompservice.getDailyPrice(ticker).subscribe(data=>{
      //     temp.price=data["last"];
      //     temp.change = data["last"]-data["prevClose"];
      //     temp.changepercent = temp.change * 100 / data["prevClose"];
      //   });
        
      //   this.StockDetailsArray.push(temp);
         
      // });
      // console.log(this.StockDetailsArray);
      let val1= await this._autocompservice.getAsyncData(this.watchlist[i])
      console.log(val1);
      this.StockDetailsArray.push({'name': val1[2], 'tickername': this.watchlist[i], 'price':val1[0],  'change':parseFloat((val1[0]-val1[1]).toFixed(2)),changepercent:parseFloat(((val1[0]-val1[1]) *100/ val1[1]).toFixed(2)) });

    };
    this.dataReady=true;
  }

  refreshData(){
    
    this.watchlist=JSON.parse(localStorage.getItem("watchlist"));
      if (Object.keys(this.watchlist).length !=0){
        this.watchListEmpty=false;
        let keys = Object.keys(this.watchlist).sort();
        // for(let i=0;i<keys.length;i++){
        //   this.StockDetailsArray.push(this.watchlist[keys[i]]);
        // }
        this._autocompservice.getMutlipleDailyPrice(keys).subscribe(data=>{
          let temp=[]
          for(let i=0;i<keys.length;i++){
            temp.push(data[i]["ticker"]);
          }
          for(let i=0;i<keys.length;i++){
            let index = temp.indexOf(keys[i]); 
           
            this.StockDetailsArray[i]["price"]=data[index]["last"];
            this.StockDetailsArray[i]["change"]=parseFloat((data[index]["last"]-data[index]["prevClose"]).toFixed(2));
            this.StockDetailsArray[i]["changepercent"]=parseFloat(((data[index]["last"]-data[index]["prevClose"])*100/data[index]["prevClose"]).toFixed(2));
          }
          console.log(this.StockDetailsArray);
          this.dataReady=true;
        });
  }
}

}
