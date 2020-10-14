import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../services/autocomp.service';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
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
  change:number;
  changePercent:number;
  timestamp:string;
  marketOpen:boolean=true;
  closeResult:string;
  isStarred:boolean=false;
  constructor(private router:Router, private route:ActivatedRoute, private _autocompservice:AutocompService, private modalService: NgbModal) { }


  open(content) {
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

  toggle(){
    this.isStarred = !this.isStarred;
    // must save data
  }
  ngOnInit(): void {
    this.tickername=this.route.snapshot.paramMap.get('tickername');
    this.dailypriceObj=this._autocompservice.getDailyPrice(this.tickername).subscribe(data=>{
      this.dailypriceObj=data;
      this.dailypriceObj=this.dailypriceObj[0];
      this.change = parseFloat((this.dailypriceObj["last"] - this.dailypriceObj["prevClose"]).toFixed(2));
      this.changePercent = parseFloat((this.change / this.dailypriceObj["prevClose"] *100).toFixed(2)); 
      var date =new Date();
      this.marketOpen=true;
      this.timestamp=date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')+" "+String(date.getHours()).padStart(2,'0')+":"+String(date.getMinutes()).padStart(2,'0')+":"+String(date.getSeconds()).padStart(2,'0');
      // console.log(this.changePercent);
      if (this.dailypriceObj["bidPrice"]==null && this.dailypriceObj["bidSize"]==null){
        this.format = this.dailypriceObj["timestamp"].slice(0,10)+" "+this.dailypriceObj["timestamp"].slice(11,19)
        this.marketOpen=false;
      }
      
    });
    this._autocompservice.getMetaData(this.tickername).subscribe(data=>{
      this.metadataObj=data;
    });
      
    
  }

}
