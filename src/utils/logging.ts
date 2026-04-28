export function cleanLogBody(body: any, ignoreBodyKeys: string[], hiddenBodyKeys: string[]): any {
  const sanitize = (obj: any): any => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (ignoreBodyKeys.includes(key)) {
        return acc
      }
      acc[key] = hiddenBodyKeys.includes(key) ? '***' : value
      return acc
    }, {} as any)
  }

  if (Array.isArray(body?.data)) {
    return {
      ...body,
      data: body.data.map((item: any) => sanitize(item))
    }
  }

  if (body?.data && typeof body.data === 'object') {
    return {
      ...body,
      data: sanitize(body.data)
    }
  }

  return sanitize(body)
}
