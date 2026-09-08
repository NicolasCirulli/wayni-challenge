export function UserHeaderError() {
    return (
        <div
            className="flex items-center gap-[14px] lg:flex-col lg:gap-[32px]"
            role="status"
            aria-label="Error al cargar el usuario"
        >
            <div className="size-[34px] shrink-0 rounded-full bg-gray-300 lg:size-[64px]" />
        </div>
    );
}
