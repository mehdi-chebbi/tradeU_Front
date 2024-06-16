import { Biens } from 'src/app/Model/bien'; // Adjust the path as needed
import { User } from './user';

export interface Cart {
    idCart: number;
    user: User; // Assuming you have a User model/interface
    biens: Biens[]; // Assuming you have a Bien model/interface

  }
  