import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../../services/autocomp.service';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Observable} from 'rxjs';
import {debounce, debounceTime, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-stocksearch',
  templateUrl: './stocksearch.component.html',
  styleUrls: ['./stocksearch.component.css']
})

export class StocksearchComponent implements OnInit {
  dataReady:boolean=true;
  inputTickerName:string ='';
  dataObj:object; //I think the service is returning a JSON and thats why we are storing the output in a object variable
  control = new FormControl();
  constructor(private _autocompservice:AutocompService,
              private route: ActivatedRoute,
              private router: Router) { }
  searchStock(ticker:string){
    // console.log("hello");
    this.router.navigate(['/details',ticker]);
  }

  

  callApi(ticker:string){
      if(!ticker){
        return
      }
      // this.dataObj=this.control.valueChanges.pipe(debounceTime(500))
      this.dataReady=false;
      this.dataObj=this._autocompservice.getAutoCompData(ticker);
      // this.dataReady=true;
      setTimeout(()=>this.dataReady = true,1500);
      // this._autocompservice.getAutoCompData(ticker).subscribe(data=>{
      //   this.dataObj=data;
      //   this.dataReady=true;
      // });
  }
  ngOnInit(): void {
  //   this.dataObj=this.control.valueChanges.pipe(debounceTime(500),
  //   map(x=>this._autocompservice.getAutoCompData(x).subscribe(y=>{this.dataObj=y;this.dataReady=true})));
  }

}
