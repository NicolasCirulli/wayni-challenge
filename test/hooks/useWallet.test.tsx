import { act, renderHook, waitFor } from "@testing-library/react"
import { useWallet } from "@/hooks/useWallet"
import { applyMovement, createMovement, saveWallet } from "@/services/wallet-service"

describe("useWallet", () => {
    beforeEach(() => {
        localStorage.clear()

        saveWallet({
            balanceCents: 10_000,
            movements: []
        })
    })

    it("actualizar saldo y historial despues de una transferencia", async () => {
        const { result } = renderHook(() => useWallet())

        await waitFor(() => {
            expect(result.current.wallet).not.toBeNull()
        })

        expect(result.current.wallet?.balanceCents).toBe(10_000);
        expect(result.current.wallet?.movements).toHaveLength(0);

        const movement = createMovement({
            recipient: {
                id: "1",
                name: "Nicolas",
                image: "/nicolas.png"
            },
            amountCents: 2_500,
            concept: "Test"
        })

        act(() => applyMovement(movement))
        await waitFor(() => {
            expect(result.current.wallet?.balanceCents).toBe(7_500)
            expect(result.current.wallet?.movements).toHaveLength(1)
        })

        expect(result.current.wallet?.movements[0]).toMatchObject({
            id: movement.id,
            amountCents: 2_500,
            concept: "Test",
            direction: "outgoing"
        })
    })
})