"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function BackButton() {
    const router = useRouter();
    return (
        <button type="button" aria-label="Atrás" onClick={() => router.back()}>
            <Image
                src="/icons/navigation/arrow_left_alt.svg"
                alt=""
                width={32}
                height={32}
            />
        </button>
    )
}