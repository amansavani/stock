import { Component, OnInit } from '@angular/core';
import { AutocompService } from '../../services/autocomp.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-stocksearch',
  templateUrl: './stocksearch.component.html',
  styleUrls: ['./stocksearch.component.css']
})
export class StocksearchComponent implements OnInit {
  inputTickerName:string ='';
  dataObj:object;
  control = new FormControl();
  constructor(private _autocompservice:AutocompService) { }

  callApi(ticker:string){
      this.dataObj=this._autocompservice.getAutoCompData(ticker);
  }
  ngOnInit(): void {
  }

}
