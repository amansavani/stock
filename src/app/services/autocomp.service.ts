import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Component} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutocompService {

  // url='http://hw8-env.eba-4ppfxpr5.us-east-1.elasticbeanstalk.com';
  url='http://localhost:8080';
  constructor(private http:HttpClient) { }

  getAutoCompData(name:string){
    var _url = this.url+'/autocompletedata?q=';
    return this.http.get(_url+name);
  }

  getMetaData(name:string){
    var _url = this.url+'/metadata?q=';
    return this.http.get(_url+name);
  }
  getDailyPrice(name:string){
    var _url = this.url+'/dailyprice?q=';
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
    var _url = this.url+'/news?q=';
    return this.http.get(_url+name);

  }

  getMutlipleDailyPrice(names:string[]){
    var _url = this.url+'/dailyprice?q=';
    names.join(',');
    return this.http.get(_url+names.join(','));
  }

  getChartData(name:string){
    var _url = this.url+'/chartData?q=';
    return this.http.get(_url+name);
  }

  getChartDataSMA(name:string){
    var _url = this.url+'/chartDataSMA?q=';
    return this.http.get(_url+name);
  }

}
