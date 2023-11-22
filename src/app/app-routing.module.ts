import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'mapa',
    canActivate: [AuthGuard],
    loadChildren: () => import('./mapa/mapa.module').then(m => m.MapaPageModule)
  },
  {
    path: 'viaje',
    canActivate: [AuthGuard],
    loadChildren: () => import('./viaje/viaje.module').then( m => m.ViajePageModule)
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard],
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./error/error.module').then( m => m.ErrorPageModule)
  },
  

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
