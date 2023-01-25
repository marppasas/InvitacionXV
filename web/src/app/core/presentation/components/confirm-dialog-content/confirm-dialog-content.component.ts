import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Action } from "../../services/dialog.service";

export interface ConfirmDialogData {
    title: string;
    body: string;
    confirmText: string;
    onConfirm: () => void;
}

@Component({
    selector: 'ord-confirm-dialog-content',
    templateUrl: './confirm-dialog-content.component.html',
    styleUrls: [ './confirm-dialog-content.component.scss' ]
})
export class ConfirmDialogContent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogContent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }

    close(): void {
        this.dialogRef.close();
    }
}