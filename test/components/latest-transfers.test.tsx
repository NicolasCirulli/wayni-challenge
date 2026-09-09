import { render, screen } from "@testing-library/react";

import { LatestTransfers } from "@/components/transfers/LatestTransfers";
describe("LatestTransfers", () => {
  it("muestra el estado vacio cuando no hay movimientos", () => {

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
});