import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { SystemProfileSubviewProps } from 'types/systemProfile';

const Contracts = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <>
      <CardGroup className="margin-0">
        {system.budgets?.map(
          (budget): React.ReactNode => (
            <Card
              key={budget.id}
              data-testid="system-card"
              className="grid-col-12"
            >
              <CardHeader className="padding-2 padding-bottom-0 text-top">
                <dt>
                  {t('singleSystem.contracts.budgetID')}
                  {budget.id}
                </dt>
                <h3 className="margin-top-0 margin-bottom-1">{budget.title}</h3>
                <Divider />
              </CardHeader>
              <CardFooter className="padding-2">
                <dt>{budget.comment}</dt>
              </CardFooter>
            </Card>
          )
        )}
      </CardGroup>
    </>
  );
};

export default Contracts;
