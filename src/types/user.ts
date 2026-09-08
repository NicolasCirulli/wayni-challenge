export interface ApiUserName {
    title: string;
    first: string;
    last: string;
}

export interface ApiUserLocation {
    street: {
        number: number;
        name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
    coordinates: {
        latitude: string;
        longitude: string;
    };
    timezone: {
        offset: string;
        description: string;
    };
}

export interface ApiUserLogin {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
}

export interface ApiUserDate {
    date: string;
    age: number;
}

export interface ApiUserIdentifier {
    name: string | null;
    value: string | null;
}

export interface ApiUserPicture {
    large: string;
    medium: string;
    thumbnail: string;
}

export interface ApiUserResponse {
    gender: string;
    name: ApiUserName;
    location: ApiUserLocation;
    email: string;
    login: ApiUserLogin;
    dob: ApiUserDate;
    registered: ApiUserDate;
    phone: string;
    cell: string;
    id: ApiUserIdentifier;
    picture: ApiUserPicture;
    nat: string;
}

export interface ApiUsersResponse {
    results: ApiUserResponse[];
    info: {
        seed: string;
        results: number;
        page: number;
        version: string;
    };
}

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    fullname: string;
    avatar: string;
    email: string;
    phone: string;
    location: {
        city: string;
        state: string;
        country: string;
    };
}
