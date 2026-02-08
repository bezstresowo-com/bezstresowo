export interface PreferredDate {
	date: string;
	timeFrom: string;
	timeTo: string;
}

export interface ReservationsRequestDto {
	therapyType: string;
	nameAndSurname: string;
	tel: string;
	email: string;
	message?: string;
}
