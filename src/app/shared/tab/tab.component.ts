import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}


@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent {

  @Input() tabs: Tab[] = [];
  @Input() activeTabId: string = '';
  @Input() variant: 'underline' | 'pills' | 'enclosed' = 'underline';
  @Output() tabChange = new EventEmitter<string>();

  ngOnInit() {
    // Set first tab as active if no active tab is specified
    if (!this.activeTabId && this.tabs.length > 0) {
      this.activeTabId = this.tabs[0].id;
    }
  }

  selectTab(tab: Tab) {
    if (tab.disabled) return;
    this.activeTabId = tab.id;
    this.tabChange.emit(tab.id);
  }

  getTabClasses(tab: Tab): string {
    const isActive = this.activeTabId === tab.id;
    const baseClasses = 'inline-flex items-center px-1 py-4 text-sm font-medium transition-colors duration-200';
    
    if (tab.disabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed opacity-50 dark:text-gray-600`;
    }

    switch (this.variant) {
      case 'pills':
        return isActive
          ? `${baseClasses} px-4 py-2 bg-blue-600 text-white rounded-lg`
          : `${baseClasses} px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800`;
      
      case 'enclosed':
        return isActive
          ? `${baseClasses} px-4 py-2 bg-white text-blue-600 border-t-2 border-x border-blue-600 rounded-t-lg dark:bg-gray-800 dark:border-blue-500`
          : `${baseClasses} px-4 py-2 text-gray-600 hover:text-gray-900 border-t-2 border-transparent dark:text-gray-400 dark:hover:text-gray-200`;
      
      default: // underline
        return isActive
          ? `${baseClasses} border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500`
          : `${baseClasses} border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600`;
    }
  }

  getBadgeClasses(tab: Tab): string {
    const isActive = this.activeTabId === tab.id;
    return isActive
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

// tab-panel.component.ts
@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isActive) {
      <div [class]="'animate-fadeIn ' + customClass">
        <ng-content></ng-content>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out;
    }
  `]
})
export class TabPanelComponent {
  @Input() tabId: string = '';
  @Input() activeTabId: string = '';
  @Input() customClass: string = '';

  get isActive(): boolean {
    return this.tabId === this.activeTabId;
  }
}
