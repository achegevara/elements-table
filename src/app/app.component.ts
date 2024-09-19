import { Component } from '@angular/core';
import {PeriodicTableComponent} from "./components/periodic-table/periodic-table.component";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [PeriodicTableComponent, PeriodicTableComponent],
  template: `<app-periodic-table></app-periodic-table>`,
})
export class AppComponent {}
