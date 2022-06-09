import { find } from 'lodash';
import { store } from 'src/index';

/* with multiple required claims this works like OR */
export function testClaims(requiredClaims) {
  const allClaims = store.getState().session.claimsObj;
  let result = false;
  requiredClaims.forEach(claim => {
    if (allClaims[claim]) {
      result = true;
    }
  });
  return result;
}

const claims = [
  {
    claimName: 'AllowView',
    description: '',
    label: 'View Account Information',
  },
  {
    claimName: 'AllowContribute',
    description: 'A financial advisor may set up one-time or recurring electronic contributions online or by submitting a One-time or Recurring Electronic Contributions Authorization/Change form (Form 200) on behalf of client accounts.',
    label: 'Contributions',
  },
  {
    claimName: 'AllowOptionChange',
    description: 'A financial advisor may change the investment option selected for each beneficiary on an account twice per calendar year. An investment option change can be made online or by submitting an investment option change form (form 405).',
    label: 'Investment Option Changes',
  },
  {
    claimName: 'AllowTransfer',
    description: 'A financial advisor may schedule an internal transfer for the same account owner/agent online or by submitting an Internal Transfer form (Form 400).',
    label: 'Transfers',
  },
  {
    claimName: 'AllowWithdraw',
    description: 'A financial advisor may initiate a withdrawal from my529 client accounts online or by submitting a Withdrawal Request form (form 300).  A withdrawal may be made payable only to the account owner, the beneficiary or an eligible educational institution.',
    label: 'Withdrawals',
  },
  {
    claimName: 'AllowViewStateTaxDocuments',
    description: 'For Utah residents/taxpayers only; unless otherwise stated by the my529 account owner a financial advisor may access a TC-675H form which contains aggregated information about contributions, withdrawals and transfers.',
    label: 'State Tax Docs',
  },
  {
    claimName: 'AllowViewFederalTaxDocuments',
    description: 'Unless otherwise specified by the my529 account owner, a financial advisor may access the 1099- Q tax form.',
    label: 'Federal Tax Docs',
  },
  {
    claimName: 'AdvisorEdit',
    description: 'Create additional users, assign/edit permissions and assign/edit access to client accounts. This feature is only available for Entity Limited Power of Attorney.',
    label: 'Create / Edit Users',
  },
  {
    claimName: 'TemplateEdit',
    description: 'Create customized age-based and static investment option templates that may be saved and applied to client accounts.',
    label: 'Create Customized Templates',
  },
  {
    claimName: 'DataImportSetup',
    description: 'Set up/edit link to a participating my529 data solution provider. This feature is only available for Entity Limited Power of Attorney.',
    label: 'Data Integration - Manage',
  },
  {
    claimName: 'DataImport',
    description: 'Manually download client data that can imported into Morningstar Office or Schwab Portfolio Center. Please note that any user downloading the data files will have access, via those data files, to any my529 accounts designated on the Accounts to Export page, even if that user is not designated on the power of attorney agreement. This feature is only available for Entity Limited Power of Attorney.',
    label: 'Data Integration - Download',
  },
  {
    claimName: 'AccountReports',
    description: 'Download reports containing detailed information on linked client accounts. This feature is only available for Entity Limited Power of Attorney.',
    label: 'Client Reports',
  },
  {
    claimName: 'AdminReports',
    description: 'Download reports containing detailed information on authorized users for your firm. This feature is only available for Entity Limited Power of Attorney.',
    label: 'Admin and Compliance Reports',
  },
  {
    claimName: 'ClientNotifications',
    description: 'A financial advisor may elect to receive email notifications when limited power of attorney access has been granted for a new account, or when the limited power of attorney access for an existing account has been modified or revoked.',
    label: 'Client Notifications'
  },
  {
    claimName: 'TransactionNotifications',
    description: 'A financial advisor may elect to receive email notifications for transactions on my529 accounts on which they have limited power of attorney access',
    label: 'Transaction Notifications'
  },
];

export function claimGet(claimName) {
  const claim = find(claims, { claimName });
  return claim ? claim : {};
}