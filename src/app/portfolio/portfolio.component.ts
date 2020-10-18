import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../services/autocomp.service';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  purchasedlist;
  purchasedListEmpty:boolean;
  purchasedSorted:string[]=[]; //the main array
  dailyPrice:object;
  totalPrice: string="0.00";
  closeResult:string;
  numStocks:number;
  constructor(private _autocompservice:AutocompService, private router: Router, private modalService: NgbModal) { }

  open(content) {
    // this.totalPrice="0.00";
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  calculateCost(x,ele){
    this.numStocks=x;
    this.totalPrice=(x*ele["last"].toFixed(2)).toString();
    // console.log(this.totalPrice);
  }
  buyStock(ele){
    let purchasedStockList = JSON.parse(localStorage.getItem("purchased"));
    
    let purchasedStockDetails = purchasedStockList[ele["tickername"]];;
  
    purchasedStockDetails["stockQuantity"]+= +this.numStocks;
      // purchasedStockDetails["totalCost"]=+parseFloat(purchasedStockDetails["totalCost"])+ +this.totalPrice;
    purchasedStockDetails["totalCost"]+= +this.totalPrice;
    purchasedStockList[ele["tickername"]]=purchasedStockDetails;
  
    localStorage.setItem("purchased",JSON.stringify(purchasedStockList));
    
    let index = this.purchasedSorted.indexOf(ele);
    this.purchasedSorted[index]["stockQuantity"]=purchasedStockDetails["stockQuantity"];
    this.purchasedSorted[index]["totalCost"]=purchasedStockDetails["totalCost"];
    this.purchasedSorted[index]["avgCost"]=this.purchasedSorted[index]["totalCost"]/this.purchasedSorted[index]["stockQuantity"];;
    this.purchasedSorted[index]["change"]=this.purchasedSorted[index]["last"] - this.purchasedSorted[index]["avgCost"];
    this.purchasedSorted[index]["marketVal"] = this.purchasedSorted[index]["last"]*this.purchasedSorted[index]["stockQuantity"];

    console.log(this.purchasedSorted[index]);
    console.log(this.purchasedSorted);
    
    this.numStocks=0;
  }
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
        // console.log(this.purchasedSorted);
        
        this._autocompservice.getMutlipleDailyPrice(keys).subscribe(data=>{
          this.dailyPrice=data;
          for(let i=0;i<this.purchasedSorted.length;i++){
            this.purchasedSorted[i]["last"]= +this.dailyPrice[i]["last"];
            // this.purchasedSorted[i]["prevClose"]= +this.dailyPrice[i]["prevClose"];
            this.purchasedSorted[i]["avgCost"]= this.purchasedSorted[i]["totalCost"]/this.purchasedSorted[i]["stockQuantity"]; 
            this.purchasedSorted[i]["change"]=this.purchasedSorted[i]["last"] - this.purchasedSorted[i]["avgCost"];
            this.purchasedSorted[i]["marketVal"] = this.purchasedSorted[i]["last"]*this.purchasedSorted[i]["stockQuantity"];
          }
          console.log(this.purchasedSorted);
        }); 
        

      } 
      else{
        this.purchasedListEmpty=true;
      }
    }
  }
  

}
