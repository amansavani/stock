import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import {RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { StocksearchComponent } from './components/stocksearch/stocksearch.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    StocksearchComponent,
    WatchlistComponent,
    PortfolioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forChild([
      {
        path:'',
        component: StocksearchComponent
      },
      {
        path:'watchlist',
        component: WatchlistComponent
      },
      {
        path:'portfolio',
        component: PortfolioComponent
      },
      {
        path:'details/:tickername',
        component: StocksearchComponent
      },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
