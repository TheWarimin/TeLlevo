import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'

interface User {
  username: string;
  password: string;
}

interface Trip {
  id: number; 
  address: string; 
  departureTime: string; 
  pricePerPerson: number; 
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
  
  addTrip(address: string, departureTime: string, pricePerPerson: number) {
    const newTrip: Trip = {
      id: this.trips.length + 1,
      address,
      departureTime,
      pricePerPerson,
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
  
  async register(username: string, password: string) {
    const users = await this.local?.get('users') || [];
    const existe = users.find((us: User) => us.username === username && us.password === password);
    if (existe) {
      console.log("Usuario Existente")
    } else {
      const nuevo: User = { username, password };
      users.push(nuevo);
      await this.local.set('users', users);
      console.log("Registro Exitoso")
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    const users: User[] = (await this.local.get('users')) || [];
    const user = users.find((us: User) => us.username === username && us.password === password);
    if (user) {
      console.log("logeado (validado correctamente)")
      this.validado = true;
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
  

  logout() {
    this.validado = false;
    this.route.navigate(['/login']);
  }
}
