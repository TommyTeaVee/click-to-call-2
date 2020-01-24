export type QueryObject = {
  [key: string]: string
}

const queryBuilder = (url: string, queryObject?: QueryObject): string => {
  if (typeof queryObject === 'object') {
    const queries = Object.entries(queryObject).reduce<string[]>((acc, [query, value]) => {
      if (!value) return acc
      acc.push(`${window.encodeURIComponent(query)}=${window.encodeURIComponent(value)}`)
      return acc
    }, [])

    if (!queries.length) return url
    return `${url}?${queries.join('&')}`
  }
  return url
}

export { queryBuilder }
