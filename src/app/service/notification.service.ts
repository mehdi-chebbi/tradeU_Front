import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000; // Durée de l'affichage de la notification
    // Position verticale en haut
    config.panelClass = ['custom-snackbar']; // Classe CSS personnalisée pour la notification
    this.snackBar.open(message, 'Close', config);
  }
}
