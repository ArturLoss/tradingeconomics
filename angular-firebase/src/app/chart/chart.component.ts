import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styles: [`
    :host ::ng-deep .highcharts-root {
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class ChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  chartData: any;
  chart: any;
  highcharts = Highcharts;
  public chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Loading...'
    },
    xAxis: {
      categories: ['10', '9', '8', '7', '6', '5']
    },
    yAxis: {
      title: {
        text: 'Values'
      }
    },
    series: [
      {
        name: 'Loading...',
        type: 'spline',
        data: [5,5,5,5,5,5]
      }
    ]
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {}


  udpateData = ((data:any) => {
    this.chart.update({
      chart: {
        type: 'spline'
      },
      title: {
        text: `Data for ${data.Country}`
      },
      xAxis: {
        categories: data.x
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [
        {
          name: data.Category,
          type: 'spline',
          data: data.y
        }
      ]
    })
  })

  ngAfterViewInit(): void {
    this.chart = Highcharts.chart(this.chartContainer.nativeElement, this.chartOptions);

    this.http.get<any>('https://teproject-36eec.web.app/Sweden').subscribe(this.udpateData);
  }

  onDropdownChange(dropdown_event: Event) {
  const target = dropdown_event.target as HTMLSelectElement;
    if (target) {
      this.http.get<any>(`https://teproject-36eec.web.app/${target.value}`).subscribe(this.udpateData);
    }
  }

}
