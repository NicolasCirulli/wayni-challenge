const CONTACT_SKELETONS = [0, 1, 2, 3, 4];

export function SendAgainSkeleton() {
  return (
    <section aria-labelledby="send-again-title" className="lg:flex lg:flex-col lg:gap-4 lg:items-center">
      <h2
        id="send-again-title"
        className="mx-auto max-w-[390px] lg:mx-0 lg:max-w-none lg:text-left text-center text-xl leading-6 font-bold text-foreground"
      >
        Enviar de nuevo
      </h2>

      <div className="mt-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-3">
          {CONTACT_SKELETONS.map((_, index) => (
            <div
              key={`contact-skeletons-${index}`}
              className="flex flex-col items-center gap-[14px] lg:flex-col lg:gap-[32px]"
              role="status"
              aria-label="Cargando contactos"
            >
              <div className="size-[64px] shrink-0 animate-pulse rounded-full bg-gray-300 lg:size-[64px]" />
              <div className="h-[18px] w-28 animate-pulse rounded bg-gray-300 lg:h-6 lg:w-36" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
