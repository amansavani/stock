import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutocompService {

  constructor(private http:HttpClient) { }

  getAutoCompData(name:string){
    var _url = 'http://localhost:3000/autocompletedata?q=';
    return this.http.get(_url+name);
  }

  getMetaData(name:string){
    var _url = 'http://localhost:3000/metadata?q=';
    return this.http.get(_url+name);
  }
  getDailyPrice(name:string){
    var _url = 'http://localhost:3000/dailyprice?q=';
    return this.http.get(_url+name);
  }

}
