import { render, screen } from "@testing-library/react";

import TransferDetailPage from "@/app/transfer/[id]/detail/page";
import type { User } from "@/types/user";

const mockReplace = jest.fn();
const mockSetAmount = jest.fn();
const mockSetConcept = jest.fn();
const mockResetDraft = jest.fn();
const mockUseWallet = jest.fn();
const mockUseUsers = jest.fn();

type DraftState = {
  from: string;
  recipient: User | null;
  amount: string;
  concept: string;
  setAmount: typeof mockSetAmount;
  setConcept: typeof mockSetConcept;
  resetDraft: typeof mockResetDraft;
};

let mockRouteId = "recipient-1";
let mockDraftState: DraftState;

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: mockRouteId }),
  useRouter: () => ({
    back: jest.fn(),
    replace: mockReplace,
  }),
}));

jest.mock("@/hooks/useWallet", () => ({
  useWallet: () => mockUseWallet(),
}));

jest.mock("@/hooks/useUsers", () => ({
  useUsers: () => mockUseUsers(),
}));

jest.mock("@/store/transfer-draft-store", () => ({
  useTransferDraftStore: (selector: (state: DraftState) => unknown) =>
    selector(mockDraftState),
}));

const owner: User = {
  id: "owner-1",
  firstname: "Nicolás",
  lastname: "Wayni",
  fullname: "Nicolás Wayni",
  avatar: "/images/users/marco.png",
  email: "owner@example.com",
  phone: "123456",
  location: {
    city: "Buenos Aires",
    state: "Buenos Aires",
    country: "Argentina",
  },
};

const recipient: User = {
  id: "recipient-1",
  firstname: "Josefina",
  lastname: "Ruiz",
  fullname: "Josefina Ruiz",
  avatar: "/images/users/josefina.png",
  email: "recipient@example.com",
  phone: "654321",
  location: {
    city: "Córdoba",
    state: "Córdoba",
    country: "Argentina",
  },
};

function arrangePage({
  amount = "10.5",
  concept = "Cena",
  currentRecipient = recipient,
  currentUser = owner,
  balanceCents = 1_050,
  isWalletLoading = false,
  isUserLoading = false,
}: {
  amount?: string;
  concept?: string;
  currentRecipient?: User | null;
  currentUser?: User | null;
  balanceCents?: number;
  isWalletLoading?: boolean;
  isUserLoading?: boolean;
} = {}) {
  mockDraftState = {
    from: "transfer",
    recipient: currentRecipient,
    amount,
    concept,
    setAmount: mockSetAmount,
    setConcept: mockSetConcept,
    resetDraft: mockResetDraft,
  };

  mockUseWallet.mockReturnValue({
    wallet: isWalletLoading
      ? null
      : {
        balanceCents,
        movements: [],
      },
    isLoading: isWalletLoading,
  });

  mockUseUsers.mockReturnValue({
    user: currentUser,
    isLoading: isUserLoading,
  });
}

describe("TransferDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteId = recipient.id;
    arrangePage();
  });

  it.each(["10.5", "10,5", "10.50"])(
    "habilita continuar para el monto válido %s",
    (amount) => {
      arrangePage({ amount });

      render(<TransferDetailPage />);

      expect(
        screen.getByRole("button", { name: "Continuar transferencia" }),
      ).toBeEnabled();
    },
  );

  it.each([
    ["", "Cena"],
    ["0", "Cena"],
    ["0.00", "Cena"],
    ["-1", "Cena"],
    ["10.123", "Cena"],
    ["999999999999999", "Cena"],
    ["10.51", "Cena"],
    ["10.5", ""],
    ["10.5", "   "],
    ["10.5", "Concepto con más de 25 caracteres"],
  ])(
    "deshabilita continuar con monto %j y concepto %j",
    (amount, concept) => {
      arrangePage({ amount, concept });

      render(<TransferDetailPage />);

      expect(
        screen.getByRole("button", { name: "Continuar transferencia" }),
      ).toBeDisabled();
    },
  );

  it("permite enviar exactamente el saldo disponible", () => {
    arrangePage({ amount: "10.50", balanceCents: 1_050 });

    render(<TransferDetailPage />);

    expect(
      screen.getByRole("button", { name: "Continuar transferencia" }),
    ).toBeEnabled();
  });

  it("muestra los datos del destinatario y los campos del borrador", () => {
    arrangePage({ amount: "8.25", concept: "Almuerzo" });

    render(<TransferDetailPage />);

    expect(screen.getByText(recipient.fullname)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Monto a enviar/ })).toHaveValue(
      "8.25",
    );
    expect(screen.getByLabelText("Concepto")).toHaveValue("Almuerzo");
  });

  it.each([
    ["sin destinatario", null, owner, recipient.id],
    ["destinatario distinto a la URL", recipient, owner, "recipient-2"],
    ["auto-transferencia", owner, owner, owner.id],
    ["usuario inexistente", recipient, null, recipient.id],
  ])(
    "redirige al selector ante %s",
    (_scenario, currentRecipient, currentUser, routeId) => {
      mockRouteId = routeId;
      arrangePage({ currentRecipient, currentUser });

      const { container } = render(<TransferDetailPage />);

      expect(container).toBeEmptyDOMElement();
      expect(mockResetDraft).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith("/transfer");
    },
  );

  it("espera los datos sin redirigir", () => {
    arrangePage({ isWalletLoading: true, isUserLoading: true });

    const { container } = render(<TransferDetailPage />);

    expect(container).toBeEmptyDOMElement();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
