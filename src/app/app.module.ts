import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { AppComponent } from './app.component';
import { ROUTING } from "./app.routing";
import { RevitConverterComponent } from './revit-converter/revit-converter.component';
import { FileUploadModule } from "ng2-file-upload";
import { AuthenticateComponent } from './authenticate/authenticate.component';

@NgModule({
    declarations: [
        AppComponent,
        RevitConverterComponent,
        AuthenticateComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        ClarityModule,
        ROUTING,
        FileUploadModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
