import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BienserviceService } from 'src/app/service/bienservice.service';
import { JwtService } from 'src/app/service/jwt.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-updatebien',
  templateUrl: './updatebien.component.html',
  styleUrls: ['./updatebien.component.scss']
})
export class UpdatebienComponent implements OnInit{

  updatebienForm!: FormGroup;
  fileToUpload: File | null = null;
  id!:number
  constructor(private act : ActivatedRoute, private service: BienserviceService,
    private fb: FormBuilder,  private router: Router, private notificationService: NotificationService  ,private jwtService: JwtService){}

    ngOnInit() {
      this.id = this.act.snapshot.params['id'];
    
      this.updatebienForm = this.fb.group({
        nom: ['', Validators.required],
        discription: ['', Validators.required],
        prix: ['', Validators.required],
        file: [''] // Ajout de la propriété 'file'
      });
    
      // Appeler le service pour récupérer les détails du bien à partir de son ID
      this.service.getBienById(this.id).subscribe(
        (bien: any) => {
          // Mettre à jour les champs du formulaire avec les données récupérées
          this.updatebienForm.patchValue({
            nom: bien.nom,
            discription: bien.discription,
            prix: bien.prix,
            file: bien.imageUrl// Remarque : ne pas récupérer l'image existante pour l'afficher dans le formulaire
          });
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors de la récupération des détails du bien : ', error);
          // Afficher un message d'erreur ou gérer l'erreur ici si nécessaire
        }
      );
    }
    

submitForm() {
  if (this.updatebienForm.valid) {
    const formData = new FormData();
    formData.append('nom', this.updatebienForm.get('nom')!.value);
    formData.append('discription', this.updatebienForm.get('discription')!.value);
    formData.append('prix', this.updatebienForm.get('prix')!.value);
    formData.append('file', this.updatebienForm.get('file')!.value);

    this.service.updateBien(this.id, formData).subscribe(
      (data: any) => {
        console.log(data);
        this.notificationService.showNotification('Votre bien est modifier.');

        // Rediriger vers la page /retrivebien
        this.router.navigate(['/retrivebien']);
        // Rediriger ou afficher un message de succès ici si nécessaire
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la mise à jour du bien : ', error);
        // Afficher un message d'erreur ou gérer l'erreur ici si nécessaire
      }
    );
  } else {
    console.error('Formulaire invalide');
    // Afficher un message d'erreur ou gérer le formulaire invalide ici si nécessaire
  }
}

onFileChange(event: any) {
  const files: FileList = event.target.files;
  if (files.length > 0) {
    // Obtenez le premier fichier dans la liste
    const file: File = files[0];
    this.updatebienForm.get('file')!.setValue(file);
  } else {
    // Si aucun fichier n'est sélectionné, définissez la valeur du champ de fichier sur null
    this.updatebienForm.get('file')!.setValue(null);
  }
}

logout(): void {
  const token = localStorage.getItem('jwt'); // Récupérer le token JWT depuis le localStorage
  if (token) {
    this.jwtService.logout(token).subscribe(
      (response) => {
        console.log(response); // Afficher la réponse du backend
        // Ajoutez ici la logique de redirection ou de traitement après la déconnexion
        localStorage.removeItem('jwt');// Effacer le token JWT du localStorage
        localStorage.removeItem('name');
        localStorage.removeItem('phone');
        localStorage.removeItem('adress');
        localStorage.removeItem('role');
        this.router.navigateByUrl('/login');


      },
      (error) => {
        console.error(error); // Afficher les erreurs éventuelles
        // Ajoutez ici la logique pour gérer les erreurs de déconnexion
      }
    );
  } else {
    console.warn("No JWT token found in localStorage.");
    // Ajoutez ici la logique pour gérer l'absence de token JWT dans le localStorage
  }
}
}