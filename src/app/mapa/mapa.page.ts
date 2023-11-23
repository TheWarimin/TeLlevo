import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ServiciosService } from '../servicios/servicios.service';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  map: L.Map | undefined;

  constructor(private geolocation: Geolocation ,private modalController: ModalController, private router: Router, private activatedRouter: ActivatedRoute, private auth: ServiciosService, private authGuard: AuthGuard,private serviciosService: ServiciosService) 
  {this.map = undefined;}

  
  showFiller = false;
  user={
    usuario:"",
    password:""
    };

    goTologin(){
      this.router.navigate(['/login'], { state: { user: this.user } });
    }

    goTomapa(){
      this.router.navigate(['/mapa'], { state: { user: this.user } });
    }

    goToviaje(){
      this.router.navigate(['/viaje'], { state: { user: this.user } });
    }

    goToperfil() {
      this.router.navigate(['/perfil'], { state: { user: this.user } });
    }
    
    cerrar() {
      this.auth.logout()
    }  
    
    ngAfterViewInit() {
      this.printCurrentPosition();
    }

    async printCurrentPosition() {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates);
  
      this.initializeMap(coordinates.coords.latitude, coordinates.coords.longitude);
    }
  
    initializeMap(lat: number, lng: number) {
      this.map = L.map('map').setView([lat, lng], 17);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Tellevo'
      }).addTo(this.map);
      L.marker([lat, lng]).addTo(this.map).bindPopup('Ubicación actual');
    }

    ngOnInit() {
      this.activatedRouter.queryParams.subscribe((params) => {
        const state = this.router.getCurrentNavigation()?.extras.state;
        if (state && state['user']) {
          this.user.usuario = state['user'].usuario;
          this.user.password = state['user'].password;
          if (state['user'].newRole) {
            this.auth.setCurrentRole(state['user'].newRole);
          }
          console.log("Usuario actual:", this.user);
          console.log("Rol actual:", this.auth.getCurrentRole());
        }
      });
    }

}
