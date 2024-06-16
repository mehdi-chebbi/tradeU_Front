import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BienserviceService } from 'src/app/service/bienservice.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-addbien',
  templateUrl: './addbien.component.html',
  styleUrls: ['./addbien.component.scss']
})
export class AddbienComponent implements OnInit {
  addbienForm!: FormGroup;
  errorMessage: string = ''; // Propriété pour stocker les messages d'erreur
  fileToUpload: File | null = null; // Ajout de la propriété fileToUpload
  categories: any[] = [];

  constructor(
    private service: BienserviceService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.addbienForm = this.fb.group({
      nom: ['', Validators.required],
      discription: ['', Validators.required],
      prix: ['', Validators.required],
      file: [null, [Validators.required, this.validateFile]],// Ajout de la propriété 'file'
      category: ['', Validators.required]
    });

    this.getCategories();
  }
  validateFile(control: any) {
    const file = control.value;
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Convertir en mégaoctets
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (fileSize > 5) { // 5 Mo est la limite de taille
        return { fileSizeExceeded: true };
      }
     
    }
    return null;
  }
  getCategories() {
    this.service.getCategories().subscribe(
      (data: any) => {
        this.categories = data; // Stocker les catégories récupérées dans la variable du composant
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des catégories : ', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.addbienForm.patchValue({
      file: file
    });
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      // Obtenez le premier fichier dans la liste
      const file: File = files[0];
      this.addbienForm.get('file')!.setValue(file);
    } else {
      // Si aucun fichier n'est sélectionné, définissez la valeur du champ de fichier sur null
      this.addbienForm.get('file')!.setValue(null);
    }
  }

  submitForm() {
    if (this.addbienForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.addbienForm.get('nom')!.value);
    formData.append('discription', this.addbienForm.get('discription')!.value);
    formData.append('prix', this.addbienForm.get('prix')!.value);
    formData.append('file', this.addbienForm.get('file')!.value);
    formData.append('categorie', this.addbienForm.get('category')!.value);

    this.service.addbien(formData).subscribe(
      (response) => {
        console.log("Bien ajouté avec succès: ", response);
        // Rediriger ou afficher un message de confirmation
        this.notificationService.showNotification('Votre bien est en cours de traitement.');

        // Rediriger vers la page /retrivebien
        this.router.navigate(['/retrivebien']);
      },
      (error: any) => {
        console.error("Une erreur s'est produite lors de l'ajout du bien: ", error);
        console.log("Message d'erreur du serveur: ", error.error.message); // Affiche le message d'erreur du serveur dans la console
        if (error && error.error && error.error.message) {
          this.errorMessage = error.error.message; // Affecte le message d'erreur du serveur à la propriété errorMessage pour l'afficher dans l'interface utilisateur
        } else {
          this.errorMessage = "Une erreur s'est produite lors de l'ajout du bien. Veuillez réessayer.";
        }
      }
    );
  }
}