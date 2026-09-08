import { UserCard } from "@/components/ui/UserCard";
import type { User } from "@/types/user";

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
        Send Again
      </h2>

      <div className="mt-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-3">
          {contacts.map((contact) => (
            <UserCard
              key={contact.id}
              imageSrc={contact.avatar}
              name={contact.fullname}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
