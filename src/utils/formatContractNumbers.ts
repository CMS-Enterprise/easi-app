export default function formatContractNumbers(
  contractNumbers: { contractNumber: string }[]
): string {
  return contractNumbers.map(v => v.contractNumber).join(', ');
}
