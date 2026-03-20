export interface MoviesCategory {
  category: string;
  items: Movie[];
}
export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  poster: string;
  splash: string;
  trailer: string;
  playlink: string;
  logo: string;
  description: string;
  duration?: string;
  ageRating?: string;
}
