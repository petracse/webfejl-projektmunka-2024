import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnInit{
  question!: string;
  positiveAnswer!: string;
  negativeAnswer!: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.question = this.data.question || 'Are you sure?';
    this.positiveAnswer = this.data.positiveAnswer || 'Yes';
    this.negativeAnswer = this.data.negativeAnswer || 'No';
  }


}
