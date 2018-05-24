import { Component, OnInit } from '@angular/core';
import { CardConfig, DonutConfig } from 'patternfly-ng'

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html'
})
export class DonutComponent implements OnInit {

  constructor() { }
  
  cardConfig: CardConfig = {
    title: 'Donut View',
    noPadding: false
  };

  data: any[] = [
    ['PC', 13],
    ['Tablet', 6],
    ['Phone', 22]
  ];

  donutConfig: DonutConfig = {
    chartId: 'donutChart',
    colors: {
      PC: '#0088ce', // blue
      Tablet: '#3f9c35', // green
      Phone: '#cc0000'// red
    },
    donut: {
      title: 'Inventory'
    },
    legend: {
      show: true
    }
  };

  ngOnInit() {
  }

}
