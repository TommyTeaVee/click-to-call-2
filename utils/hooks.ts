import { useState, useEffect } from 'preact/hooks'
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'

import { queryBuilder, QueryObject } from './functions'

interface UseAxiosOptions<T> extends AxiosRequestConfig {
  url: string
  query?: QueryObject
  skipResult?: boolean
  transformData?: (data: AxiosResponse) => T
}

interface UseAxiosState<T> {
  loading: boolean
  error: AxiosError | null
  data: T
}

type UseAxios<T> = [UseAxiosState<T>, (params: UseAxiosOptions<T>) => void]

const useAxios = <T>(
  { url, query, ...requestOptions }: UseAxiosOptions<T>,
  defaultValue: T,
  opts: any[] = []
): UseAxios<T> => {
  const [{ loading, error, data }, setResponse] = useState<UseAxiosState<T>>({
    loading: false,
    error: null,
    data: defaultValue
  })
  const [fetch, setFetch] = useState({
    url: queryBuilder(url, query),
    requestOptions
  })

  const refetch = (params?: UseAxiosOptions<T>): void => {
    const { url, query, ...newOptions } = params || {}
    if (!params) {
      // Do simple refetch based on last request configuration
      setFetch({
        ...fetch
      })
    }
    if (url) {
      setFetch({
        url: queryBuilder(url, query),
        requestOptions: newOptions
      })
    }
  }

  useEffect(() => {
    let canceled = false
    async function makeRequest(): Promise<void> {
      setResponse(state => ({
        ...state,
        error: null,
        loading: true
      }))
      try {
        const result = await axios.request({
          url: fetch.url,
          method: 'get',
          ...fetch.requestOptions
        })
        if (!canceled) {
          const data =
            typeof fetch.requestOptions.transformData === 'function'
              ? await fetch.requestOptions.transformData(result)
              : result.data
          setResponse(state => ({
            ...state,
            loading: false,
            error: null,
            ...(fetch.requestOptions.skipResult ? null : { data })
          }))
        }
      } catch (error) {
        console.error('[useAxios] ', error)
        setResponse(state => ({
          ...state,
          loading: false,
          error
        }))
      }
    }

    if (fetch.url) makeRequest()
    return (): void => {
      canceled = true
    }
  }, [fetch, ...opts])

  return [{ loading, error, data }, refetch]
}

export { useAxios }
