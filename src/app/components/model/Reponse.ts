import {Publication} from "./publication";
import {User} from "./User";

export interface Reponse {
  idReponse?: number;
  reponse: string;
  date_reponse?: Date;
  publication?: Publication; // Assuming you'll define the Publication model separately
  reponseCreatedBy?: User; // Assuming you'll define the User model separately
  likedByUsers?: User[]; // Assuming you'll define the User model separately
  dislikedByUsers?: User[]; // Assuming you'll define the User model separately
  likes?: number;
  dislikes?: number;
}
