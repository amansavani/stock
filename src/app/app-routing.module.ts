import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StocksearchComponent } from './components/stocksearch/stocksearch.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DetailspageComponent } from './detailspage/detailspage.component';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
