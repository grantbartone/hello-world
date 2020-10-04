import React from 'react'

export default function Transactions({ dismissApp }) {
    return (
        <div>
            Hello Transactions
            <button onClick={dismissApp}>Dismiss</button>

            <div id="transactionForm">
                <h1>Create a New Transaction:</h1>
                <form id="createTransaction" onsubmit="return handleCreateTransaction()">
                        <input type="text" name="created" placeholder="YYYY-MM-DD" maxlength="10"
                            onkeypress="return validCreatedDateKey(event)" required />
                        <input type="text" name="merchant" placeholder="Merchant Name" required />
                        <input type="number" name="amount" placeholder="Amount (100=$1.00)" required />
                        <input type="submit" value="Add" />
                </form>
            </div>

            <div id="transactionTable">
                <h1 class="transactionsHeader">Transactions:</h1>
                <table>

                    <thead>
                        <tr>
                            <th>Transaction Date</th>
                            <th>Merchant</th>
                            <th>Amount</th>
                        </tr>
                    </thead>

                    <tbody id="transactionTableBody">
                        {/* <!-- Add the transaction rows here --> */}
                    </tbody>

                </table>
            </div>
        </div>
    )
}
