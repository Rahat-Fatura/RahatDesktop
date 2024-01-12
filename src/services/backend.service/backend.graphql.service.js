const httpStatus = require('http-status');
const { graphqlClient } = require('../../utils/backendInstance');
const ApiError = require('../../utils/ApiError');
const logger = require('../../config/logger');

const getAllCompanies = async (token) => {
  try {
    const query = `
      query {
        getAllCompanies {
          accountant_id
          address
          city
          country
          created_at
          email
          id
          name
          phone
          status
          tax_number
          tax_office
        }
      }
    `;
    const response = await graphqlClient.request(
      query,
      {},
      {
        Authorization: token,
      },
    );
    return response.getAllCompanies;
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const createCompany = async (company, token) => {
  try {
    const mutation = `
      mutation ($company: CreateCompanyInput!) {
        createCompany(data: $company) {
          id
        }
      }
    `;
    const response = await graphqlClient.request(
      mutation,
      {
        company,
      },
      {
        Authorization: token,
      },
    );
    return response.createCompany;
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getCompanyById = async (id, token) => {
  try {
    const query = `
      query ($id: Int!) {
        getCompanyById(id: $id) {
          address
          city
          country
          created_at
          email
          id
          name
          phone
          status
          tax_number
          tax_office
        }
      }
    `;
    const response = await graphqlClient.request(
      query,
      {
        id: Number(id),
      },
      {
        Authorization: token,
      },
    );
    return response.getCompanyById;
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getInvoicesByCompanyId = async (id, token) => {
  try {
    const query = `
    query {
      getInvoicesByCompanyId(id: ${Number(id)}) {
        id
        uuid
        type_code
        tickets
        tax_total
        tax_subtotals
        tax_inclusive
        tax_exclusive
        system_type
        sender_object
        sender_name
        sender_tax
        receiver_object
        receiver_name
        receiver_tax
        profile_id
        payable_amount
        ownerships
        number
        lines
        line_extension
        issue_datetime
        integrator
        envelope_uuid
        envelope_datetime
        direction
        currency_code
        charge_total
        allowance_total
        additional_columns
        is_accounted
      }
    }
    `;
    const response = await graphqlClient.request(
      query,
      {},
      {
        Authorization: token,
      },
    );
    return response.getInvoicesByCompanyId;
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getApps = async () => {
  try {
    const query = `
      query GetApps {
        getApps {
            id
            app
        }
      }
      `;
    const response = await graphqlClient.request(query);
    return response.getApps;
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.response.errors[0].message);
  }
};

const getCompany = async (key) => {
  try {
    const query = `
      query getCompany {
        getCompany {
            id
            code
            key
            status
          }
        }`;
    const response = await graphqlClient.request(query, {}, { apikey: key });
    return response.getCompany;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.response.errors[0].message);
  }
};

module.exports = {
  getAllCompanies,
  createCompany,
  getCompanyById,
  getInvoicesByCompanyId,

  getApps,
  getCompany,
};
