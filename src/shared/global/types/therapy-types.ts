export const THERAPY_TYPES = ['individual', 'couples', 'group', 'other'] as const;
export type TherapyType = (typeof THERAPY_TYPES)[number];

export interface PreferredDate {
	date: string;
	timeFrom: string;
	timeTo: string;
}

export interface ReservationsRequestDto {
	therapyType: TherapyType;
	preferredDates: PreferredDate[];
	nameAndSurname: string;
	tel: string;
	email: string;
	message?: string;
}
