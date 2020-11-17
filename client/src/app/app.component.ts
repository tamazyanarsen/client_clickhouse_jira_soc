import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    menuItems: { name: string, url?: string, icon?: string }[] = [
        { name: 'IRP' },
        { name: 'Общая статистика' },
        { name: 'Белые списки' },
        { name: 'SOAR' },
        { name: 'Выйти' }
    ];
}
