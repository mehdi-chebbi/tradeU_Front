import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Biens } from 'src/app/Model/bien';
import { CartService } from 'src/app/service/cart/cart.service';
const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import { Coupon } from 'src/app/Model/coupon';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  @ViewChild('contentToConvert') contentToConvert!: ElementRef;
  generatedCoupon: Coupon | undefined ;
  biensInCart: Biens[] = [];
  totalCartPrice: number = 0;
  usernom: string = '';

  constructor(private cartService: CartService, private router: Router,) {}

  ngOnInit(): void {
    this.loadBiensInCart();
    this.generateCoupon();

  }

  loadBiensInCart(): void {
    this.cartService.getCurrentUser().subscribe(
      (user: any) => {
        const cartId = user.id; // Assuming user.id is the cart ID
        this.cartService.getBiensInCart(cartId).subscribe(
          (data: Biens[]) => {
            this.biensInCart = data;
            this.calculateTotalCartPrice();
            this.usernom = user.name;
            this.generateCoupon(); // Call generateCoupon method after loading biens in cart
          },
          (error) => {
            console.error('Error fetching biens in cart:', error);
            this.usernom = user.name;
          }
        );
      },
      (error: any) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  calculateTotalCartPrice(): void {
    this.totalCartPrice = this.biensInCart.reduce(
      (total, bien) => total + bien.prix,
      0
    );
  }

  navigateToMarket(): void {
    this.router.navigate(['/market']);
    localStorage.setItem('couponGenerated', 'false');

  }

  captureVisibleContent() {
    const element = document.getElementById('contentToConvert');
    if (element) {
      return html2canvas(element, { scrollY: -window.scrollY }).then(canvas => {
        return canvas.toDataURL('image/png');
      });
    } else {
      console.error("Element with ID 'contentToConvert' not found");
      return Promise.reject("Element not found");
    }
  }
  

  downloadImage() {
    this.captureVisibleContent().then(dataUrl => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'page_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(error => {
      console.error("Failed to capture content:", error);
      // Handle error appropriately
    });

  }

  generateCoupon(): void {
    const couponGenerated = localStorage.getItem('couponGenerated');
    if (couponGenerated === 'true') {
      console.log('A coupon has already been generated.');
      return;
    }
  
    this.cartService.generateCoupon().subscribe(
      (coupon: Coupon) => {
        this.generatedCoupon = coupon;
      },
      (error) => {
        console.error('Error generating coupon:', error);
      }
    );
  }
  
}
