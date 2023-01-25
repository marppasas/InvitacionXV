import { ComponentType } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogContent, ConfirmDialogData } from "../components/confirm-dialog-content/confirm-dialog-content.component";

export interface Action {
    value: string;
    style: 'primary' | 'secondary' | 'tertiary';
    onClick?: () => void;
}

@Injectable()
export class DialogService {

    private dialogRef: MatDialogRef<any>;

    constructor(
        public dialog: MatDialog
    ) { }

    public openDialog(contentComponent: ComponentType<{}>, data: any, width: number = 600, onComplete?: (_: any) => void): MatDialogRef<any> {
        const dialog = this.dialog.open(contentComponent, <MatDialogConfig>{
            data,
            width: width + "px",
            disableClose: false,
            autoFocus: false
        });
        
        dialog.afterClosed().subscribe(t => {
            if (onComplete) {
                onComplete(t);
            }
        });

        this.dialogRef = dialog;

        return this.dialogRef;
    }

    public confirm(title: string, body: string, confirmText: string, onConfirm: () => void): void {
        let confirmDialog: MatDialogRef<any> | null = null;
        const confirmFn = () => {
            onConfirm();
            confirmDialog?.close();
        }
        
        const data: ConfirmDialogData = {
            title,
            body,
            confirmText,
            onConfirm: confirmFn
        };

        confirmDialog = this.openDialog(ConfirmDialogContent, data, 800);
    }

}