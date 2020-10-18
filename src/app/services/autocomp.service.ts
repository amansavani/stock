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
  async getAsyncData(name:string){
    var arr=[]
    await this.getDailyPrice(name).toPromise().then(data=>{
      arr.push(data[0]["last"]);
      arr.push(data[0]["prevClose"]);
    })
    await this.getMetaData(name).toPromise().then(data=>arr.push(data["name"]))
   
    return arr
  }

  getNewsData(name:string){
    var _url = 'http://localhost:3000/news?q=';
    return this.http.get(_url+name);

  }

  getMutlipleDailyPrice(names:string[]){
    var _url = 'http://localhost:3000/dailyprice?q=';
    names.join(',');
    return this.http.get(_url+names.join(','));
  }

}
