import type { TherapyType } from "$api/reservations/model";

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
	therapyType: TherapyType;
	preferredDates: { date: string; timeFrom: string; timeTo: string }[];
	message: string;
};
