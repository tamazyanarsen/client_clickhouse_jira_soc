import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    menuItems: { name: string, url?: string, icon?: string }[] = [
        { name: 'IRP' },
        { name: 'Общая статистика' },
        { name: 'Белые списки' },
        { name: 'SOAR' },
        { name: 'Выйти' }
    ];

    constructor(private authService: AuthService) {
    }

    isAuth = false;

    ngOnInit() {
        this.authService.isAuth.subscribe(e => {
            this.isAuth = e;
        });
    }
}
