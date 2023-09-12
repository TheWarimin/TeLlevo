import { Component,OnInit } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  selectedDate: string;
  user: any;
  nombreUsuario: string = '';
  apellido: string = '';
  nivelEducacion: string = '';
  public alertButtons = ['Si'];
 
  constructor(private route: ActivatedRoute, private router: Router) {
    {
      
      this.selectedDate = '';

    }
  }
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation && navigation.extras && navigation.extras.state) {
      this.user = navigation.extras.state["user"];
      this.nombreUsuario = navigation.extras.state["nombreUsuario"];
      this.apellido = navigation.extras.state["apellidoUsuario"];
      this.nivelEducacion = navigation.extras.state["nivelEducacion"];

    }
  }
  limpiarCampos() {
    this.nombreUsuario = '';
    this.apellido = '';
    this.nivelEducacion = '';
    this.selectedDate = '';
  }
  
}
