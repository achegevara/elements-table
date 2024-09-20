import { Injectable } from '@angular/core';
import { rxState, RxState } from '@rx-angular/state';
import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

interface PeriodicTableState {
  elements: PeriodicElement[];
  loading: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Injectable({
  providedIn: 'root',
})
export class PeriodicTableStateService {
  // rxState for state management + set initial state
  private state = rxState<PeriodicTableState>(({ set }) => set({ elements: [], loading: true }));

  // Exposing parts of the state via signals
  elements = this.state.signal('elements');
  loading = this.state.signal('loading'); // Loader starts as true

  constructor() {

    // Simulate data loading with a 3-second delay
    timer(3000)
      .pipe(
        tap(() => this.setLoader(true)), // Start loading
        map(() => ELEMENT_DATA),
        tap(elements => this.state.set({ elements, loading: false }))
      )
      .subscribe();
  }

  // Method to update an element
  updateElement(updatedElement: PeriodicElement): void {
    this.state.set((state) => ({
      elements: state.elements.map((el) =>
        el.position === updatedElement.position ? updatedElement : el
      ),
    }));
  }

  // Loader setter
  setLoader(value: boolean): void {
    this.state.set({
      loading: value,
    });
  }
}
