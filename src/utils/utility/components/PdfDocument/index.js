import moment from 'moment';

import { currencyFormatter, numberFormatter } from '../../helpers/numbers';
import { ADDRESS, PHONE, FAX, EMAIL, HOSTNAME, HOURS } from './constants';

import { pdfStyles, colors } from './pdfStyles';
import LOGO_IMG_COLOR from './Logo.png';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * For readability I followed this conditionally inserting elements inside the array (https://2ality.com/2017/04/conditional-literal-entries.html)
    const cond = false;
    const arr = [
      ...(cond ? ['a'] : []),
      'b',
    ];
    
  * The unit in pdfmake is point, which seems to be 1/72 of an inch. The document is a letter 8.5 x 11 inches which is 612 × 792 points.
 */

export function docDefinition(statementData, title) {
  // new-new (TransactionDetailData is non-empty for new-old)
  const isNewNew = statementData.TransactionDetailData.length > 0;

  /* --------------------- BEGIN Page Layout ------------------- */
  const docDefinition = {
    info: {
      title: `${title} ${moment(statementData.BegDate).format('MM/DD/YYYY')} to ${moment(statementData.EndDate).format('MM/DD/YYYY')}`,
      author: 'my529',
    },
    defaultStyle: {
      fontSize: 9,
    },
    pageMargins: [25, 15, 30, 40], // left, top, right, bottom
    styles: pdfStyles,
    content: [
      {
        // Header
        columns: [
          { width: 130, image: LOGO_IMG_COLOR },
          { width: 100, text: ADDRESS, style: 'stackRow' },
          {
            width: '*',
            stack: [
              {
                text: [
                  { text: 'Phone ', bold: true },
                  PHONE,
                ],
                style: 'stackRow',
              },
              {
                text: [
                  { text: 'Fax ', bold: true },
                  FAX,
                ],
                style: 'stackRow',
              },
              {
                text: [
                  { text: 'Email ', bold: true },
                  EMAIL,
                ],
                style: 'stackRow',
              },
            ],
          },
          {
            width: '*',
            stack: [
              {
                text: [
                  { text: 'Website ', bold: true },
                  { text: HOSTNAME, link: `https://${HOSTNAME}` },
                ],
                style: 'stackRow',
              },
              {
                text: [
                  { text: 'Hours ', bold: true },
                  HOURS,
                ],
                style: 'stackRow',
              },
            ],
          }
        ],
        columnGap: 10
      },

      // horizontal line 
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - (2 * 40), y2: 5, lineWidth: 1, color: colors.primaryColor }],
      },

      // space between
      { text: '', style: 'spaceBetween' },

      // recipient name and address for mailing purposes
      {
        columns: [
          {
            // Recipient address
            width: '*',
            stack: [
              {
                text: statementData.RecipientName,
                style: 'stackRow',
              },
              ...(statementData.StreetAddress1
                ?
                [{
                  text: statementData.StreetAddress1,
                  style: 'stackRow',
                }]
                :
                []),
              ...(statementData.StreetAddress2
                ?
                [{
                  text: statementData.StreetAddress2,
                  style: 'stackRow',
                }]
                :
                []),
              ...(statementData.StreetAddress3
                ?
                [{
                  text: statementData.StreetAddress3,
                  style: 'stackRow',
                }]
                :
                []),
              {
                text: `${statementData.City}, ${statementData.State} ${statementData.PostalCode}`,
                style: 'stackRow',
              },
              ...(statementData.Country
                ?
                [{
                  text: statementData.Country,
                  style: 'stackRow',
                }]
                :
                []),
            ],
            margin: [75, 55, 0, 50], // left, top, right, bottom - position address so it shows correctly in an envelope window (matched the old pdf)
          },

          // Quarterly account statement for new-new
          {
            width: '*',
            stack: [
              { text: 'Quarterly account statement', style: 'title' }, // top is a white space to position the address in an envelope window
              { text: `${moment(statementData.BegDate).format('LL')} to ${moment(statementData.EndDate).format('LL')}`, style: 'datumSpan' },
              isNewNew
                ?
                pdfTable({
                  alignments: ['left', 'left'],
                  widths: ['auto', '*'],
                  keys: ['title', 'value'],
                  rows: [
                    { title: 'Account Number', value: statementData.AccountNumber },
                    { title: 'Investment Option', value: statementData.InvestmentOption },
                    { title: 'Account Owner/Agent', value: statementData.RecipientName },
                    { title: 'Beneficiary', value: statementData.BeneficiaryName },
                    { title: 'Limited Power of Attorney', value: statementData.POAName ? statementData.POAName : 'N/A' },
                  ],
                })
                :
                pdfTable({
                  alignments: ['left', 'left'],
                  widths: ['auto', '*'],
                  keys: ['title', 'value'],
                  rows: [
                    { title: { text: 'Ending Balance', bold: true }, value: { text: currencyFormatter(statementData.EndingBalance), bold: true, alignment: 'right' } },
                    { title: 'Account Number', value: statementData.AccountNumber },
                    { title: 'Investment Option', value: statementData.InvestmentOption },
                    { title: 'Account Owner/Agent', value: statementData.RecipientName },
                    { title: 'Beneficiary', value: statementData.BeneficiaryName },
                    { title: 'Limited Power of Attorney', value: statementData.POAName ? statementData.POAName : 'N/A' },
                    { title: 'Net Principal Contributions', value: { text: currencyFormatter(statementData.NetPrincipalContributions), alignment: 'right' } },
                    { title: 'Tax Year To Date Contributions', value: { text: currencyFormatter(statementData.TaxYearContributions), alignment: 'right' } },
                    { title: 'Previous Tax Year Contributions', value: { text: currencyFormatter(statementData.PriorYearContributions), alignment: 'right' } },
                  ],
                }),
            ],
          },
        ],
      },

      // space between
      { text: '', style: 'spaceBetween' },

      // Message1 in a text box
      statementData.Message1 && textBoxMessage(statementData.Message1.HtmlMessageText),

      // space between
      { text: '', style: 'spaceBetween' },
      { text: '', style: 'spaceBetween' },

      // Investment options table
      isNewNew
        ?
        pdfTable({
          title: `Investment option as of ${moment(statementData.EndDate).format('LL')}`,
          headers: ['Portfolio', 'Symbol', 'NAV', 'Units', 'Cost Basis', 'Amount'],
          keys: ['FundName', 'TickerSymbol', 'Price', 'Units', 'CostBasis', 'Amount'],
          widths: ['auto', '*', '*', '*', '*', '*'],
          alignments: ['left', 'left', 'right', 'right', 'right', 'right'],
          rows: statementData.IsCustom
            ?
            [
              {
                FundName: { text: statementData.InvestmentOption, bold: true },
                TickerSymbol: '',
                Price: '',
                Units: '',
                CostBasis: currencyFormatter(statementData.NetPrincipalContributions),
                Amount: { text: currencyFormatter(statementData.EndingBalance), bold: true },
              },
              ...statementData.FundData
                .map(fundData => ({
                  FundName: { text: fundData.FundName },
                  TickerSymbol: fundData.TickerSymbol,
                  Price: currencyFormatter(fundData.Price, 4),
                  Units: numberFormatter(fundData.Units, 5),
                  CostBasis: '',
                  Amount: { text: currencyFormatter(fundData.Amount) },
                }))
            ]
            :
            statementData.FundData
              .map(fundData => ({
                FundName: { text: fundData.FundName, bold: true },
                TickerSymbol: fundData.TickerSymbol,
                Price: currencyFormatter(fundData.Price, 4),
                Units: numberFormatter(fundData.Units, 5),
                CostBasis: currencyFormatter(statementData.NetPrincipalContributions),
                Amount: { text: currencyFormatter(statementData.EndingBalance), bold: true },
              })),
        })
        :
        pdfTable({
          underText: 'This is what my529 owns on your behalf. You do not own the listed funds. You own my529 units.',
          title: `Underlying Fund Balances as of ${moment(statementData.EndDate).format('LL')}`,
          headers: ['Fund', 'Symbol', 'Price', 'my529Units', 'Amount'],
          keys: ['FundName', 'TickerSymbol', 'Price', 'Units', 'Amount'],
          widths: ['auto', '*', '*', '*', '*'],
          alignments: ['left', 'left', 'right', 'right', 'right'],
          rows: statementData.FundData
            .map(fundData => ({
              FundName: fundData.FundName,
              TickerSymbol: fundData.TickerSymbol,
              Price: currencyFormatter(fundData.Price, 4),
              Units: numberFormatter(fundData.Units, 5),
              Amount: currencyFormatter(fundData.Amount) // pulled from the header data
            })),
        }),

      // space between
      { text: '', style: 'spaceBetween' },
      { text: '', style: 'spaceBetween' },

      // Activity summary table
      pdfTable({
        title: 'Activity summary',
        headers: ['', 'This quarter', 'Year to date'],
        alignments: ['left', 'right', 'right'],
        widths: ['*', '*', '*'],
        keys: ['AmountName', 'QuarterAmount', 'YearToDateAmount'],
        showTotalLine: true,
        rows: [
          {
            AmountName: { text: 'Beginning Balance', bold: true },
            QuarterAmount: { text: currencyFormatter(statementData.BeginningBalance), bold: true },
            YearToDateAmount: { text: currencyFormatter(statementData.YTDBeginningBalance), bold: true },
          },
          {
            AmountName: 'Contributions',
            QuarterAmount: currencyFormatter(statementData.Contributions),
            YearToDateAmount: currencyFormatter(statementData.YTDContributions),
          },
          ...(!isNewNew ? [{
            AmountName: 'my529 Dividends',
            QuarterAmount: currencyFormatter(statementData.Dividends),
            YearToDateAmount: currencyFormatter(statementData.YTDDividends),
          }] : []),
          {
            AmountName: 'Widthdrawals',
            QuarterAmount: currencyFormatter(statementData.Withdrawals),
            YearToDateAmount: currencyFormatter(statementData.YTDWithdrawals),
          },
          ...(!isNewNew
            ?
            [{
              AmountName: 'Transfers/Exchanges *',
              QuarterAmount: currencyFormatter(statementData.Transfers),
              YearToDateAmount: currencyFormatter(statementData.YTDTransfers),
            }]
            :
            [{
              AmountName: 'Other Transactions *',
              QuarterAmount: currencyFormatter(statementData.Transfers),
              YearToDateAmount: currencyFormatter(statementData.YTDTransfers),
            }]),
          {
            AmountName: 'Gain/(Loss)',
            QuarterAmount: currencyFormatter(statementData.GainLoss),
            YearToDateAmount: currencyFormatter(statementData.YTDGainLoss),
          },
          ...(!isNewNew ? [{
            AmountName: 'Asset/Transaction Fees',
            QuarterAmount: currencyFormatter(statementData.AssetFee),
            YearToDateAmount: currencyFormatter(statementData.YTDAssetFee),
          }] : []),
          ...(!isNewNew ? [{
            AmountName: 'Mail Delivery Fee',
            QuarterAmount: currencyFormatter(statementData.MailFee),
            YearToDateAmount: currencyFormatter(statementData.YTDMailFee),
          }] : []),
          {
            AmountName: { text: 'Ending Balance', bold: true },
            QuarterAmount: { text: currencyFormatter(statementData.EndingBalance), bold: true },
            YearToDateAmount: { text: currencyFormatter(statementData.EndingBalance), bold: true },
          }
        ],
        footnote: !isNewNew
          ?
          '* Includes transfers between my529 accounts, reallocations, rebalances, investment option changes and fund changes.'
          :
          '* Includes all other transactions (e.g., transfers, rebalances, investment option changes, transaction fees).',
      }),

      // space between
      { text: '', style: 'spaceBetween' },
      { text: '', style: 'spaceBetween' },

      // Transactions detail
      !isNewNew
        ?
        pdfTable({
          title: 'Transaction detail',
          headers: ['Date', 'Description', 'Amount'],
          keys: ['Date', 'Description', 'Amount'],
          widths: ['*', 'auto', '*'],
          alignments: ['left', 'left', 'right'],
          showTotalLine: true,
          rows: [
            ...statementData.TransactionData
              .map((transaction, index, array) => {
                const description = transaction.FundName ? `${transaction.Type} - ${transaction.FundName}` : transaction.Type;
                // the first row is the beginning balance last row is the ending balance
                let item;
                if ((index === 0) || index === array.length - 1) {
                  item = {
                    Date: { text: moment(transaction.Date).format('MM/DD/YYYY'), bold: true },
                    Description: { text: description, bold: true },
                    Amount: { text: currencyFormatter(transaction.Amount), bold: true },
                  };
                }
                else {
                  item = {
                    Date: moment(transaction.Date).format('MM/DD/YYYY'),
                    Description: description,
                    Amount: currencyFormatter(transaction.Amount),
                  };
                }
                return item;
              }),
          ],
        })
        :
        pdfTable({
          title: 'Transaction detail',
          headers: ['Date', 'Description', 'Symbol', 'NAV', 'Units', 'Amount'],
          alignments: ['left', 'left', 'left', 'right', 'right', 'right'],
          widths: ['auto', 'auto', '*', '*', '*', '*'],
          keys: ['Date', 'Description', 'Symbol', 'NAV', 'Units', 'Amount'],
          showTotalLine: true,
          rows: [
            ...statementData.TransactionDetailData
              // OrderIdentity should be used to determine the order of entities
              .sort((transactionA, transactionB) => transactionA.OrderIdentity - transactionB.OrderIdentity)
              .map((transaction, index, array) => {
                let item;
                // the first row is the beginning balance last row is the ending balance
                if ((index === 0) || index === array.length - 1) {
                  item = {
                    Date: { text: moment(transaction.Date).format('MM/DD/YYYY'), bold: true },
                    Description: { text: transaction.Description, bold: true },
                    Symbol: { text: transaction.Symbol, bold: true },
                    NAV: { text: currencyFormatter(transaction.NAV, 4), bold: true },
                    Units: { text: numberFormatter(transaction.Units, 5), bold: true },
                    Amount: { text: currencyFormatter(transaction.Amount), bold: true },
                  };
                }
                else {
                  item = {
                    Date: moment(transaction.Date).format('MM/DD/YYYY'),
                    Description: transaction.Description,
                    Symbol: transaction.Symbol,
                    NAV: currencyFormatter(transaction.NAV, 4),
                    Units: numberFormatter(transaction.Units, 5),
                    Amount: currencyFormatter(transaction.Amount),
                  };
                  item = {
                    Date: moment(transaction.Date).format('MM/DD/YYYY'),
                    Description: transaction.Description,
                    Symbol: transaction.Symbol,
                    NAV: currencyFormatter(transaction.NAV, 4),
                    Units: numberFormatter(transaction.Units, 5),
                    Amount: currencyFormatter(transaction.Amount),
                  };
                }
                return item;
              }),
          ]
        }),

      // space between
      { text: '', style: 'spaceBetween' },
      { text: '', style: 'spaceBetween' },

      // Message3 in a text box
      statementData.Message3 && textBoxMessage(statementData.Message3.HtmlMessageText),
    ]
  };
  /* --------------------- END Page Layout ------------------- */

  return docDefinition;
}

