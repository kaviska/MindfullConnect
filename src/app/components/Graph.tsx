const Transactions: React.FC = () => {
  const transactions = [
    { name: "Deposit from my Card", date: "28 January 2021", amount: "-$850" },
    { name: "Deposit Paypal", date: "25 January 2021", amount: "+$2,500" },
    { name: "Jemi Wilson", date: "21 January 2021", amount: "+$5,400" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <ul>
        {transactions.map((txn, index) => (
          <li key={index} className="flex justify-between mb-3">
            <div>
              <p className="font-medium">{txn.name}</p>
              <p className="text-sm text-gray-500">{txn.date}</p>
            </div>
            <p className={`font-medium ${txn.amount.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {txn.amount}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;