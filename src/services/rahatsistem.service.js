const { instance } = require('../instances/rahatsistem.instance');

const upsertInvoice = async (invoice) => {
  const { data } = await (await instance()).put('/connect/invoice', invoice);
  return data;
};

const deleteInvoice = async (id) => {
  const { data } = await (await instance()).delete(`/connect/invoice/${id}`);
  return data;
};

const upsertDespatch = async (despatch) => {
  const { data } = await (await instance()).put('/connect/despatch', despatch);
  return data;
};

const deleteDespatch = async (id) => {
  const { data } = await (await instance()).delete(`/connect/despatch/${id}`);
  return data;
};

const getRMQCode = async () => {
  const { data } = await (await instance()).get('/connect/ping');
  return data;
};

module.exports = {
  upsertInvoice,
  deleteInvoice,
  upsertDespatch,
  deleteDespatch,
  getRMQCode,
};
