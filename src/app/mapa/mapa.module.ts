import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {NgIf, NgFor} from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MapaPageRoutingModule } from './mapa-routing.module';
import { MapaPage } from './mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    MatMenuModule,
    MatFormFieldModule,
    NgIf,
    NgFor,
    MapaPageRoutingModule,
  ],
  declarations: [MapaPage]
})
export class MapaPageModule {}
