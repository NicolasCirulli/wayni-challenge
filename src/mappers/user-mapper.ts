import type { ApiUserResponse, User } from "@/types/user";

export function mapUser(apiUser: ApiUserResponse): User {
    const { first, last } = apiUser.name;

    return {
        id: apiUser.login.uuid,
        firstname: first,
        lastname: last,
        fullname: `${first} ${last}`,
        avatar: apiUser.picture.large,
        email: apiUser.email,
        phone: apiUser.phone,
        location: {
            city: apiUser.location.city,
            state: apiUser.location.state,
            country: apiUser.location.country,
        },
    };
}
