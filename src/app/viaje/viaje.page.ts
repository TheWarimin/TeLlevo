import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ServiciosService } from '../servicios/servicios.service';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { geocode, GeocodeRequest } from 'opencage-api-client';
import { Geolocation } from '@capacitor/geolocation';
import { NgZone } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {

  tipoOrigen: 'posicionActual' | 'ingresarDireccion' = 'posicionActual';
  direccionOrigen: string = '';
  direccionDestino: string = '';
  horaSalida: string = '';
  precioPorPersona: number = 0;
  numeroAsientos: number = 0;
  coordenadaInicio: String = "";
  coordenadaFinal: String = "";
  viajes: any[] = [];;
  

  constructor(private ngZone: NgZone,private toastController: ToastController, private modalController: ModalController, private router: Router, private activatedRouter: ActivatedRoute, private auth: ServiciosService, private authGuard: AuthGuard,private serviciosService: ServiciosService) { }

  showFiller = false;
  user={
    usuario:"",
    password:""
    };

    async mostrarMensaje(mensaje: string, color: string = 'success') {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 2000, 
        color: color,
        position: 'top' 
      });
      toast.present();
    }

    isAdmin(): boolean {
      const userRole = this.serviciosService.getCurrentRole();
      return userRole === 'dueno';
    }
  
    isUser(): boolean {
      const userRole = this.serviciosService.getCurrentRole();
      return userRole === 'pasajero';
    }

    selectViaje(viaje: any) {
      if (viaje.seatsTaken < viaje.numberOfSeats) {
        viaje.seatsTaken++;
        this.mostrarMensaje('Viaje seleccionado.');
      } else {
        this.mostrarMensaje('No hay asientos disponibles para este viaje.','danger');
      }
    }


    async agregarViaje() {
      
      if (this.tipoOrigen === 'posicionActual') {
        await this.obtenerPosicionActualYAgregarViaje();
      } else if (this.tipoOrigen === 'ingresarDireccion') {
        await this.agregarViajeConDireccionIngresada();
      }
      await this.actualizarListaViajes();
    }
    
    
    private async obtenerPosicionActualYAgregarViaje() {
      try {
        const coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true
        });
    
        const coordenadasPartida = await this.transcoorde(`${coordinates.coords.latitude}, ${coordinates.coords.longitude}`);
        const coordenadasDestino = await this.transcoorde(this.direccionDestino);
    
        const viajeString = `${this.direccionOrigen} - ${this.direccionDestino}`;
    
        this.auth.addTrip(viajeString, this.horaSalida, this.precioPorPersona, this.numeroAsientos, coordenadasPartida, coordenadasDestino);
    
        this.limpiarFormulario();
        this.actualizarListaViajes();
        this.mostrarMensaje('Viaje agregado correctamente.');
      } catch (error) {
        console.error('Error al obtener posición actual:', error);
        this.mostrarMensaje('Error al obtener posición actual.', 'danger');
      }
    }
    
    private async agregarViajeConDireccionIngresada() {
      if (this.direccionOrigen && this.direccionDestino && this.horaSalida && this.precioPorPersona > 0) {
        const coordenadasPartida = await this.transcoorde(this.direccionOrigen);
        const coordenadasDestino = await this.transcoorde(this.direccionDestino);

        const viajeString = `${this.direccionOrigen} - ${this.direccionDestino}`;

        this.auth.addTrip(viajeString, this.horaSalida, this.precioPorPersona, this.numeroAsientos, coordenadasPartida, coordenadasDestino);

        // Actualiza los datos de los waypoints en el estado de tu aplicación
        this.serviciosService.setTripStartCoordinate({
          lat: parseFloat(coordenadasPartida.split(',')[0]),
          lng: parseFloat(coordenadasPartida.split(',')[1])
        });
        this.serviciosService.setTripEndCoordinate({
          lat: parseFloat(coordenadasDestino.split(',')[0]),
          lng: parseFloat(coordenadasDestino.split(',')[1])
        });

        // Actualiza los waypoints en el mapa
        this.updateWaypoints(coordenadasPartida, coordenadasDestino);

        this.limpiarFormulario();
        this.actualizarListaViajes();
        this.mostrarMensaje('Viaje agregado correctamente.');
      } else {
        this.mostrarMensaje("Por favor, complete todos los campos y asegúrese de que el precio sea mayor que 0.", 'danger');
      }
    }
    
    private map: any; // Declare the 'map' property


    private updateWaypoints(startCoordinate: any, endCoordinate: any) {
      if (this.map) {
        L.Routing.control({
          waypoints: [
            L.latLng(startCoordinate.lat, startCoordinate.lng), // Punto de inicio
            L.latLng(endCoordinate.lat, endCoordinate.lng), // Punto de destino
          ],
        }).addTo(this.map);
      }
    }

    private limpiarFormulario() {
      this.direccionOrigen = '';
      this.direccionDestino = '';
      this.horaSalida = '';
      this.precioPorPersona = 0;
    }
    
    
    async transcoorde(address: string): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        const request: GeocodeRequest = {
          q: address,
          key: '02b0d41339184ba5bfe65335cda82b55', 
          no_annotations: 1,
        };
        
        geocode(request)
          .then(response => {
            const coordinates = response.results[0]?.geometry?.lat + ',' + response.results[0]?.geometry?.lng;
            resolve(coordinates);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      });
    }
    
    onTipoOrigenChange() {
    }
    
    eliminarViajesMarcados() {
      const viajesMarcados = this.viajes.filter((viaje) => viaje.seleccionado);
      if (viajesMarcados.length > 0) {
        viajesMarcados.forEach((viaje) => {
          this.auth.deleteTripById(viaje.id);
        });
      }}

    actualizarListaViajes(): Promise<void> {
      return new Promise<void>((resolve) => {
        this.viajes = this.auth.getViajes();
        resolve();
      });
    }

    async ionViewWillEnter() {
      await this.actualizarListaViajes();
    }
    

    goTologin(){
      this.router.navigate(['/login'], { state: { user: this.user } });
    }

    goTomapa(){
      this.router.navigate(['/mapa'], { state: { user: this.user } });
    }

    goToviaje(){
      this.router.navigate(['/viaje'], { state: { user: this.user } });
    }

    cerrar() {
      this.auth.logout()
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
