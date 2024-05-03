export interface User {
  email: string;
  username: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    postalCode: string;
    city: string;
    addressLine: string;
  }
  phoneNumber: string;
  registrationDate: Date;
  isAdmin: boolean;
}
