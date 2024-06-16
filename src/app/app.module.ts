import { NgModule } from '@angular/core';

import { HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MsgComponent } from './components/msg/msg.component';
import { ResetPasswordComponent } from './components/resetpassword/resetpassword.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddbienComponent } from './components/bien/addbien/addbien.component';
import { RetrivebienComponent } from './components/bien/retrivebien/retrivebien.component';
import { UpdatebienComponent } from './components/bien/updatebien/updatebien.component';
import { RetrivebienadminComponent } from './components/bien/retrivebienadmin/retrivebienadmin.component';
import { RetrivecategoriesComponent } from './components/bien/retrivecategories/retrivecategories.component';
import { AddcategoriesComponent } from './components/bien/addcategories/addcategories.component';
import { UpdatecategoriesComponent } from './components/bien/updatecategories/updatecategories.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlaceComponent } from './components/place/place.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { GetplacesComponent } from './components/getplaces/getplaces.component';
import { UpdatePlaceComponent } from './components/updateplace/updateplace.component';
import { GetreservationsComponent } from './components/getreservations/getreservations.component';
import { UpdatereservationComponent } from './components/updatereservation/updatereservation.component';
import {NavComponent} from "./components/nav/nav.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {ForumAdminComponent} from "./components/forum-admin/forum-admin.component";
import {ForumComponent} from "./components/forum/forum.component";
import { MarketComponent } from './components/market/market.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SuccessComponent } from './components/success/success.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { ShowsondageComponent } from './components/showsondage/showsondage.component';
import { AdminSondageFeedbackComponent } from './components/admin-sondage-feedback/admin-sondage-feedback.component'; 
import { ShowReponseSondageComponent } from './components/show-reponse-sondage/show-reponse-sondage.component';
import { StatistiqueSondageComponent } from './components/statistique-sondage/statistique-sondage.component'; 
import { MatIconModule } from '@angular/material/icon';
import { AddSondageComponent } from './components/addsondage/add-sondage-form.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MatMenuModule } from '@angular/material/menu';
import { FeedbackBienAdminComponent } from './components/feedback-bien-admin/feedback-bien-admin.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { HomePageComponent } from './components/home-page/home-page.component';










@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    MsgComponent,
    ResetPasswordComponent,
    NavbarComponent,
    AccueilComponent,
    ProfileComponent,
    AddbienComponent,
    RetrivebienComponent,
    UpdatebienComponent,
    RetrivebienadminComponent,
    RetrivecategoriesComponent,
    AddcategoriesComponent,
    UpdatecategoriesComponent,
    ReservationComponent,
    PlaceComponent,
    GetplacesComponent,
    GetreservationsComponent,
    UpdatePlaceComponent,
    UpdatereservationComponent,
    ForumComponent,
    ForumAdminComponent,
    SidebarComponent,
    NavComponent,
    MarketComponent,
    StatisticsComponent,
    SuccessComponent,
    FeedbackComponent,
    AddSondageComponent,
    ShowsondageComponent,
    AdminSondageFeedbackComponent,
    ShowReponseSondageComponent,
    StatistiqueSondageComponent,
    CancelComponent,
    FeedbackBienAdminComponent,
    DashboardAdminComponent,
    HomePageComponent
    
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatMenuModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
