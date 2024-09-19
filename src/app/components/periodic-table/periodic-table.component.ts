import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { cloneDeep, debounce } from 'lodash';
import { EditElementDialogComponent } from "../edit-element-dialog/edit-element-dialog.component";
import { MatIconButton } from "@angular/material/button";
import { MatProgressBar } from "@angular/material/progress-bar";

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
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

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    EditElementDialogComponent,
    MatIconButton,
    MatProgressBar,
  ],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})

export class PeriodicTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  filterValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) {
    setTimeout( () => this.dataSource.data = ELEMENT_DATA, 3000 );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '400px',
      data: cloneDeep(element),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateElement(result);
      }
    });
  }

  updateElement(updatedElement: PeriodicElement): void {
    const index = this.dataSource.data.findIndex(
      (el) => el.position === updatedElement.position
    );
    if (index !== -1) {
      this.dataSource.data = this.dataSource.data.map(elem => elem.position === updatedElement.position ? updatedElement : elem);
      this.dataSource._updateChangeSubscription(); // Refresh the dataSource
    }
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase()
  }

  applyFilterDebounced = debounce(this.applyFilter, 2000);
}
