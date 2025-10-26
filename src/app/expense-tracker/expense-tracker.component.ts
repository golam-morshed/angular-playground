import { Component, OnInit, ViewChild } from '@angular/core';
import { Expense, ExpenseFormData } from './models/expense.model';
import { ExpenseService } from './services/expense.service';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';

@Component({
  selector: 'app-expense-tracker',
  templateUrl: './expense-tracker.component.html',
  styleUrls: ['./expense-tracker.component.scss']
})
export class ExpenseTrackerComponent implements OnInit {
  @ViewChild(ExpenseFormComponent) expenseFormComponent!: ExpenseFormComponent;
  
  expenses: Expense[] = [];
  selectedExpense: Expense | null = null;
  isEditMode: boolean = false;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
      }
    });
  }

  onExpenseSubmit(expenseData: ExpenseFormData): void {
    if (this.isEditMode && this.selectedExpense) {
      this.expenseService.updateExpense(this.selectedExpense.id, expenseData).subscribe({
        next: (updatedExpense) => {
          console.log('Expense updated:', updatedExpense);
          this.loadExpenses();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating expense:', error);
        }
      });
    } else {
      this.expenseService.addExpense(expenseData).subscribe({
        next: (newExpense) => {
          console.log('Expense added:', newExpense);
          this.loadExpenses();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding expense:', error);
        }
      });
    }
  }

  onEditExpense(expense: Expense): void {
    this.selectedExpense = expense;
    this.isEditMode = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDeleteExpense(id: number): void {
    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        console.log(`Expense is deleted successfully`);
        this.loadExpenses();
        if (this.selectedExpense?.id === id) {
          this.resetForm();
        }
      },
      error: (error) => {
        console.error('Error deleting expense:', error);
      }
    });
  }

  onCancelForm(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.selectedExpense = null;
    this.isEditMode = false;
    // Also reset the child form component
    if (this.expenseFormComponent) {
      this.expenseFormComponent.resetFormFromParent();
    }
  }
}