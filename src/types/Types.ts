export type User = {
  user_id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductInputFields = {
  product_name: string;
  price: number;
  type: string;
  vendor: string;
  location: string;
  qc: string;
  barcode: string;
};

export type ProductFromCSV = {
  product_name: string;
  price: number;
  barcode: string;
  imei: string;
  vendor: string;
};

export type AppData = {
  locations: {
    location_id: number;
    location_name: string;
  }[];
  vendors: {
    vendor_id: number;
    vendor_name: string;
  }[];
  qcs: {
    qc_id: number;
    qc_name: string;
  }[];
  types: {
    type_id: number;
    type_name: string;
  }[];
  categories: {
    category_id: number;
    category_name: string;
  }[];
};

export type UserData = {
  user_name: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  permissions: number[];
  locations: number[];
};
