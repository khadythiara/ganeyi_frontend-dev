import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { ClientKpi } from 'src/app/core/models/ClientKpi';
import { KpiType } from 'src/app/core/utils/types';

@Component({
  selector: 'app-month-kpi',
  templateUrl: './month-kpi.component.html',
  styleUrls: ['./month-kpi.component.css']
})
export class MonthKpiComponent implements OnInit, OnChanges {
  @Input() data: ClientKpi = {};
  @Input() loading = false;
  chartSet = false;
  Highcharts = Highcharts;
  chartOptions = {};
  byMonthLabels: any[] = [];
  byMonthSeries: any[] = [];
  kpiType: KpiType = 'byMonth';
  months = [
    'Jan.',
    'Fév.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'
  ];

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.byMonthLabels = [];
    this.byMonthSeries = [];
    if (this.data[this.kpiType]) {
      for (let i = 0; i < this.data[this.kpiType].data.length; i++) {
        const element = this.data[this.kpiType].data[i];
        this.byMonthLabels.push(this.months[element._id.numMonth-1]+' '+element._id.numYear);
        this.byMonthSeries.push(element.count);
      }

      this.chartOptions = {
        chart: {
          type: 'line',
        },
        title: {
          text: '',
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          verticalAlign: 'top',
          x: 150,
          y: 100,
          floating: true,
          borderWidth: 1,
          backgroundColor:
            '#FCFFC5',
        },
        xAxis: {
          title: {
            text: 'Mois',
          },
          categories: this.byMonthLabels,
        },
        yAxis: {
          title: {
            text: 'Nombre de requêtes',
          },
        },
        tooltip: {
          shared: true,
          valueSuffix: ' requête(s)',
        },
        credits: {
          enabled: false,
        },
        exporting: {
          enabled: true,
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 0.5,
          },
        },
        series: [
          {
            name: 'Mois',
            data: this.byMonthSeries,
          },
        ],
      };

      HC_exporting(Highcharts);
      this.chartSet = true;
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }

}
