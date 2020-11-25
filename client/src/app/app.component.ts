import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    menuItems: { name: string, url?: string, icon?: string, action?: () => void }[] = [
        { name: 'IRP' },
        { name: 'Общая статистика' },
        { name: 'Белые списки' },
        { name: 'SOAR' },
        { name: 'Выйти', action: this.logout.bind(this) }
    ];

    constructor(private authService: AuthService) {
    }

    isAuth = false;
    isMenuVisible = false;

    transformMenuIcon(menuButton: HTMLDivElement) {
        console.log('Вывод' + (menuButton.classList));
        menuButton.classList.toggle('change');
    }

    ngOnInit() {
        this.authService.isAuth.subscribe(e => {
            this.isAuth = e;
        });
    }

    logout() {
        console.log(this);
        this.authService.logout();
    }
}
