import { Component, OnInit } from '@angular/core';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})


export class WatchlistComponent implements OnInit {

  watchListEmpty:boolean;
  watchlist=[];
  constructor() { }

  ngOnInit(): void {
    
    if(localStorage.getItem("watchlist")==null){
      this.watchListEmpty=true;
    }
    else{
      this.watchlist=JSON.parse(localStorage.getItem("watchlist"));
      if (this.watchlist.length !=0){
        this.watchListEmpty=false;
      }
      else{
        this.watchListEmpty=true;
      }
    }
  }

}
