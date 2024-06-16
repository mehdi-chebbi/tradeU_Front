
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit{








  ngOnInit() {
    $(".hover").mouseleave(() => {
      $(this).removeClass("hover");
    });
    this.initBlobs();
  }


  private initBlobs(): void {
    const MIN_SPEED = 1.5;
    const MAX_SPEED = 2.5;

    const randomNumber = (min: number, max: number): number => {
      return Math.random() * (max - min) + min;
    };

    class Blob {
      el: HTMLElement;
      size: number;
      initialX: number;
      initialY: number;
      vx: number;
      vy: number;
      x: number;
      y: number;

      constructor(el: HTMLElement) {
        this.el = el;
        const boundingRect = this.el.getBoundingClientRect();
        this.size = boundingRect.width;
        this.initialX = randomNumber(0, window.innerWidth - this.size);
        this.initialY = randomNumber(0, window.innerHeight - this.size);
        this.el.style.top = `${this.initialY}px`;
        this.el.style.left = `${this.initialX}px`;
        this.vx =
          randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
        this.vy =
          randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
        this.x = this.initialX;
        this.y = this.initialY;
      }

      update(): void {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x >= window.innerWidth - this.size) {
          this.x = window.innerWidth - this.size;
          this.vx *= -1;
        }
        if (this.y >= window.innerHeight - this.size) {
          this.y = window.innerHeight - this.size;
          this.vy *= -1;
        }
        if (this.x <= 0) {
          this.x = 0;
          this.vx *= -1;
        }
        if (this.y <= 0) {
          this.y = 0;
          this.vy *= -1;
        }
      }

      move(): void {
        this.el.style.transform = `translate(${this.x - this.initialX}px, ${
          this.y - this.initialY
        }px)`;
      }
    }

    const blobEls = document.querySelectorAll('.bouncing-blob');
    const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl as HTMLElement));

    function update(): void {
      requestAnimationFrame(update);
      blobs.forEach((blob) => {
        blob.update();
        blob.move();
      });
    }

    requestAnimationFrame(update);
  }
}
