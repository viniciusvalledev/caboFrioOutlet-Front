export function formatCep(raw: string): string {
  const cep = raw.replace(/\D/g, '').slice(0, 8);
  return cep.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}
