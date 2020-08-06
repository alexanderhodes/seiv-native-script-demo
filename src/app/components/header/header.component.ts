import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "ns-header",
    templateUrl: "./header.component.html"
})
export class HeaderComponent {

    @Input()
    open: boolean;
    @Input()
    title: string;
    @Input()
    target: string;

    constructor(private router: Router) {}

    toggleOpen(): void {
        this.router.navigate([this.target], { skipLocationChange: true }).then();
    }

}
