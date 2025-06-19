exports.main = async (context = {}) => {
  const { calcados, total } = context.parameters;

  const nota = `
Pedido de Calçados:
${calcados.map((c, i) => `${i + 1}. ${c.tipo} - ${c.unidade} un. x R$${c.preco.toFixed(2)} = R$${(c.preco * c.unidade).toFixed(2)}`).join('\n')}

Total do pedido: R$${total.toFixed(2)}
  `;

  return {
    message: 'Pedido salvo com sucesso!',
    nota,
  };
};
