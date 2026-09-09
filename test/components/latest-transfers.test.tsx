import { render, screen } from "@testing-library/react";

import { LatestTransfers } from "@/components/transfers/LatestTransfers";
describe("LatestTransfers", () => {
  it("muestra el estado vacío cuando no hay movimientos", () => {

    render(<LatestTransfers movements={[]} />);

    expect(
      screen.getByText(/^Todavía no hay movimientos$/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /^acá te vamos a mostrar los movimientos cuando empieces a utilizar tu billetera.$/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("list"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryAllByRole("listitem"),
    ).toHaveLength(0);
  });

  it("muestra el participante y el monto según la dirección", () => {
    render(
      <LatestTransfers
        movements={[
          {
            id: "movement-1",
            type: "transfer",
            direction: "outgoing",
            participant: {
              id: "user-1",
              name: "Rose Fleury",
              image: "/images/users/josefina.png",
            },
            concept: "Transferencia",
            amountCents: 60_000,
            date: new Date("2026-09-08T12:00:00.000Z"),
          },
        ]}
      />,
    );

    expect(screen.getByText("Rose Fleury")).toBeInTheDocument();
    expect(screen.getByText(/^-/)).toHaveClass("text-destructive");
    expect(
      screen.getByRole("img", { name: "Avatar usuario Rose Fleury" }),
    ).toBeInTheDocument();
  });
});
