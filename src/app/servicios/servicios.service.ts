import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { Subject } from 'rxjs';


interface User {
  username: string;
  password: string;
  role: 'pasajero' | 'dueno';
  takenTrips?: Trip[]; 
}


interface Trip {
  id: number;
  address: string;
  departureTime: string;
  pricePerPerson: number;
  numberOfSeats: number;
  seatsTaken: number;
}


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  public validado!: boolean;

  private local!: Storage;

  private trips: Trip[] = [];

  constructor(private storage: Storage, private route: Router) {
    this.init()
  }

  async init() {
    const storage = await this.storage.create();
    this.local = storage;

  }
  
  private currentRole: 'pasajero' | 'dueno' | null = null;

  private currentUsername: string | undefined;

  private currentUsernameSubject: Subject<string | undefined> = new Subject<string | undefined>();
  currentUsername$ = this.currentUsernameSubject.asObservable();

  setCurrentUsername(username: string): void {
    this.currentUsername = username;
    this.currentUsernameSubject.next(username);
  }

  getCurrentRole(): 'pasajero' | 'dueno' {
    return this.currentRole || 'pasajero'; 
  }

  setCurrentRole(role: 'pasajero' | 'dueno'): void {
    this.currentRole = role;
  }

  async cambiarRol(newRole: 'pasajero' | 'dueno'): Promise<boolean> {
    try {
      if (!this.currentUsername) {
        console.log('Nombre de usuario actual no encontrado');
        return false;
      }
      const userToUpdate = await this.findUserByUsername(this.currentUsername);
      if (userToUpdate) {
        userToUpdate.role = newRole;
        const users: User[] = (await this.local.get('users')) || [];
        const updatedUsers = users.map((user) => (user.username === this.currentUsername ? userToUpdate : user));
        await this.local.set('users', updatedUsers);
        console.log("Cambiando el rol a:", newRole);
        console.log('Rol actualizado con éxito');
        return true;
      } else {
        console.log('El usuario no existe');
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      return false;
    }
  }


  addTrip(address: string, departureTime: string, pricePerPerson: number, numberOfSeats: number) {
    const newTrip: Trip = {
      id: this.trips.length + 1,
      address,
      departureTime,
      pricePerPerson,
      numberOfSeats,
      seatsTaken: 0,
    };
    this.trips.push(newTrip);
  }
  
  

  deleteTripById(id: number) {
    const index = this.trips.findIndex((trip) => trip.id === id);
    if (index !== -1) {
      this.trips.splice(index, 1);
    }
  }

  getViajes(): Trip[] {
    return this.trips;
  }

  getTripById(id: number): Trip | undefined {
    return this.trips.find((trip) => trip.id === id);
  }
  
  async register(username: string, password: string, role: 'pasajero' | 'dueno') {
    const users = await this.local?.get('users') || [];
    const existe = users.find((us: User) => us.username === username);
    if (existe) {
      console.log("Usuario Existente");
    } else {
      const nuevo: User = { username, password, role, takenTrips: [] };
      users.push(nuevo);
      await this.local.set('users', users);
      console.log("Registrando con el rol:", role);
      console.log("Registro Exitoso");
      this.setCurrentRole(role);
    }
  }
  
  

  async login(username: string, password: string): Promise<boolean> {
    const users: User[] = (await this.local.get('users')) || [];
    const user = users.find((us: User) => us.username === username && us.password === password);
    if (user) {
      console.log("logeado (validado correctamente)")
      this.validado = true;
      this.setCurrentRole(user.role);
      this.setCurrentUsername(username);
      return true;
    }
    console.log("no logeado (invalido)")
    this.validado = false;
    return false;
  }
  
  

  async findUserByUsername(username: string): Promise<User | undefined> {
    const users: User[] = (await this.local.get('users')) || [];
    return users.find((user: User) => user.username === username);
  }
  

  async changePassword(username: string, newPassword: string): Promise<boolean> {
    const userToUpdate = await this.findUserByUsername(username);
    if (userToUpdate) {
      userToUpdate.password = newPassword;
      const users: User[] = (await this.local.get('users')) || [];
      const updatedUsers = users.map((user) => (user.username === username ? userToUpdate : user));
      await this.local.set('users', updatedUsers);
      console.log("Contraseña cambiada con éxito")
      return true;
    } else {
      console.log("El usuario no existe")
      return false;
    }
  }
  
  async changeUserProfile(newUsername: string, newPassword: string, newRole: 'pasajero' | 'dueno'): Promise<boolean> {
    try {
      if (this.currentUsername === undefined) {
        console.log("Nombre de usuario actual no encontrado");
        return false;
      }
      const userToUpdate = await this.findUserByUsername(this.currentUsername);
  
      if (userToUpdate) {
        userToUpdate.username = newUsername;
        userToUpdate.password = newPassword;
        userToUpdate.role = newRole;
        const users: User[] = (await this.local.get('users')) || [];
        const updatedUsers = users.map((user) => (user.username === this.currentUsername ? userToUpdate : user));
        await this.local.set('users', updatedUsers);
        this.currentUsername = newUsername;
        console.log("Perfil actualizado con éxito");
        return true;
      } else {
        console.log("El usuario no existe");
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      return false;
    }
  }
  

  getCurrentUsername(): string | undefined {
    return this.currentUsername;
  }

  logout() {
    this.validado = false;
    this.route.navigate(['/login']);
  }
}
