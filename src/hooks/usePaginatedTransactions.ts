import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(shouldAppend: boolean = false): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(null)

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )
    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }
      if (previousResponse.nextPage === null){
        return { data: [...previousResponse.data, ...response.data], nextPage: null }

      }
      if (shouldAppend && previousResponse !== null) {
        return { data: [...previousResponse.data, ...response.data], nextPage: response.nextPage }
      } else {
        return { data: response.data, nextPage: response.nextPage }
        // return { data: response.data, nextPage: response.nextPage }
      }
    })
    
  }, [fetchWithCache, paginatedTransactions, shouldAppend])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
