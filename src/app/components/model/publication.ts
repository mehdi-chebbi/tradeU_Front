import {Reponse} from "./Reponse";
import {User} from "./User";

export interface Publication {
  idPublication?: number;
  publicationContent: string;
  datePublication?: string;
  reponses: Reponse[];
  likes: number;
  dislikes: number;
  publicationCreatedBy?: User;
  likedByUsers: User[];
  dislikedByUsers: User[];
}

