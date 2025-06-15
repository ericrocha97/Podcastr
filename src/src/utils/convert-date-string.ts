export function convertDateString(dateString: string): string {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
