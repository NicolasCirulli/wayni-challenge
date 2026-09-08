import { UserCard } from "@/components/ui/UserCard";
import type { User } from "@/types/user";
import Link from "next/link";

type SendAgainProps = {
  contacts: User[];
};

export function SendAgain({ contacts }: SendAgainProps) {
  return (
    <section aria-labelledby="send-again-title" className="lg:flex lg:flex-col lg:gap-4 lg:items-center">
      <h2
        id="send-again-title"
        className="mx-auto max-w-[390px] lg:mx-0 lg:max-w-none lg:text-left text-center text-xl leading-6 font-bold text-foreground"
      >
        Enviar de nuevo
      </h2>

      <div className="mt-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {contacts.length === 0 && (<div className="flex items-center justify-around h-[98px] gap-12 mx-auto">
          <span className="text-muted-foreground text-sm">Sin destinatarios recientes</span>
          <Link className="p-2 bg-primary text-white rounded-lg" href={`/transfers`}>Iniciar una transferencia</Link>
        </div>)}
        <div className="flex w-max gap-3">
          {contacts.length > 0 &&
            contacts.map((contact) => (
              <UserCard
                key={contact.id}
                imageSrc={contact.avatar}
                name={contact.fullname}
              />
            ))
          }
        </div>
      </div>
    </section>
  );
}
