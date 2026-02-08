export interface PreferredDate {
	date: string;
	timeFrom: string;
	timeTo: string;
}

export interface RegistrationsRequestDto {
	therapyType: string;
	nameAndSurname: string;
	tel: string;
	email: string;
	message?: string;
}
