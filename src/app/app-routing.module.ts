import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MsgComponent } from './components/msg/msg.component';
import { ResetPasswordComponent } from './components/resetpassword/resetpassword.component';
import { AuthGuard } from './shared/auth.guard';
import { AccueilComponent } from './components/accueil/accueil.component';
import { RoleGuard } from './shared/role.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { AddbienComponent } from './components/bien/addbien/addbien.component';
import { RetrivebienComponent } from './components/bien/retrivebien/retrivebien.component';
import { UpdatebienComponent } from './components/bien/updatebien/updatebien.component';
import { RetrivebienadminComponent } from './components/bien/retrivebienadmin/retrivebienadmin.component';
import { RetrivecategoriesComponent } from './components/bien/retrivecategories/retrivecategories.component';
import { AddcategoriesComponent } from './components/bien/addcategories/addcategories.component';
import { UpdatecategoriesComponent } from './components/bien/updatecategories/updatecategories.component';
import { PlaceComponent } from './components/place/place.component';
import { GetplacesComponent } from './components/getplaces/getplaces.component';
import { UpdatePlaceComponent } from './components/updateplace/updateplace.component';
import { GetreservationsComponent } from './components/getreservations/getreservations.component';
import { UpdatereservationComponent } from './components/updatereservation/updatereservation.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import {ForumAdminComponent} from "./components/forum-admin/forum-admin.component";
import {ForumComponent} from "./components/forum/forum.component";
import { MarketComponent } from './components/market/market.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { SuccessComponent } from './components/success/success.component';
import { AddSondageComponent } from './components/addsondage/add-sondage-form.component';
import { AdminSondageFeedbackComponent } from './components/admin-sondage-feedback/admin-sondage-feedback.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { ShowReponseSondageComponent } from './components/show-reponse-sondage/show-reponse-sondage.component';
import { ShowsondageComponent } from './components/showsondage/showsondage.component';
import { StatistiqueSondageComponent } from './components/statistique-sondage/statistique-sondage.component';
import { FeedbackBienAdminComponent } from './components/feedback-bien-admin/feedback-bien-admin.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { HomePageComponent } from './components/home-page/home-page.component';
const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  {path :"register",component:RegisterComponent},
  {path :"login",component:LoginComponent},
  {path :"dashboard",component:DashboardComponent,canActivate:[AuthGuard ,RoleGuard]},
  {path :'msg',component:MsgComponent},
  {path :'resetpassword',component:ResetPasswordComponent},
  {path :'accueil',component:AccueilComponent,canActivate:[AuthGuard]},
  {path :'profile',component:ProfileComponent,canActivate:[AuthGuard]},
  {path :'addbien',component:AddbienComponent,canActivate:[AuthGuard]},
  {path :'retrivebien',component:RetrivebienComponent,canActivate:[AuthGuard]},
  {path :'updatebien/:id',component:UpdatebienComponent,canActivate:[AuthGuard]},
  {path :'retrivebienadmin',component:RetrivebienadminComponent,canActivate:[AuthGuard]},
  {path :'retrivecategories',component:RetrivecategoriesComponent,canActivate:[AuthGuard]},
  {path :'addcategories',component:AddcategoriesComponent,canActivate:[AuthGuard]},
  {path :'updatecategories/:id',component:UpdatecategoriesComponent,canActivate:[AuthGuard]},
  {path :'addplace',component:PlaceComponent,canActivate:[AuthGuard,RoleGuard]},
  {path :'getplaces',component:GetplacesComponent,canActivate:[AuthGuard,RoleGuard]},
  {path :'updateplace/:id',component:UpdatePlaceComponent,canActivate:[AuthGuard,RoleGuard]},
  {path :'getreservations',component:GetreservationsComponent,canActivate:[AuthGuard]},
  {path :'updatereservation/:id',component:UpdatereservationComponent,canActivate:[AuthGuard]},
  {path :'addreservation',component:ReservationComponent,canActivate:[AuthGuard]},
  {path :'forum',component:ForumComponent,canActivate:[AuthGuard]},
  {path :'forumAdmin',component:ForumAdminComponent,canActivate:[AuthGuard]},
  {path :'market',component:MarketComponent,canActivate:[AuthGuard]},
  {path :'statistics',component:StatisticsComponent,canActivate:[AuthGuard]},
  { path: 'cancel', component: CancelComponent ,canActivate:[AuthGuard]},
  { path: 'success', component: SuccessComponent ,canActivate:[AuthGuard]},
  { path: 'feedback', component: FeedbackComponent,canActivate:[AuthGuard] },
  { path: 'addsondage', component: AddSondageComponent,canActivate:[AuthGuard] },
  { path: 'showsondage', component: ShowsondageComponent,canActivate:[AuthGuard] },
  { path: 'adminSondageFeedback', component: AdminSondageFeedbackComponent,canActivate:[AuthGuard] },
  { path: 'showReponseSondage', component: ShowReponseSondageComponent,canActivate:[AuthGuard] },
  { path: 'statistiqueSondage', component: StatistiqueSondageComponent,canActivate:[AuthGuard] },
  { path: 'FeedBackBienAdmin', component: FeedbackBienAdminComponent,canActivate:[AuthGuard] },
  { path: 'DashboardAdmin', component: DashboardAdminComponent,canActivate:[AuthGuard,RoleGuard] },
  { path: 'homePage', component: HomePageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
