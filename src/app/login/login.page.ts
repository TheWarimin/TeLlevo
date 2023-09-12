import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, Route } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  user={
    usuario:"",
    password:""
    };
    constructor(private router: Router) {}
    goTomapa(){
      this.router.navigate(['/mapa'], { state: { user: this.user } });
    }
    validacion(): boolean {
      if (this.user.usuario.length < 3) {
        alert("El usuario debe tener al menos 3 caracteres.");
        return false;
      }
      if (this.user.usuario === "" || this.user.password === "") {
        alert("Por favor, complete ambos campos.");
        return false;
      }
      return true;
    }
  ngOnInit() {
  }
}
