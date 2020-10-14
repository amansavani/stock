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

}
