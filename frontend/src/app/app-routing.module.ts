import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { MaintainabilityComponent } from './maintainability/maintainability.component';
import { DebugComponent } from './debug/debug.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home'
    }
  },
  {
    path: 'user/:username',
    component: UserComponent,
    data: {
      title: 'User analysis'
    }
  },
  {
    path: 'user/:username/maintainability',
    component: MaintainabilityComponent,
    data: {
      title: 'User analysis'
    }
  },
  {
    path: 'user/:username/debug',
    component: DebugComponent,
    data: {
      title: 'User analysis'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
