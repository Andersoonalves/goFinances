import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/fromatDates';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  function formatTransitionsValues(transaction: Transaction[]): Transaction[] {
    transaction.forEach(trans => {
      const temp = formatValue(trans.value);
      trans.formattedValue = trans.type === 'income' ? temp : `- ${temp}`;
    }, transaction);

    return transaction;
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      await api.get('/transactions').then(response => {
        setTransactions(formatTransitionsValues(response.data.transactions));
        setBalance(response.data.balance);
      });
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transation => (
                <tr key={transation.id}>
                  <td className="title">{transation.title}</td>
                  <td className={transation.type}>
                    {transation.formattedValue}
                  </td>
                  <td>{transation.category.title}</td>
                  <td>{formatDate(transation.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
