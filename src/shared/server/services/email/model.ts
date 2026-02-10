export type ContactRequestMessageArgs = {
	email: string;
	nameAndSurname: string;
	tel: string;
	message: string;
};

export type ConsultationRegistrationMessageArgs = {
	email: string;
	nameAndSurname: string;
	tel: string;
	therapyName: string;
	message: string;
};

export type ShopBuyMessageArgs = {
	email: string;
	nameAndSurname: string;
	productName: string;
	price: string;
	currency: string;
	tel: string;
};
