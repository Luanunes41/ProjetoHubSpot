const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
  const { calcados, total } = context.parameters;
  const recordId = context?.records?.[0]?.objectId;

  if (!calcados || !Array.isArray(calcados) || !recordId) {
    return {
      status: 'error',
      message: 'Pedido inválido ou ID do registro não encontrado.',
    };
  }

  const noteBody = calcados
    .map(
      (item, idx) =>
        `${idx + 1}. 👟 ${item.tipo} — ${item.unidade} un × R$ ${item.preco.toFixed(2)}`
    )
    .join('\n');

  const hsClient = new hubspot.Client({
    accessToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN,
  });

  try {
    const note = await hsClient.crm.notes.basicApi.create({
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: `🛍️ Pedido registrado no CRM:\n\n${noteBody}\n\n💰 Total: R$ ${total.toFixed(
          2
        )}`,
      },
    });

    await hsClient.crm.notes.associationsApi.create(
      note.id,
      'contact',
      recordId,
      'note_to_contact'
    );

    return {
      status: 'success',
      message: 'Pedido salvo no CRM com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao criar nota:', error.message);
    return {
      status: 'error',
      message: 'Erro ao criar a nota no CRM.',
    };
  }
};
