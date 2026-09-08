export function SendAgainError({ refetch }: { refetch: () => void }) {
    return (
        <section aria-labelledby="send-again-title" className="lg:flex lg:flex-col lg:gap-4 lg:items-center">
            <h2
                id="send-again-title"
                className="mx-auto max-w-[390px] lg:mx-0 lg:max-w-none lg:text-left text-center text-xl leading-6 font-bold text-foreground"
            >
                Enviar de nuevo
            </h2>

            <div className="py-6 text-center h-[64px]">
                <p className="text-sm text-muted-foreground">
                    No pudimos cargar tus datos
                </p>

                <button
                    type="button"
                    onClick={() => refetch()}
                    className="text-sm font-semibold text-accent"
                >
                    Reintentar
                </button>
            </div>
        </section>
    );
}
