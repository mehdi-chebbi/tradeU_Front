import { Component, EventEmitter, OnInit } from '@angular/core';
import { Biens } from 'src/app/Model/bien';
import { BienserviceService } from 'src/app/service/bienservice.service';
import { CartService } from 'src/app/service/cart/cart.service';
import { JwtService } from 'src/app/service/jwt.service';
import { CommandService } from 'src/app/service/command.service';
import { Commande } from 'src/app/Model/commande';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { FeedbackserviceService } from 'src/app/service/feedbackservice.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  sortOrder: 'asc' | 'desc' = 'asc';
  totalCartPrice: number = 0;
  appTitle: string = 'My Angular Shop';
  biens: Biens[] = [];
  total: number = 0;
  cartId: number = 0;
  biensInCart: Biens[] = [];
  currentUserId: number = 0;
  searchTerm: string = ''; // Define searchTerm property
  filteredBiens: Biens[] = []; // Define filteredBiens property
  couponCode: string = ''; // Define couponCode property
  totlaprix: number = 0;
  usernom?: string;

  stripe= 'pk_test_51P8Q8tBTPaCAM14teh1JwvbVdcCqDWqwV2XhEC9fRZRAZ2a4Tcc9Xe0gS3iU5QZLAG3Q8viUdgcqh2c44zR4yAzt002OUM2Xsu';

  stripePromise = loadStripe(this.stripe);

  //stripePromise: Promise<any>;
  //stripeApiKey: string = 'pk_test_51P8Q8tBTPaCAM14teh1JwvbVdcCqDWqwV2XhEC9fRZRAZ2a4Tcc9Xe0gS3iU5QZLAG3Q8viUdgcqh2c44zR4yAzt002OUM2Xsu';
  constructor(private biensService: BienserviceService, private http: HttpClient,private cartService: CartService, private jwtService: JwtService, private commandService: CommandService, private feedbackService: FeedbackserviceService) {
   // this.stripePromise = loadStripe(this.stripeApiKey);
   

  }

  ngOnInit(): void {
    this.loadBiens();
    this.loadBiensInCart();
  }

  async pay(): Promise<void> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const payment = {
      name: this.usernom,
      currency: 'usd',
      amount: this.totlaprix*100,
      quantity: '1',
      successUrl: 'http://localhost:4200/success',
      cancelUrl: 'http://localhost:4200/cancel',

    };
  
    const stripe = await this.stripePromise;
    this.http
      .post("http://localhost:8083/apis/payment", payment,{ headers })
      .subscribe((data: any) => {
        // I use stripe to redirect To Checkout page of Stripe platform
        stripe?.redirectToCheckout({
          sessionId: data.id,
        });
      });
  }

  
  loadBiens(): void {
    this.biensService.retrievebiens().subscribe(
      (data: Biens[]) => {
        this.biens = data;
        this.filteredBiens = data; // Initialize filteredBiens with all biens
        console.log(this.biens);
        // Sort biens initially after loading
        
      },
      error => {
        console.error('Error fetching biens:', error);
      }
    );
  }

  // Method to sort biens by price
  sortBiensByPrice(sortOrder: 'asc' | 'desc'): void {
    if (sortOrder === 'asc') {
        this.biens.sort((a, b) => a.prix - b.prix); // Sort in ascending order
    } else {
        this.biens.sort((a, b) => b.prix - a.prix); // Sort in descending order
    }
}
  // Method to toggle sorting order
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    // Call sort method after changing the order
    
  }


  // Method to filter biens based on the search term
  filterBiens(): void {
    if (!this.searchTerm) {
      this.filteredBiens = this.biens; // If search term is empty, show all biens
      return;
    }

    const searchTermLC = this.searchTerm.toLowerCase();
    this.filteredBiens = this.biens.filter(bien => bien.nom.toLowerCase().includes(searchTermLC));
  }

  // Call filterBiens method whenever searchTerm changes
  onSearchTermChange(): void {
    this.filterBiens();
  }

  addToCart(bienId: number): void { 
    console.log([bienId]);
    this.cartService.addBiensToCart([bienId]).subscribe(
      () => {
        console.log('Biens added to cart successfully');
        // Find the bien by its ID and add it to the biensInCart array
        const addedBien = this.biens.find(b => b.id === bienId);
        if (addedBien) {
          this.biensInCart.push(addedBien);
        }
        this.loadBiensInCart();
  
      
      },
      error => {
        console.error('Error adding biens to cart:', error);
        window.location.reload();

      }
    );
  }

  loadBiensInCart(): void {
    this.cartService.getCurrentUser().subscribe(
      (user: any) => {
        const cartId = user.id; // Assuming user.id is the cart ID
        this.cartId = cartId; // Assigning cartId for future use
        this.cartService.getBiensInCart(cartId).subscribe(
          (data: Biens[]) => {
            this.biensInCart = data;
            this.calculateTotalCartPrice();
            this.usernom=user.name;

            console.log(user.name) // Calculate total price after fetching bien items
          },
          (error) => {
            console.error('Error fetching biens in cart:', error);
            console.log(user.name) // Calculate total price after fetching bien items

            this.usernom=user.name;
          }
        );
      },
      (error: any) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  deleteBienFromCart(cartId: number, bienId: number): void {
    this.cartService.deleteBienFromCart(cartId, bienId).subscribe(
      () => {
        console.log('Bien deleted from cart successfully');
        this.loadBiensInCart();
      },
      error => {
        console.error('Error deleting bien from cart:', error);
      }
    );
  }
  applyCoupon(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Proceeding will create the commande. Do you want to continue?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.createCommande(); // Call function to create commande
      }
    });
  }
  
  createCommande(): void {
    this.commandService.createCommandeFromCurrentUser(this.cartId, this.couponCode)
      .subscribe(
        (commande: Commande) => {
          const totalPrice = commande.prixTotal;
  
          this.totlaprix = totalPrice;
          Swal.fire({
            title: 'Total Price',
            text: `Your total price is $${totalPrice}`,
            icon: 'success',
            confirmButtonText: 'Proceed to payement',
          }).then((result) => {
            if (result.isConfirmed) {
              this.pay();
            }
          });
        },
        (error) => {
          console.error('Error creating commande:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to create the commande. Please try again later.',
            icon: 'error'
          });
        }
      );
  }
  


  calculateTotalCartPrice(): void {
    this.totalCartPrice = 0; // Reset total price before calculating
    for (let bien of this.biensInCart) {
      this.totalCartPrice += bien.prix; // Add each bien's price to total
    }
  
  } 



  openFeedbackWindow(bienId: number): void {
    console.log(bienId);
    // Initialize rating variable
    let selectedRating = 0;

    // Use SweetAlert2 to open the window/modal and display the feedback form
    Swal.fire({
        title: 'Leave Feedback',
        html:
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">' +
            '<style>' +
            '   #ratingStars .fa { font-size: 24px; }' +
            '   #ratingStars .checked { color: yellow; }' +
            '   .swal2-textarea { border: 1px solid #ccc; border-radius: 5px; padding: 10px; font-size: 16px; }' +
            '</style>' +
            '<div id="feedbackContent">' +
            '   <textarea id="swal-input1" class="swal2-input swal2-textarea" placeholder="Feedback Content"></textarea>' +
            '</div>' +
            '<div id="ratingStars">' +
            '   <span class="fa fa-star" data-rating="1"></span>' +
            '   <span class="fa fa-star" data-rating="2"></span>' +
            '   <span class="fa fa-star" data-rating="3"></span>' +
            '   <span class="fa fa-star" data-rating="4"></span>' +
            '   <span class="fa fa-star" data-rating="5"></span>' +
            '</div>',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        focusConfirm: false,
        customClass: {
            htmlContainer: 'feedback-swal-html-container',
            popup: 'feedback-swal-popup',
            confirmButton: 'feedback-swal-confirm-button',
            cancelButton: 'feedback-swal-cancel-button'
        },
        didOpen: () => {
            // JavaScript code to populate the feedback form dynamically
            const ratingStars = document.querySelectorAll('#ratingStars .fa');
            ratingStars.forEach(star => {
                star.addEventListener('mouseenter', () => {
                    const rating = parseInt(star.getAttribute('data-rating') || '0');
                    ratingStars.forEach(s => {
                        const sRating = parseInt(s.getAttribute('data-rating') || '0');
                        if (sRating <= rating) {
                            s.classList.add('checked');
                        } else {
                            s.classList.remove('checked');
                        }
                    });
                });
                star.addEventListener('mouseleave', () => {
                    const rating = selectedRating;
                    ratingStars.forEach(s => {
                        const sRating = parseInt(s.getAttribute('data-rating') || '0');
                        if (sRating <= rating) {
                            s.classList.add('checked');
                        } else {
                            s.classList.remove('checked');
                        }
                    });
                });
                star.addEventListener('click', () => {
                    // Store the selected rating
                    selectedRating = parseInt(star.getAttribute('data-rating') || '0');
                });
            });
        }
    }).then((result: any) => {
        if (result.isConfirmed) {
            const contenu = (document.getElementById('swal-input1') as HTMLTextAreaElement).value;
            const ratingEnum = this.getRatingEnum(selectedRating);
            this.submitFeedback(bienId, ratingEnum, contenu);
        }
    });
}
submitFeedback(bienId: number, rating: string, contenu: string): void {
  // Check if the user has already submitted feedback for this Bien in local storage
  const submittedFeedbackKey = `submittedFeedback_${bienId}`;
  const hasSubmittedFeedback = localStorage.getItem(submittedFeedbackKey);  
      const feedbackData = {
          "contenu": contenu,
          "rating": rating,
          "bien": { "id": bienId }
      };
      this.feedbackService.addFeedbackBien(feedbackData).subscribe(
          () => {
              // Feedback added successfully, show success message
              if (rating === 'ONE' || rating === 'TWO') {
                  this.biensService.updateBadFeedCount(bienId).subscribe(
                      () => {
                          Swal.fire('Submitted!', 'Thank you for your feedback.', 'success');
                      },
                      (error) => {
                          Swal.fire('Error!', 'Failed to update badfeedcount. Please try again later.', 'error');
                          console.error('Error updating badfeedcount:', error);
                      }
                  );
              } else {
                  Swal.fire('Submitted!', 'Thank you for your feedback.', 'success');
              }

              // Set flag in local storage indicating that the user has submitted feedback for this Bien
              localStorage.setItem(submittedFeedbackKey, 'true');
          },
          (error) => {
              // Error occurred while submitting feedback, show error message
              Swal.fire('Error!', 'Failed to submit feedback. Please try again later.', 'error');
              console.error('Error submitting feedback:', error);
          }
      );
  
  
}

getRatingEnum(rating: number): string {
    switch (rating) {
        case 1:
            return 'ONE';
        case 2:
            return 'TWO';
        case 3:
            return 'THREE';
        case 4:
            return 'FOUR';
        case 5:
            return 'FIVE';
        default:
            return '';
    }
}



getRatingText(rating: number): string {
  switch (rating) {
      case 1:
          return 'Bad';
      case 2:
          return 'Not Good';
      case 3:
          return 'Good';
      case 4:
          return 'Very Good!';
      case 5:
          return 'Excelent!';
      default:
          return '';
  }
} 




  
  


 
  
}