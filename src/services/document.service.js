const backendService = require('./backend.service');
const rahatsistem = require('./rahatsistem.service');
const documentsConfig = require('../config/documents.config');
const config = require('../config/config');
const { createInvoiceJson } = require('../helpers/json.helper');
const logger = require('../config/logger');
const notificationService = require('./notification.service');

const documentCreator = (externalId, externalCode, json, status, moveType, documentType, error) => {
  const document = {
    external_id: externalId,
    external_code: externalCode,
    json: json || null,
    status: documentsConfig[documentType][status].code,
    status_desc: documentsConfig[documentType][status].desc || JSON.stringify(error, Object.getOwnPropertyNames(error)),
    movement_type: documentsConfig.movementTypes[moveType],
    document_type: documentsConfig.documentTypes[documentType] || 'INVOICE',
  };
  notificationService.notify(document);
  return document;
};

const createDocumentRecord = async (externalId, externalCode, json, status, moveType, documentType) => {
  const documentBody = documentCreator(externalId, externalCode, json, status, moveType, documentType);
  const document = await backendService.graphql.createDocument(config.get('apikey'), documentBody);
  return document;
};

const updateDocumentRecord = async (id, externalId, externalCode, json, status, moveType, documentType, error) => {
  const documentBody = documentCreator(externalId, externalCode, json, status, moveType, documentType, error);
  const document = await backendService.graphql.updateDocument(config.get('apikey'), id, documentBody);
  return document;
};

const upsertDocument = async (id, movementType, documentType) => {
  const doc = await createDocumentRecord(id, '0', null, 'upsert.notify', movementType, documentType);
  let docJson;
  try {
    if (documentType === 'invoice') {
      docJson = await createInvoiceJson(id);
    } else if (documentType === 'despatch') {
      // TODO: Create document JSON from local database
      throw new Error('Despatch not implemented yet.');
      // docJson = await createDespatchJson(id);
    }
  } catch (error) {
    logger.error(error);
    await updateDocumentRecord(doc.id, id, '0', null, 'upsert.error', movementType, documentType, error);
    return { success: false, error };
  }
  const exRefNo = docJson.document.External.RefNo;
  await updateDocumentRecord(doc.id, id, exRefNo, docJson, 'upsert.create', movementType, documentType);
  try {
    if (documentType === 'invoice') {
      await rahatsistem.upsertInvoice(docJson);
    } else if (documentType === 'despatch') {
      await rahatsistem.upsertDespatch(docJson);
    }
  } catch (error) {
    logger.error(error);
    await updateDocumentRecord(doc.id, id, exRefNo, docJson, 'upsert.error', movementType, documentType, error);
    return { success: false, error };
  }
  await updateDocumentRecord(doc.id, id, exRefNo, docJson, 'upsert.successful', movementType, documentType);
  return { success: true };
};

const deleteDocument = async (id, documentType) => {
  const doc = await createDocumentRecord(id, '0', null, 'delete.notify', 'delete', documentType);
  try {
    if (documentType === 'invoice') {
      await rahatsistem.deleteInvoice(id);
    } else if (documentType === 'despatch') {
      await rahatsistem.deleteDespatch(id);
    }
  } catch (error) {
    await updateDocumentRecord(doc.id, id, '0', null, 'delete.error', 'delete', documentType, error);
    return { success: false, error };
  }
  await updateDocumentRecord(doc.id, id, '0', null, 'delete.successful', 'delete', documentType);
  return { success: true };
};

const getDocumentsById = async (id) => {
  const documents = await backendService.graphql.getDocumentsById(config.get('apikey'), id);
  return documents;
};

module.exports = {
  createDocumentRecord,
  updateDocumentRecord,
  upsertDocument,
  deleteDocument,
  getDocumentsById,
};
