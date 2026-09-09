const AUX = [1, 2, 3, 4, 5, 6, 7]
export function LatestTransfersSkeleton() {
    return <ul role="status" aria-label="Cargando últimas transferencias" className="flex flex-col gap-4">
        {
            AUX.map(e => <li key={e} className="w-full grid grid-cols-[2fr_1fr] justify-between items-center gap-4 px-2">
                <div className="flex gap-2 items-center">
                    <div className="rounded-full size-[60px] bg-muted-foreground animate-pulse"></div>
                    <div>
                        <div className="h-4 w-16 animate-pulse rounded bg-muted-foreground"></div>
                        <div className="h-4 w-20 animate-pulse rounded bg-muted-foreground"></div>
                    </div>
                </div>
                <div className="h-6 w-20 animate-pulse rounded bg-muted-foreground"></div>
            </li>)
        }
    </ul>
}