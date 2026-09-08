import { mapUser } from "@/mappers/user-mapper";
import type { ApiUsersResponse, User } from "@/types/user";

const USERS_API_URL = "https://randomuser.me/api/?results=11&seed=wayni";

export async function getUsers(): Promise<User[]> {
    const response = await fetch(USERS_API_URL);

    if (!response.ok) {
        throw new Error(`Unable to fetch users: ${response.status}`);
    }

    const data = (await response.json()) as ApiUsersResponse;

    return data.results.map(mapUser);
}
