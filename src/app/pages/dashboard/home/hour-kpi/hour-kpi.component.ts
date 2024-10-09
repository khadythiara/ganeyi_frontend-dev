import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { ClientKpi } from 'src/app/core/models/ClientKpi';
import { KpiType } from 'src/app/core/utils/types';

@Component({
  selector: 'app-hour-kpi',
  templateUrl: './hour-kpi.component.html',
  styleUrls: ['./hour-kpi.component.css']
})
export class HourKpiComponent implements OnInit, OnChanges {
  @Input() data: ClientKpi = {};
  @Input() loading = false;
  chartSet = false;
  Highcharts = Highcharts;
  chartOptions = {};
  byHourLabels: any[] = [];
  byHourSeries: any[] = [];
  kpiType: KpiType = 'byHour';

  constructor() { }

  ngOnInit(): void {
    this.byHourLabels = [];
    this.byHourSeries = [];
    if (this.data[this.kpiType]) {
      for (let i = 0; i < this.data[this.kpiType].data.length; i++) {
        const element = this.data[this.kpiType].data[i];
        this.byHourLabels.push(element._id.numHour);
        this.byHourSeries.push(element.count);
      }

      this.chartOptions = {
        chart: {
          type: 'areaspline',
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
            text: 'Heures',
          },
          categories: this.byHourLabels,
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
            name: 'Heures',
            data: this.byHourSeries,
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

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

}
