import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../services/autocomp.service';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css']
})
export class DetailspageComponent implements OnInit {

  tickername:string = '';
  dailypriceObj:object;
  metadataObj:object;
  change:number;
  changePercent:number;
  timestamp:string;
  constructor(private router:Router, private route:ActivatedRoute, private _autocompservice:AutocompService) { }

  toggle(){
    console.log("should toggle states");
  }
  ngOnInit(): void {
    this.tickername=this.route.snapshot.paramMap.get('tickername');
    this.dailypriceObj=this._autocompservice.getDailyPrice(this.tickername).subscribe(data=>{
      this.dailypriceObj=data;
      this.dailypriceObj=this.dailypriceObj[0];
      this.change = parseFloat((this.dailypriceObj["last"] - this.dailypriceObj["prevClose"]).toFixed(2));
      this.changePercent = parseFloat((this.change / this.dailypriceObj["prevClose"] *100).toFixed(2)); 
      var date =new Date();

      this.timestamp=date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')+" "+String(date.getHours()).padStart(2,'0')+":"+String(date.getMinutes()).padStart(2,'0')+":"+String(date.getSeconds()).padStart(2,'0');
      // console.log(this.changePercent);
      
    });
    this._autocompservice.getMetaData(this.tickername).subscribe(data=>{
      this.metadataObj=data;
    });
      
    
  }

}
