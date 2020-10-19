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
    this.numStocks=0;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    
      // this.totalPrice="0.00";
  
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
    this.totalPrice=((x*ele["last"]).toFixed(2)).toString();
    // console.log(this.totalPrice);
  }
  buyStock(ele){
    let purchasedStockList = JSON.parse(localStorage.getItem("purchased"));
    
    let purchasedStockDetails = purchasedStockList[ele["tickername"]];;
  
    purchasedStockDetails["stockQuantity"]+= +this.numStocks;
      // purchasedStockDetails["totalCost"]=+parseFloat(purchasedStockDetails["totalCost"])+ +this.totalPrice;
    purchasedStockDetails["totalCost"]+= +this.totalPrice;
    purchasedStockDetails["totalCost"] = parseFloat(purchasedStockDetails["totalCost"].toFixed(2))
    purchasedStockList[ele["tickername"]]=purchasedStockDetails;
  
    localStorage.setItem("purchased",JSON.stringify(purchasedStockList));
    
    let index = this.purchasedSorted.indexOf(ele);
    this.purchasedSorted[index]["stockQuantity"]=purchasedStockDetails["stockQuantity"];
    this.purchasedSorted[index]["totalCost"]=purchasedStockDetails["totalCost"];
    this.purchasedSorted[index]["avgCost"]=parseFloat((this.purchasedSorted[index]["totalCost"]/this.purchasedSorted[index]["stockQuantity"]).toFixed(2));
    this.purchasedSorted[index]["change"]=parseFloat((this.purchasedSorted[index]["last"] - this.purchasedSorted[index]["avgCost"]).toFixed(2));
    this.purchasedSorted[index]["marketVal"] = parseFloat((this.purchasedSorted[index]["last"]*this.purchasedSorted[index]["stockQuantity"]).toFixed(2));

    console.log(this.purchasedSorted[index]);
    console.log(this.purchasedSorted);
    
    this.numStocks=0;
  }

  sellStock(ele){
    let purchasedStockList = JSON.parse(localStorage.getItem("purchased"));
    
    let purchasedStockDetails = purchasedStockList[ele["tickername"]];;
    purchasedStockDetails["stockQuantity"]-= +this.numStocks;
    purchasedStockDetails["totalCost"]-= +this.totalPrice;
    purchasedStockList[ele["tickername"]]=purchasedStockDetails;

    if(purchasedStockDetails["stockQuantity"]>0){
      
      localStorage.setItem("purchased",JSON.stringify(purchasedStockList));
      let index = this.purchasedSorted.indexOf(ele);
      this.purchasedSorted[index]["stockQuantity"]=purchasedStockDetails["stockQuantity"];
      this.purchasedSorted[index]["totalCost"]=purchasedStockDetails["totalCost"];
      this.purchasedSorted[index]["avgCost"]=parseFloat((this.purchasedSorted[index]["totalCost"]/this.purchasedSorted[index]["stockQuantity"]).toFixed(2));
      this.purchasedSorted[index]["change"]=parseFloat((this.purchasedSorted[index]["last"] - this.purchasedSorted[index]["avgCost"]).toFixed(2));
      this.purchasedSorted[index]["marketVal"] = parseFloat((this.purchasedSorted[index]["last"]*this.purchasedSorted[index]["stockQuantity"]).toFixed(2));

    }
    else{
      delete purchasedStockList[ele["tickername"]];
      localStorage.setItem("purchased",JSON.stringify(purchasedStockList));
      this.purchasedSorted.splice(this.purchasedSorted.indexOf(ele),1);
      if(this.purchasedSorted.length==0){
        this.purchasedListEmpty=true;
      }

    }


    // console.log(this.purchasedSorted[index]);
    // console.log(this.purchasedSorted);
    
    this.numStocks=0;

  }

  ngOnInit(): void {
    if(localStorage.getItem("purchased")==null){
      this.purchasedListEmpty=true;
    }
    else{
      this.purchasedlist=JSON.parse(localStorage.getItem("purchased"));
      console.log(this.purchasedlist.length)
      
      if (Object.keys(this.purchasedlist).length !=0){
        this.purchasedListEmpty=false;
        // console.log(this.purchasedlist);
        let keys = Object.keys(this.purchasedlist).sort();
        for(let i=0;i<keys.length;i++){
          this.purchasedSorted.push(this.purchasedlist[keys[i]]);
        }
        // console.log(this.purchasedSorted);
        
        this._autocompservice.getMutlipleDailyPrice(keys).subscribe(data=>{
          this.dailyPrice=data;
          console.log(this.dailyPrice)
          let temp=[]
          for(let i=0;i<keys.length;i++){
            temp.push(this.dailyPrice[i]["ticker"]);
          }
          for(let i=0;i<this.purchasedSorted.length;i++){
            let index = temp.indexOf(keys[i]); 
            this.purchasedSorted[i]["last"]= +this.dailyPrice[index]["last"];
            // this.purchasedSorted[i]["prevClose"]= +this.dailyPrice[i]["prevClose"];
            this.purchasedSorted[i]["avgCost"]= parseFloat((this.purchasedSorted[i]["totalCost"]/this.purchasedSorted[i]["stockQuantity"]).toFixed(2)); 
            this.purchasedSorted[i]["change"]=parseFloat((this.purchasedSorted[i]["last"] - this.purchasedSorted[i]["avgCost"]).toFixed(2));
            this.purchasedSorted[i]["marketVal"] = parseFloat((this.purchasedSorted[i]["last"]*this.purchasedSorted[i]["stockQuantity"]).toFixed(2));
          }
          console.log(this.purchasedSorted);
        }); 
        

      } 
      else{
        this.purchasedListEmpty=true;
      }
    }
    console.log(this.purchasedListEmpty)
  }
  

}
