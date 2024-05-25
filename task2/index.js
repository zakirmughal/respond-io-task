const findDuplicateTransaction = (transactions = []) => {
  let categoryFirstElement;
  let matchingIndex = -1;
  const duplicateTransaction = [];

  // first sort by category and time
  transactions.sort((a, b) => {
    const previousElement = new Date(a.time).getTime();
    const currentElement = new Date(b.time).getTime();
    return a.category.localeCompare(b.category) || previousElement - currentElement
  })
  // iterate the array and check the condition category and previous time < 60
    .forEach((transaction, index) => {
      // need to keep first catery element.
      if (!index || transaction.category !== categoryFirstElement.category) {
        categoryFirstElement = transaction;
        matchingIndex = -1;
        return false;
      }
      const previousElement = new Date(transactions[index - 1].time).getTime();
      const currentElement = new Date(transaction.time).getTime();
      const seconds = (currentElement - previousElement) / 1000;

      // if next element is less then 60 sec then add first index of category too
      if (matchingIndex < 0 && transaction.category === categoryFirstElement.category && seconds < 60) {
        duplicateTransaction.push(categoryFirstElement);
      }

      // checking < 60
      if (transaction.category === transactions[index - 1].category && seconds < 60) {
        duplicateTransaction.push(transaction);
      }
      matchingIndex += 1;
    });
  duplicateTransaction.sort((a, b) => {
    return a.category.localeCompare(b.category) || a.id - b.id
  })
  console.log(duplicateTransaction)
}

const transactions = [
  {
    id: 3,
    sourceAccount: "A",
    targetAccount: "B",
    amount: 100,
    category: "eating_out",
    time: "2018-03-02T10:34:30.000Z"
  },
  {
    id: 1,
    sourceAccount: "A",
    targetAccount: "B",
    amount: 100,
    category: "eating_out",
    time: "2018-03-02T10:33:00.000Z"
  },
  {
    id: 6,
    sourceAccount: "A",
    targetAccount: "C",
    amount: 250,
    category: "other",
    time: "2018-03-02T10:33:05.000Z"
  },
  {
    id: 4,
    sourceAccount: "A",
    targetAccount: "B",
    amount: 100,
    category: "eating_out",
    time: "2018-03-02T10:36:00.000Z"
  },
  {
    id: 2,
    sourceAccount: "A",
    targetAccount: "B",
    amount: 100,
    category: "eating_out",
    time: "2018-03-02T10:33:50.000Z"
  },
  {
    id: 5,
    sourceAccount: "A",
    targetAccount: "C",
    amount: 250,
    category: "other",
    time: "2018-03-02T10:33:00.000Z"
  },
  {
    id: 7,
    sourceAccount: "A",
    targetAccount: "C",
    amount: 250,
    category: "other",
    time: "2018-03-02T11:33:00.000Z"
  }
];

findDuplicateTransaction(transactions);
