import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useStore from '@store/store';

import { supportedModels } from '@constants/chat';

import { ModelOptions, TotalTokenUsed } from '@type/chat';

import CalculatorIcon from '@icon/CalculatorIcon';

type CostMapping = { model: string; cost: number }[];

const tokenCostToCost = (
  tokenCost: TotalTokenUsed[ModelOptions],
  model: ModelOptions
) => {
  try {
  if (!tokenCost) return 0;
  const { prompt, completion } = supportedModels[model].cost;
  const completionCost =
    (completion.price / completion.unit) * tokenCost.completionTokens;
  const promptCost = (prompt.price / prompt.unit) * tokenCost.promptTokens;
  return completionCost + promptCost;
  } catch (error) {
    console.error ("TokensTotalCost error: ", error);
    return 0;
  }

};

const TokensTotalCost = () => {
  const { t } = useTranslation(['main', 'model']);

  const totalTokenUsed = useStore((state) => state.totalTokenUsed);
  const setTotalTokenUsed = useStore((state) => state.setTotalTokenUsed);
  const countTotalTokens = useStore((state) => state.countTotalTokens);

  const [costMapping, setCostMapping] = useState<CostMapping>([]);

  const resetCost = () => {
    setTotalTokenUsed({});
  };

  useEffect(() => {
    const updatedCostMapping: CostMapping = [];
    Object.entries(totalTokenUsed).forEach(([model, tokenCost]) => {
      const cost = tokenCostToCost(tokenCost, model as ModelOptions);
      updatedCostMapping.push({ model, cost });
    });

    setCostMapping(updatedCostMapping);
  }, [totalTokenUsed]);

  return countTotalTokens ? (
    <div className='flex flex-col items-center gap-2'>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-4 py-2'>{t('model', { ns: 'model' })}</th>
              <th className='px-4 py-2'>USD</th>
            </tr>
          </thead>
          <tbody>
            {costMapping.sort((a, b) => b.cost - a.cost).map(({ model, cost }) => (
              <tr
                key={model}
                className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              >
                <td className='px-4 py-2'>{model ? supportedModels[model as ModelOptions].displayName : '...'}</td>
                <td className='px-4 py-2'>${cost.toFixed(2)}</td>
              </tr>
            ))}
            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 font-bold'>
              <td className='px-4 py-2'>{t('total', { ns: 'main' })}</td>
              <td className='px-4 py-2'>
               ${costMapping
                  .reduce((prev, curr) => prev + curr.cost, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='btn btn-neutral cursor-pointer' onClick={resetCost}>
        {t('resetCost', { ns: 'main' })}
      </div>
    </div>
  ) : (
    <></>
  );
};

export const TotalTokenCostDisplay = () => {
  const { t } = useTranslation();
  const totalTokenUsed = useStore((state) => state.totalTokenUsed);

  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    let updatedTotalCost = 0;

    Object.entries(totalTokenUsed).forEach(([model, tokenCost]) => {
      updatedTotalCost += tokenCostToCost(tokenCost, model as ModelOptions);
    });

    setTotalCost(updatedTotalCost);
  }, [totalTokenUsed]);

  return (
    <>
      <CalculatorIcon />
      {t('accumulatedCost') as string}: ${totalCost.toFixed(2)}
    </>
  );
};

export default TokensTotalCost;
