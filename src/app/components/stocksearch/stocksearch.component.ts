import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../../services/autocomp.service';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-stocksearch',
  templateUrl: './stocksearch.component.html',
  styleUrls: ['./stocksearch.component.css']
})
export class StocksearchComponent implements OnInit {
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
      this.dataObj=this._autocompservice.getAutoCompData(ticker);
  }
  ngOnInit(): void {
  }

}
