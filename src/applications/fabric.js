export const evaluateTransaction = async (contract, transactionName, transactionArgs) => {
  const transaction = contract.createTransaction(transactionName);
  const transactionId = transaction.getTransactionId();
  const payload = await transaction.evaluate(...transactionArgs);

  return payload;
};

export const submitTransaction = async (contract, transactionName, transactionArgs) => {
  const transaction = contract.createTransaction(transactionName);
  const transactionId = transaction.getTransactionId();
  const payload = await transaction.submit(...transactionArgs);

  return payload;
};
