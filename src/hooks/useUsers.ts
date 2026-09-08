"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/user-service";

const USERS_QUERY_KEY = ["users"] as const;

export function useUsers() {
    const query = useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: getUsers,
    });
    return {
        ...query,
        user: query.data?.[0],
        contacts: query.data?.slice(1) ?? [],
    };
}
