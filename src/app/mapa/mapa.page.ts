import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ServiciosService } from '../servicios/servicios.service';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';

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
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true // Habilitar alta precisión
      });
      console.log('Current position:', coordinates);
    
      this.initializeMap(coordinates.coords.latitude, coordinates.coords.longitude);
    }
  
    initializeMap(lat: number, lng: number) {
      this.map = L.map('map').setView([lat, lng], 17);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Tellevo'
      }).addTo(this.map);
      const startCoordinate = this.serviciosService.getTripStartCoordinate();
      const endCoordinate = this.serviciosService.getTripEndCoordinate();
    
      if (startCoordinate) {
        let startMarker = L.marker([startCoordinate.lat, startCoordinate.lng]).addTo(this.map);
        startMarker.bindPopup('Inicio del viaje');
      }
      
      if (endCoordinate) {
        let endMarker = L.marker([endCoordinate.lat, endCoordinate.lng]).addTo(this.map);
        endMarker.bindPopup('Fin del viaje');
      }
      
      L.marker([lat, lng]).addTo(this.map).bindPopup('Ubicación actual');
      
      this.setWaypoints(startCoordinate, endCoordinate, lat, lng);
    }

    

    setWaypoints(startCoordinate: any, endCoordinate: any, lat: number, lng: number) {
      setTimeout(() => {
        if (this.map && startCoordinate && endCoordinate) {
          L.Routing.control({
            collapsible: true,
            waypoints: [
              L.latLng(startCoordinate.lat, startCoordinate.lng), 
              L.latLng(endCoordinate.lat, endCoordinate.lng), 
            ],
            show: false,
          }).addTo(this.map);
        }
      });
    }
    

    ngOnInit() {
      this.activatedRouter.queryParams.subscribe(() => {
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
      };
      }
    
