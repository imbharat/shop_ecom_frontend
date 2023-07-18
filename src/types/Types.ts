type VendorCustomerLocationCommon = {
  address: string;
  city: string;
  pincode: number;
  state: string;
  country: string;
};

type VendorCustomerCommon = VendorCustomerLocationCommon & {
  email: string;
  phone: string;
};

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
  cost_price: number;
  type: string;
  vendor: string;
  location: string;
  physical_qc: string;
  screen_qc: string;
  ram: string;
  storage: string;
  barcode: string;
};

export type ImportExcelData<T> = {
  data: T[];
  errors: string[];
};

export type BulkAddProducts = {
  product_name: string;
  cost_price: number;
  barcode: string;
  imei: string;
  vendor: string;
};

export type BulkSellProducts = {
  product_id: number;
  product_name: string;
  imei: string;
  barcode: string;
  cost_price: number;
  sell_price: number;
  customer_name: string;
  location: string;
};

export type BulkMoveProducts = {
  product_id: number;
  product_name: string;
  imei: string;
  barcode: string;
  location: string;
};

export type SellProducts = {
  customer_name: string;
  products: {
    product_id: number;
    cost_price: number;
    sell_price: number;
  }[];
};

export type UserInputFields = {
  user_name: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone: string;
};

export type CustomerInputFields = {
  customer_name: string;
} & VendorCustomerCommon;

export type VendorInputFields = {
  vendor_name: string;
} & VendorCustomerCommon;

export type LocationInputFields = {
  location_name: string;
} & VendorCustomerLocationCommon;

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
