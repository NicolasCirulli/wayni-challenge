import { UserCard } from "@/components/ui/UserCard";

const recentContacts = [
  { name: "Carolina", imageSrc: "/images/users/carolina.png" },
  { name: "Marco", imageSrc: "/images/users/marco.png" },
  { name: "Josefina", imageSrc: "/images/users/josefina.png" },
  { name: "Alonso", imageSrc: "/images/users/alonso.png" },
  { name: "Barbara2", imageSrc: "/images/users/barbara.png" },
  { name: "Carolina2", imageSrc: "/images/users/carolina.png" },
  { name: "Marco2", imageSrc: "/images/users/marco.png" },
  { name: "Josefina2", imageSrc: "/images/users/josefina.png" },
  { name: "Alonso2", imageSrc: "/images/users/alonso.png" },
  { name: "Barbara3", imageSrc: "/images/users/barbara.png" },
] as const;

export function SendAgain() {
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
          {recentContacts.map((contact) => (
            <UserCard
              key={contact.name}
              imageSrc={contact.imageSrc}
              name={contact.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
