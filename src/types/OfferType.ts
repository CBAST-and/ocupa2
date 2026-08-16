export type ContractType = "temporal" | "fijo" | "horas";

export type OfferLocation = {
  lat: number;
  lng: number;
};

export type OfferPayment = {
  amount: number;
  currency: string;
  period: string;
};

export type OfferQuestion = {
  id: string;
  label: string;
  type: "text" | "date" | "select" | "check";
  required: boolean;
  options?: string[];
};

/* La API devuelve customAnswers a veces como objeto y a veces como arreglo vacío,
   dependiendo de si la oferta tiene respuestas personalizadas configuradas */
export type OfferCustomAnswers = Record<string, unknown> | unknown[];

export type Offer = {
  id: string;
  jobTypeKey: string;
  jobTypeName: string;
  contractType: ContractType;
  description: string;
  address: string;
  location: OfferLocation;
  payment: OfferPayment;
  photo: string;
  deadline: string | null;
  customAnswers: OfferCustomAnswers;
  questions: OfferQuestion[];
  status: string;
  applicantsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  isIdentityRevealed: boolean;
  likedByMe: boolean;
};

export type JobTypeCustomField = {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

export type JobType = {
  id: string;
  key: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  customFields: JobTypeCustomField[];
};

export type OffersFilter = {
  jobTypeKey?: string;
  contractType?: ContractType;
};
