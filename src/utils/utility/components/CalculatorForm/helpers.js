import { cloneDeep } from 'lodash';

// calculator helpers
const mapFund = (fund) => {
  return {
    FundId: fund.FundId,
    FundName: fund.FundName,
    FundSubCategoryId: fund.FundSubCategoryId,
    FundSubCategoryName: fund.FundSubCategoryName,
    Ticker: fund.Ticker,
    FeeRate: fund.FeeRate,
    MaximumAllocation: fund.MaximumAllocation,
    Message: fund.Message,
    AgeBrackets: fund.AgeBrackets,
  };
};

export const populate3DCalculatorSchema = (matrixAllocations, schema3D) => {
  const populated3DSchema = cloneDeep(schema3D); 
  populated3DSchema.FundCategories
    .forEach((category, categoryIndex) => category.Funds
      .forEach((fund, fundIndex) => fund.AgeBrackets
        .forEach((ageBracket, bracketIndex) => ageBracket.Percentage = matrixAllocations[categoryIndex][fundIndex][bracketIndex])));
  return populated3DSchema;
};

export const convert3DCalculatorSchemaTo2D = (matrixAllocations, schema3D) => {
  const schema2D = {
    TemplateId: schema3D.TemplateId,
    TemplateName: schema3D.TemplateName,
    TemplateType: schema3D.TemplateType,
    AssetFeeRate: schema3D.AssetFeeRate,
    Funds: []
  };
  if (schema3D.TemplateTypeDescription) { 
    schema2D.TemplateTypeDescription = schema3D.TemplateTypeDescription; 
  }

  schema2D.Funds = schema3D.FundCategories.reduce((flattenedArr, category, categoryIndex) => {
    const flattenedFunds = category.Funds.map((fund, fundIndex) => {
      const updatedAgeBrackets = fund.AgeBrackets.map((ageBracket, ageBracketIndex) => {
        const updatedAgeBracket = { ...ageBracket };
        updatedAgeBracket.Percentage = matrixAllocations[categoryIndex][fundIndex][ageBracketIndex];
        return updatedAgeBracket;
      });
      const updatedFund = { ...fund };
      updatedFund.FundCategoryName = category.FundCategoryName;
      updatedFund.FundCategoryId = category.FundCategoryId;
      updatedFund.FundCategoryColor = category.FundCategoryColor;
      updatedFund.AgeBrackets = updatedAgeBrackets;
      return updatedFund;
    });
    return flattenedArr.concat(flattenedFunds);
  }, []);
  return schema2D;
};

export const convert2DCalculatorSchemaTo3D = (schema2D) => {
  const schema3D = {
    TemplateId: schema2D.TemplateId,
    TemplateName: schema2D.TemplateName,
    TemplateType: schema2D.TemplateType,
    AssetFeeRate: schema2D.AssetFeeRate,
    FundCategories: []
  };
  if (schema2D.TemplateTypeDescription) { 
    schema3D.TemplateTypeDescription = schema2D.TemplateTypeDescription; 
  }
  let previousFundCategoryId = -1;
  let currFundCategory = {};
  schema2D.Funds.forEach(fund => {
    if (previousFundCategoryId !== fund.FundCategoryId) {

      // initialize another fund category
      const firstFund = mapFund(fund);
      currFundCategory = {
        FundCategoryId: fund.FundCategoryId,
        FundCategoryName: fund.FundCategoryName,
        FundCategoryColor: fund.FundCategoryColor,
        Funds: [firstFund],
      };
      schema3D.FundCategories.push(currFundCategory);
      previousFundCategoryId = fund.FundCategoryId;
    }
    else {
      currFundCategory.Funds.push(mapFund(fund));
    }
  });
  return schema3D;
};
