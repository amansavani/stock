import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import {RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AutocompService } from './services/autocomp.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { StocksearchComponent } from './components/stocksearch/stocksearch.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DetailspageComponent } from './detailspage/detailspage.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    StocksearchComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailspageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
        component: DetailspageComponent
      },
    ])
  ],
  providers: [AutocompService],
  bootstrap: [AppComponent]
})
export class AppModule { }
