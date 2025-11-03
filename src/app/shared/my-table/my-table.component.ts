// reusable-table.component.ts
import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableAction {
  label: string;
  callback: (item: any) => void;
  icon?: string;
}

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="border-gray-100 border-y dark:border-white/[0.05]">
            <tr>
              @for (column of columns; track column.key) {
                <th 
                  [class]="column.key === columns[0].key ? 'py-3' : 'px-4 py-3'"
                  class="font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  {{ column.label }}
                </th>
              }
              @if (actions && actions.length > 0) {
                <th class="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <span class="sr-only">Action</span>
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/[0.05]">
            @if (paginatedData.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length + (actions?.length ? 1 : 0)" 
                    class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {{ emptyMessage }}
                </td>
              </tr>
            }
            @for (item of paginatedData; track $index) {
              <tr>
                @for (column of columns; track column.key) {
                  <td class="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                    @if (customCellTemplate) {
                      <ng-container 
                        *ngTemplateOutlet="customCellTemplate; context: { $implicit: item, column: column }"
                      ></ng-container>
                    } @else {
                      {{ item[column.key] }}
                    }
                  </td>
                }
                @if (actions && actions.length > 0) {
                  <td class="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                    <div class="relative inline-block">
                      <button 
                        (click)="toggleDropdown($index)"
                        class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <svg
                          class="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      @if (openDropdownIndex === $index) {
                        <div class="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-white/[0.05]">
                          <div class="py-1">
                            @for (action of actions; track action.label) {
                              <button
                                (click)="executeAction(action, item); closeDropdown()"
                                class="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                {{ action.label }}
                              </button>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (data.length > pageSize) {
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.05]">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ data.length }} results
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 1"
              [class.opacity-50]="currentPage === 1"
              [class.cursor-not-allowed]="currentPage === 1"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-white/[0.05] dark:hover:bg-gray-700 disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
            >
              Previous
            </button>
            <span class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              (click)="nextPage()"
              [disabled]="currentPage === totalPages"
              [class.opacity-50]="currentPage === totalPages"
              [class.cursor-not-allowed]="currentPage === totalPages"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-white/[0.05] dark:hover:bg-gray-700 disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ReusableTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() pageSize: number = 10;
  @Input() emptyMessage: string = 'No data available';
  
  @ContentChild('customCell') customCellTemplate?: TemplateRef<any>;
  
  @Output() pageChange = new EventEmitter<number>();

  currentPage: number = 1;
  openDropdownIndex: number | null = null;

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.data.length);
  }

  get paginatedData(): any[] {
    return this.data.slice(this.startIndex, this.endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  toggleDropdown(index: number): void {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  closeDropdown(): void {
    this.openDropdownIndex = null;
  }

  executeAction(action: TableAction, item: any): void {
    action.callback(item);
  }
}