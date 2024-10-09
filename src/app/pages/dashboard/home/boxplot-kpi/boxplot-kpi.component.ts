import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import HC_Exporting from 'highcharts/modules/exporting';
import { ClientKpi } from 'src/app/core/models/ClientKpi';
import { KpiType } from 'src/app/core/utils/types';

@Component({
  selector: 'app-boxplot-kpi',
  templateUrl: './boxplot-kpi.component.html',
  styleUrls: ['./boxplot-kpi.component.css']
})
export class BoxplotKpiComponent implements OnInit, OnChanges {
  @Input() data!: ClientKpi;
  @Input() loading = false;
  @Input() chartXLegend!: string;
  @Input()
  kpiType!: KpiType;

  boxplotLabels: any[] = [];
  boxplotSeries: any[] = [];
  chartSet = false;
  Highcharts = Highcharts

  chartOptions: Highcharts.Options = {};
  labelizerFunc: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.labelizerFunc = this.generateLabelizerFunc();
    this.boxplotLabels = [];
    this.boxplotSeries = [];
    if (this.data[this.kpiType]) {
      this.data[this.kpiType].data.forEach(item => {
        this.boxplotSeries.push([
          item.min,
          item.q1,
          item.median,
          item.q3,
          item.max
        ]);
        this.boxplotLabels.push(this.labelizerFunc(item._id));
      });
      this.chartOptions = {
        title: {
          text: 'Durées des requêtes',
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: this.boxplotLabels,
          title: {
            text: this.chartXLegend,
          },
        },
        yAxis: {
          title: {
            text: 'Durée (en milli seconde)',
          },
          plotLines: [
            {
              value: 932,
              color: 'red',
              width: 1,
              label: {
                text: 'Theoretical mean: 932',
                align: 'center',
                style: {
                  color: 'gray',
                },
              },
            },
          ],
        },
        series: [
          {
            name: 'Durées des requêtes',
            data: this.boxplotSeries,
            type: 'boxplot',
          },
        ],
      };

      HC_Exporting(Highcharts);
      More(Highcharts);
      this.chartSet = true;
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }

  private generateLabelizerFunc() {
    let labelizerFn;
    switch (this.kpiType) {
      case 'durationHour':
        labelizerFn = (_id: any) => _id.numHour;
        break;

      case 'durationDay':
        labelizerFn = (_id: any) => _id.numDay;
        break;

      case 'durationMonth':
        labelizerFn = (_id: any) => _id.numMonth+'/'+_id.numYear;
        break;
    
      default:
        labelizerFn = (_id: any) => null;
        break;
    }

    return labelizerFn;
  }

}
