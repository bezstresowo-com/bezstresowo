export type ContactRequestArgs = {
	email: string;
	nameAndSurname: string;
	tel: string;
	message: string;
};

export type ReservationRequestArgs = {
	email: string;
	nameAndSurname: string;
	tel: string;
	therapyType: string;
	preferredDates: { date: string; timeFrom: string; timeTo: string }[];
	message: string;
};
