import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    data: { critical: number, normal: number, warning: number };

    widget1Loading = true;
    widget2Loading = true;

    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'left',
        }
    };
    // public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
    public pieChartLabels: Label[] = ['Критические', 'Важные', 'Обычные'];
    public pieChartData: SingleDataSet = [0, 0, 0];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [];

    public widget2Labels = ['', '', ''];
    public widget2Data = [0, 0, 0];

    public widget3Labels = ['1 sec', '2 sec', '3 sec'];
    public widget3Data: ChartDataSets[] = [{data: [1, 2, 3], label: 'сообщ./сек.'}];

    constructor(private dashboardService: DashboardService) {
        monkeyPatchChartJsTooltip();
        monkeyPatchChartJsLegend();
    }

    widget2Total = 0;

    ngOnInit() {
        this.dashboardService.getIncidentsByType()
            .subscribe((e: { critical: number, normal: number, warning: number }) => {
                this.data = e;
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
    }

    ngAfterViewInit() {
    }

}
