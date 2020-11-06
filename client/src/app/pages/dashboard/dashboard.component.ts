import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import * as ld from 'lodash';
import { AuthService } from '../../services/auth.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

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
    public pieChartLabels: Label[] = ['Критические', 'Важные', 'Обычные'];
    public pieChartData: SingleDataSet = [0, 0, 0];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [];

    public widget2Labels = ['', '', ''];
    public widget2Data = [0, 0, 0];

    public widget3Labels = new Array(100).fill('');
    public widget3Data: ChartDataSets[] = [{ data: new Array(100).fill(0), label: 'сообщ./сек.' }];

    widget2Total = 0;

    widget3Arr = null;

    isWidget3Minutes = true;

    ngOnInit() {
        this.dashboardService.getIncidentsByType()
            .subscribe((e: { critical: number, normal: number, warning: number }) => {
                this.data = e;
                // this.pieChartLabels = [`Критические: ${e.critical}`, `Важные: ${e.warning}`, `Обычные: ${e.normal}`];
                this.pieChartLabels = [`Критические: ${e.critical}`, `Важные: ${e.warning}`, `Обычные: ${e.normal}`];
                this.pieChartData = [e.critical, e.warning, e.normal];
                this.widget1Loading = false;
            });
        this.dashboardService.getIncidentsTotal().subscribe((e: {
            perDay: number,
            inProgress: number,
            done: number
        }) => {
            this.widget2Labels = ['Новые за 24 часа', 'В работе', 'Расследовано'];
            this.widget2Data = [e.perDay, e.inProgress, e.done];
            this.widget2Total = e.inProgress + e.done;
            this.widget2Loading = false;
        });
        this.dashboardService.getTraffic().subscribe(result => {
            this.widget3Arr = result;
            this.showWidget3Minutes();
            this.widget3Loading = false;
        });
    }

    logout() {
        this.authService.logout();
    }

    showWidget3Seconds() {
        const result = this.widget3Arr;
        this.widget3Labels = Object.keys(result).map(e => new Date(e).toJSON().split('T')[1].split(':').join(':'));
        this.widget3Data = [{ data: Object.values(result).map((e: any) => e.length), label: 'сообщ./сек.' }];
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
