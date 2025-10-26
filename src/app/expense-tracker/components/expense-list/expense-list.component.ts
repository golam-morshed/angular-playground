import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  @Input() expenses: Expense[] = [];
  @Output() editExpense = new EventEmitter<Expense>();
  @Output() deleteExpense = new EventEmitter<number>();

  ngOnInit(): void {}

  onEdit(expense: Expense): void {
    this.editExpense.emit(expense);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.deleteExpense.emit(id);
    }
  }
}
