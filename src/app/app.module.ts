import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptModule} from "nativescript-angular/nativescript.module";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import {CommonModule} from "@angular/common";
import {HeaderComponent, MainComponent, MenuComponent} from "~/app/components";
import {ToastService} from "~/app/services";
import {TodoMapper} from "~/app/mappers";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        CommonModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        MainComponent,
        MenuComponent
    ],
    providers: [
        ToastService,
        TodoMapper
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {
}
