import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth.service';
import { AuthInterceptor } from './auth/services/authInterceptor.service';
import { BoardModule } from './board/board.module';
import { BoardsModule } from './boards/boards.module';
import { HomeModule } from './home/home.module';
import { SocketService } from './shared/services/socket.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    HomeModule,
    BoardsModule,
    BoardModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    SocketService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
