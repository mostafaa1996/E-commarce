import {
  deletePaymentMethod,
  getUserPaymentMethods,
  setCardAsDefault,
} from "@/APIs/UserProfileService";
import { queryClient } from "@/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useUserPaymentPage() {
  const [isAdding, setIsAdding] = useState(false);

  const paymentsQuery = useQuery({
    queryKey: ["profile-payments"],
    queryFn: getUserPaymentMethods,
  });

  const modification = useMutation({
    mutationKey: ["profile-payments"],
    mutationFn: ({ cardId, intent }) => {
      if (intent === "delete") {
        return deletePaymentMethod(cardId);
      }

      if (intent === "setAsDefault") {
        return setCardAsDefault(cardId);
      }

      return null;
    },
    onMutate: async ({ cardId, intent }) => {
      await queryClient.cancelQueries({ queryKey: ["profile-payments"] });

      const previous = queryClient.getQueryData(["profile-payments"]);

      queryClient.setQueryData(["profile-payments"], (oldCards) => {
        if (!oldCards) {
          return [];
        }

        if (intent === "setAsDefault") {
          return oldCards.map((card) => ({
            ...card,
            isDefault: card.id === cardId,
          }));
        }

        if (intent === "delete") {
          return oldCards.filter((card) => card.id !== cardId);
        }

        return oldCards;
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["profile-payments"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-payments"] });
    },
  });

  const loadedCards = paymentsQuery.data || [];
  const hasCards = loadedCards.length > 0;
  const shouldUseGrid = !paymentsQuery.isLoading && !paymentsQuery.error && hasCards;
  const headerInfo = hasCards
    ? `You have ${loadedCards.length} payment methods`
    : "You have no payment methods";

  function handleAdd() {
    setIsAdding(true);
  }

  function handleCancel() {
    setIsAdding(false);
  }

  function handleSetAsDefault(id) {
    modification.mutate({ cardId: id, intent: "setAsDefault" });
  }

  function handleDelete(id) {
    modification.mutate({ cardId: id, intent: "delete" });
  }

  return {
    loadedCards,
    isLoading: paymentsQuery.isLoading,
    error: paymentsQuery.error,
    isAdding,
    hasCards,
    shouldUseGrid,
    headerInfo,
    handleAdd,
    handleCancel,
    handleSetAsDefault,
    handleDelete,
  };
}
