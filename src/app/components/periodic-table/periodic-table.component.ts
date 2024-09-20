import { Component, effect, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { debounce } from 'lodash';
import { PeriodicElement, PeriodicTableStateService } from '../../periodic-table.state';
import { MatIconButton } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { EditElementDialogComponent } from "../edit-element-dialog/edit-element-dialog.component";
import { MatProgressBar } from "@angular/material/progress-bar";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [
    MatPaginator,
    MatSort,
    MatIconButton,
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
    MatProgressBar,
    MatIconButton,
  ],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class PeriodicTableComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  filterValue: string = '';
  loading$;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private stateService: PeriodicTableStateService) {
    this.loading$ = this.stateService.loading; // Assign the reactive signal for loader

    effect(() => {
       // Get the current value of the elements signal
      this.dataSource.data = this.stateService.elements();

      if (this.paginator && this.sort) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '400px',
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.stateService.updateElement(result);
      }
    });
  }

  // The loader is also active during a debounced function work
  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.stateService.setLoader(false); // Stop loader after filtering
  }

  applyFilterDebounced = debounce(this.applyFilter, 2000);

  search(): void {
    this.stateService.setLoader(true); // Start loader when search begins
    this.applyFilterDebounced();
  }
}
