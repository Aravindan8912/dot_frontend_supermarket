export interface Category {
  name: string;
  icon: string;
}

export interface FoodItem {
  name: string;
  price: string;
  image?: string;
  discount?: string;
  rating: number;
  distance?: string;
  deliveryTime?: string;
}
