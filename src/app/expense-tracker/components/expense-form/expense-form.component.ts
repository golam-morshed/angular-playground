import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense, ExpenseFormData } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit, OnChanges {
  @Input() expense: Expense | null = null;
  @Input() isEditMode: boolean = false;
  @Output() expenseSubmit = new EventEmitter<ExpenseFormData>();
  @Output() cancel = new EventEmitter<void>();

  expenseForm!: FormGroup;
  categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expense'] || changes['isEditMode']) {
      this.patchForm();
    }
  }

  initializeForm(): void {
    this.expenseForm = this.fb.group({
      date: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  private patchForm(): void {
    if (this.isEditMode && this.expense) {
      this.expenseForm.patchValue({
        date: this.expense.date,
        amount: this.expense.amount,
        category: this.expense.category,
        description: this.expense.description
      });
    } else {
      // Set default date to today
      this.expenseForm.patchValue({
        date: new Date().toISOString().split('T')[0]
      });
    }
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.expenseSubmit.emit(this.expenseForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.expenseForm.reset();
    this.expenseForm.patchValue({
      date: new Date().toISOString().split('T')[0]
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.expenseForm.controls).forEach(key => {
      const control = this.expenseForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.expenseForm.get(fieldName);
    return Boolean(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.expenseForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return 'Amount must be greater than 0';
    }
    return '';
  }
}
