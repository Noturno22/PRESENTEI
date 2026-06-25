export function formatKz(valor: number): string {
  // Format with period as thousands separator for Angolan Kwanza
  const [intPart, decPart] = valor.toFixed(2).split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decPart === '00' ? `${formattedInt} Kz` : `${formattedInt},${decPart} Kz`;
}