/* ---------------------  PDF HELPER METHODS ------------------- */
function textBoxMessage(msgText) {
  return (
    {
      table: {
        widths: ['*'],
        body: [[msgText]],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 10,
        paddingBottom: () => 10
      },
      style: 'messageBox',
    }
  );
}

function pdfTable({ underText = null, title = null, headers = [], alignments, widths, keys, rows, showTotalLine = false, footnote = null }) {
  const body = [];
  let numOfHeaders = 0;
  let numOfRows = 0;
  // add under text if available
  if (underText) {
    numOfHeaders++;
    body.push(
      keys.map((key, index) => {
        // pdfmake needs remaining empty cells when doing calSpan
        return index === 0 ? { text: underText, colSpan: keys.length, bold: true, alignment: 'left', border: [false, false, false, false], style: 'underText' } : {};
      })
    );
  }
  // add a title if available
  if (title) {
    numOfHeaders++;
    body.push(
      keys.map((key, index) => {
        // pdfmake needs remaining empty cells when doing calSpan
        return index === 0 ? { text: title, colSpan: keys.length, bold: true, alignment: 'left', border: [false, false, false, false], style: 'title' } : {};
      })
    );
  }
  // add headers if not empty
  if (headers.length > 0) {
    numOfHeaders++;
    // headers bold
    body.push(headers.map((header, index) => ({ text: header, bold: true, alignment: alignments[index], border: [false, false, false, true] })));
  }
  // show not available of no data for rows
  if (rows.length > 0) {
    numOfRows = rows.length;
    rows.forEach((row, rowIndex, array) => {
      const border = (showTotalLine && array.length - 2 === rowIndex) ? [false, false, false, true] : [false, false, false, false];
      const rowOfStringCells = keys.map((key, colIndex) => ({ text: row[key], alignment: alignments[colIndex], border }));
      body.push(rowOfStringCells);
    });
  }
  else {
    body.push(
      keys.map((key, index) => {
        // pdfmake needs remaining empty cells when doing calSpan
        return index === 0 ? { text: 'No data available', colSpan: keys.length, alignment: 'center', border: [false, false, false, false], style: 'noDataAvailable' } : {};
      })
    );
  }
  // add a footnote if available
  if (footnote) {
    numOfRows++;
    body.push(
      keys.map((key, index) => {
        // pdfmake needs remaining empty cells when doing calSpan
        return index === 0 ? { text: footnote, colSpan: keys.length, bold: true, alignment: 'left', border: [false, false, false, false], style: 'footnote' } : {};
      })
    );
  }
  // if too many rows kept with the header it would not fit page and not show at all, if too little it would show too big part of page empty
  const keepWithHeaderRows = numOfRows < 30 ? numOfRows : 30;
  return ({
    table: {
      ...(numOfHeaders ? { headerRows: numOfHeaders } : {}), // if 0 header rows don't include this prop
      dontBreakRows: true,
      ...(numOfHeaders ? { keepWithHeaderRows } : {}), // if 0 header rows don't include this prop
      widths,
      body,
    },
  });
}

/* ---------------------  CREATE PDF METHODS ------------------- */
export function createPdfToNewWindow(statementData, window, title) {
  pdfMake.createPdf(docDefinition(statementData, title)).open({}, window);
}

// this is for development only insert method call to componentDidMount to have live updates on pdfmake changes
// and in render <iframe id='pdfV' style={{ width: '100%', height: '1000px' }} /> 
export function createPdfToIFrame(statementData, iFrameId) {
  pdfMake.createPdf(docDefinition(statementData))
    .getDataUrl((outDoc) => {
      document.getElementById(iFrameId).src = outDoc;
    });
}