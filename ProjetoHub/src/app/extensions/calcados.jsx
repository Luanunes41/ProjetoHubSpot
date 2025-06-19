import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Text,
  Input,
  Button,
  Flex,
} from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';

hubspot.extend(({ runServerlessFunction, context, actions }) => (
  <Calcados runServerless={runServerlessFunction} sendAlert={actions.addAlert} />
));

function Calcados({ runServerless, sendAlert }) {
  const [calcados, setCalcados] = useState([]);
  const [extrato, setExtrato] = useState([]);
  const [novoCalcado, setNovoCalcado] = useState({
    tipo: '',
    unidade: '',
    preco: '',
  });

  const adicionarCalcado = () => {
    const { tipo, unidade, preco } = novoCalcado;

    if (!tipo || !unidade || !preco) {
      sendAlert({ message: 'Preencha todos os campos.', type: 'warning' });
      return;
    }

    const novo = {
      tipo,
      unidade: parseInt(unidade),
      preco: parseFloat(preco),
    };

    setCalcados([...calcados, novo]);
    setNovoCalcado({ tipo: '', unidade: '', preco: '' });
  };

  const removerCalcado = (tipo) => {
    const novaLista = calcados.filter((item) => item.tipo !== tipo);
    setCalcados(novaLista);
    sendAlert({ message: `${tipo} removido.`, type: 'info' });
  };

  const totalGeral = calcados.reduce(
    (soma, item) => soma + item.preco * item.unidade,
    0
  );

  const salvarNoCRM = async () => {
    if (!calcados.length) {
      sendAlert({ message: 'Nenhum calçado para salvar.', type: 'warning' });
      return;
    }

    const response = await runServerless({
      name: 'salvarPedido',
      parameters: { calcados, total: totalGeral },
    });

    if (response.status === 'success') {
      const novoExtrato = {
        data: new Date().toLocaleString(),
        itens: calcados,
        total: totalGeral,
      };

      setExtrato([novoExtrato, ...extrato]);
      setCalcados([]);
      sendAlert({ message: response.message, type: 'success' });
    } else {
      sendAlert({ message: response.message || 'Erro ao salvar pedido.', type: 'error' });
    }
  };

  return (
    <Flex direction="column" gap="large">
      {/* Título */}
      <Text format={{ fontWeight: 'bold', fontSize: '20px' }}>
        🛍️ Gerenciador de Calçados
      </Text>

      {/* Inputs */}
      <Flex
        direction="row"
        wrap
        gap="medium"
        align="end"
        style={{
          border: '1px solid #e3e8ee',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#f9fafc',
        }}
      >
        <Input
          name="tipo"
          label="Tipo"
          placeholder="Ex: Tênis"
          style={{ minWidth: '200px' }}
          value={novoCalcado.tipo}
          onInput={(val) => setNovoCalcado({ ...novoCalcado, tipo: val })}
        />
        <Input
          name="unidade"
          label="Unidades"
          type="number"
          placeholder="0"
          style={{ minWidth: '120px' }}
          value={novoCalcado.unidade}
          onInput={(val) => setNovoCalcado({ ...novoCalcado, unidade: val })}
        />
        <Input
          name="preco"
          label="Preço unitário (R$)"
          type="number"
          placeholder="0.00"
          style={{ minWidth: '140px' }}
          value={novoCalcado.preco}
          onInput={(val) => setNovoCalcado({ ...novoCalcado, preco: val })}
        />
        <Button
          onClick={adicionarCalcado}
          variant="primary"
          size="medium"
          type="submit"
          style={{ marginTop: '12px', minWidth: '140px' }}
        >
          ➕ Adicionar
        </Button>
      </Flex>

      {/* Tabela */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Tipo</TableHeader>
            <TableHeader>Unidades</TableHeader>
            <TableHeader>Preço (R$)</TableHeader>
            <TableHeader>Total (R$)</TableHeader>
            <TableHeader>Remover</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {calcados.map(({ tipo, unidade, preco }) => (
            <TableRow key={`${tipo}-${preco}`}>
              <TableCell>{tipo}</TableCell>
              <TableCell>{unidade}</TableCell>
              <TableCell>R$ {preco.toFixed(2)}</TableCell>
              <TableCell>R$ {(preco * unidade).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => removerCalcado(tipo)}
                  variant="danger"
                  size="small"
                >
                  ❌ Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Total + salvar */}
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #e3e8ee',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <Text format={{ fontWeight: 'bold' }}>
          💰 Total Geral: R$ {totalGeral.toFixed(2)}
        </Text>

        <Button
          onClick={salvarNoCRM}
          variant="success"
          size="medium"
          type="submit"
        >
          Salvar Pedido
        </Button>
      </Flex>

      {/* Extrato de pedidos */}
      {extrato.length > 0 && (
        <Flex direction="column" gap="medium" style={{ marginTop: '32px' }}>
          <Text format={{ fontWeight: 'bold', fontSize: '16px' }}>
            📄 Extrato de Pedidos Salvos
          </Text>

          {extrato.map((pedido, idx) => (
            <Flex
              key={idx}
              direction="column"
              style={{
                border: '1px solid #d1d6dc',
                borderRadius: '8px',
                padding: '12px',
                background: '#f8f9fa',
              }}
            >
              <Text format={{ fontWeight: 'bold' }}>🕒 {pedido.data}</Text>
              {pedido.itens.map((item, i) => (
                <Text key={i}>
                  {i + 1}. {item.tipo} — {item.unidade} un × R${item.preco.toFixed(2)} ={' '}
                  <strong>R${(item.preco * item.unidade).toFixed(2)}</strong>
                </Text>
              ))}
              <Text format={{ fontWeight: 'bold' }} style={{ marginTop: '8px' }}>
                Total: R$ {pedido.total.toFixed(2)}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
