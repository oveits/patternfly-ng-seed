import { Component, OnInit } from '@angular/core';
import {MessageHistory} from '../common/message-history';
import {NavigationItemConfig} from 'patternfly-ng';
import {MessageService} from '../common/message.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})

export class NavComponent implements OnInit {
  notifications: any[];
  messageHistory: MessageHistory[];
  navigationItems: NavigationItemConfig[] = [
    {
      title: 'Card View',
      iconStyleClass: 'fa fa-file',
      url: '/home/card'
    },
    {
      title: 'Table View',
      iconStyleClass: 'fa fa-table',
      url: '/home/table'
    },
    {
      title: 'Donut View',
      iconStyleClass: 'fa fa-pie-chart',
      url: '/home/donut'
    }
  ];

  constructor(public messageService: MessageService) {
  }

  ngOnInit(): void {
    this.notifications = this.messageService.get();

    this.messageHistory = this.messageService.getHistory();
  }
}
