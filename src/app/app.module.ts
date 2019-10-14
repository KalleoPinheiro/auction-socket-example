import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TimmerComponent } from './components/timmer/timmer.component';

registerLocaleData(ptBr);

@NgModule({
  declarations: [AppComponent, TimmerComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
