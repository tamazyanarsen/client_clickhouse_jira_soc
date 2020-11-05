import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    data: { critical: number, normal: number, warning: number };

    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'left',
        }
    };
    // public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
    public pieChartLabels: Label[] = ['Критические', 'Важные', 'Обычные'];
    public pieChartData: SingleDataSet = [300, 500, 100];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [];

    constructor(private dashboardService: DashboardService) {
        monkeyPatchChartJsTooltip();
        monkeyPatchChartJsLegend();
    }

    ngOnInit() {
        this.dashboardService.getIncidentsByType()
            .subscribe((e: { critical: number, normal: number, warning: number }) => {
                this.data = e;
                this.pieChartLabels = [`Критические: ${e.critical}`, `Важные: ${e.warning}`, `Обычные: ${e.normal}`];
                this.pieChartData = [e.critical, e.warning, e.normal];
            });
    }

    ngAfterViewInit() {
    }

}
