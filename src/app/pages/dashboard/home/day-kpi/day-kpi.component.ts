import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { ClientKpi } from 'src/app/core/models/ClientKpi';
import { KpiType } from 'src/app/core/utils/types';

@Component({
  selector: 'app-day-kpi',
  templateUrl: './day-kpi.component.html',
  styleUrls: ['./day-kpi.component.css']
})
export class DayKpiComponent implements OnInit, OnChanges {
  @Input() data: ClientKpi = {};
  @Input() loading = false;
  chartSet = false;
  Highcharts = Highcharts;
  chartOptions = {};
  byDayLabels: any[] = [];
  byDaySeries: any[] = [];
  kpiType: KpiType = 'byDay';

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.byDayLabels = [];
    this.byDaySeries = [];
    if (this.data[this.kpiType]) {
      for (let i = 0; i < this.data[this.kpiType].data.length; i++) {
        const element = this.data[this.kpiType].data[i];
        this.byDayLabels.push(element._id.numDay);
        this.byDaySeries.push(element.count);
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
            text: 'Jours',
          },
          categories: this.byDayLabels,
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
            name: 'Jours',
            data: this.byDaySeries,
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
