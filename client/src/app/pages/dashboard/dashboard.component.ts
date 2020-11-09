import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import * as ld from 'lodash';
import { AuthService } from '../../services/auth.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private dashboardService: DashboardService, private authService: AuthService) {
        monkeyPatchChartJsTooltip();
        monkeyPatchChartJsLegend();
    }

    data: { critical: number, normal: number, warning: number };

    widget1Loading = true;
    widget2Loading = true;
    widget3Loading = true;

    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'left',
            labels: {
                fontColor: 'white'
            }
        },
        elements: {
            rectangle: {
                backgroundColor: 'white'
            },
            arc: {
                backgroundColor: 'white',
                borderWidth: 0
            }
        }
    };
    widget3Options = {
        ...this.pieChartOptions,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: 'white'
                },
            }],
            xAxes: [{
                ticks: {
                    fontColor: 'white'
                },
            }]
        },
    };
    // public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
    public pieChartLabels: Label[] = JSON.parse(localStorage.getItem('widget1Labels')) || ['Критические', 'Важные', 'Обычные'];
    public pieChartData: SingleDataSet = JSON.parse(localStorage.getItem('widget1Data')) || [0, 0, 0];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [];

    public widget2Labels = ['', '', ''];
    public widget2Data = [0, 0, 0];

    public widget3Labels = [];
    public widget3Data: any = [{ data: [], label: 'сообщ./сек.' }];

    widget2Total = 0;

    widget3Arr = null;

    isWidget3Minutes = true;

    destroy$ = new Subject();

    widget3Count = 0;

    ngOnDestroy() {
        this.destroy$.next(true);
    }

    ngOnInit() {
        this.dashboardService.getIncidentsByType()
            .subscribe((e: { critical: number, normal: number, warning: number }) => {
                this.data = e;
                this.pieChartLabels = [`Критические: ${e.critical}`, `Важные: ${e.warning}`, `Обычные: ${e.normal}`];
                this.pieChartData = [e.critical, e.warning, e.normal];
                localStorage.setItem('widget1Labels', JSON.stringify(this.pieChartLabels));
                localStorage.setItem('widget1Data', JSON.stringify(this.pieChartData));
                this.widget1Loading = false;
            });

        this.widget2Labels = JSON.parse(localStorage.getItem('widget2Labels')) || this.widget2Labels;
        this.widget2Data = JSON.parse(localStorage.getItem('widget2Data')) || this.widget2Data;
        this.widget2Total = JSON.parse(localStorage.getItem('widget2Total')) || this.widget2Total;
        this.dashboardService.getIncidentsTotal().subscribe((e: {
            perDay: number,
            inProgress: number,
            done: number
        }) => {
            this.widget2Labels = ['Новые за 24 часа', 'В работе', 'Расследовано'];
            this.widget2Data = [e.perDay, e.inProgress, e.done];
            this.widget2Total = e.inProgress + e.done;
            localStorage.setItem('widget2Labels', JSON.stringify(this.widget2Labels));
            localStorage.setItem('widget2Data', JSON.stringify(this.widget2Data));
            localStorage.setItem('widget2Total', JSON.stringify(this.widget2Total));
            this.widget2Loading = false;
        });

        this.widget3Labels = JSON.parse(localStorage.getItem('widget3Labels')) || this.widget3Labels;
        this.widget3Data = JSON.parse(localStorage.getItem('widget3Data')) || this.widget3Data;
        this.dashboardService.getTraffic().subscribe(result => {
            // this.widget3Arr = result;
            this.widget3Labels.push(new Date().toString().split(' ')[4].split(':').slice(0, -1).join(':'));
            if (this.widget3Labels.length > 10) {
                this.widget3Labels.splice(0, 1);
            }

            this.widget3Data[0].data.push(Math.round(+result / 60));
            if (this.widget3Data[0].data.length > 10) {
                this.widget3Data[0].data.splice(0, 1);
            }
            // this.widget3Data = [{ data: (this.widget3Data[0].data || []), label: 'сообщ./сек.' }];

            // console.log(this.widget3Labels, this.widget3Data);
            // this.showWidget3Seconds();
        });

        interval(1000 * 60)
            .pipe(takeUntil(this.destroy$))
            .subscribe(val => {
                this.dashboardService.getTraffic().subscribe(result => {
                    this.widget3Labels.push(new Date().toString().split(' ')[4].split(':').slice(0, -1).join(':'));
                    if (this.widget3Labels.length > 10) {
                        this.widget3Labels.splice(0, 1);
                    }

                    this.widget3Data[0].data.push(Math.round(+result / 60));
                    if (this.widget3Data[0].data.length > 10) {
                        this.widget3Data[0].data.splice(0, 1);
                    }
                });
            });
    }

    logout() {
        this.authService.logout();
    }

    showWidget3Seconds() {
        const result = this.widget3Arr;
        this.widget3Labels = Object.keys(result).map(e => new Date(e).toString().split(' ')[4]);
        this.widget3Data = [{ data: Object.values(result).map((e: any) => e.length), label: 'сообщ./сек.' }];
        localStorage.setItem('widget3Labels', JSON.stringify(this.widget3Labels));
        localStorage.setItem('widget3Data', JSON.stringify(this.widget3Data));
        this.isWidget3Minutes = false;
    }

    showWidget3Minutes() {
        const result = this.widget3Arr;
        const arrData = Object.keys(result).map(e => ({ [e]: result[e].length }));
        const data = ld.groupBy(arrData, e => Object.keys(e)[0].split(':').slice(0, 2).join(':'));
        const perMinuteEvents = Object.values(data)
            .map(e =>
                e.map(v =>
                    Object.values(v)[0]
                )
            )
            .map(e => e.reduce((a, b) => a + b) / e.length);
        this.widget3Labels = Object.keys(data).map(e => e.split(' ')[e.split(' ').length - 1]);
        this.widget3Data = [{ data: perMinuteEvents, backgroundColor: 'green', label: 'сообщ./сек.' }];
        this.isWidget3Minutes = true;
    }

    refreshTraffic() {
        this.isWidget3Minutes ? this.showWidget3Seconds() : this.showWidget3Minutes();
    }

    ngAfterViewInit() {
    }

}
