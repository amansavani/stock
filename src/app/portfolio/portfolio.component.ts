import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  purchasedlist;
  purchasedListEmpty:boolean;
  purchasedSorted=[];
  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem("purchased")==null){
      this.purchasedListEmpty=true;
    }
    else{
      this.purchasedlist=JSON.parse(localStorage.getItem("purchased"));
      if (this.purchasedlist.length !=0){
        this.purchasedListEmpty=false;
        // console.log(this.purchasedlist);
        let keys = Object.keys(this.purchasedlist).sort();
        for(let i=0;i<keys.length;i++){
          this.purchasedSorted.push(this.purchasedlist[keys[i]]);
        }
        console.log(this.purchasedSorted);



      } 
      else{
        this.purchasedListEmpty=true;
      }
    }
  }
  

}
