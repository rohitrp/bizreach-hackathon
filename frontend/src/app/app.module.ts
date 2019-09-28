import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { MaintainabilityComponent } from './maintainability/maintainability.component';
import { GeneralStatComponent } from './general-stat/general-stat.component';
import { DebugComponent } from './debug/debug.component';
import { ExpertiseComponent } from './expertise/expertise.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    BarChartComponent,
    MaintainabilityComponent,
    GeneralStatComponent,
    DebugComponent,
    ExpertiseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
