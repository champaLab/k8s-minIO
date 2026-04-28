export interface PhoneModel {
    id?: number;
    phoneNumber: string;
    countryCode?: string;
    normalizedNumber?: string;
    status: 'blacklist' | 'graylist' | 'whitelist';
    prefix?: string;
    phoneType?: 'mobile' | 'landline' | 'voip' | 'unknown';
    expireAt?: Date;
}
