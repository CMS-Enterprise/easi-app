import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  IconArrowForward,
  IconBookmark
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import GetCedarSystemQuery from 'queries/GetCedarSystemQuery';
import {
  GetCedarSystem,
  GetCedarSystemVariables
} from 'queries/types/GetCedarSystem';

type SystemInformationCardProps = {
  cedarSystemId: string;
  bookmarked: boolean;
  toggleCedarSystemBookmark: () => void;
};

const SystemInformationCard = ({
  cedarSystemId,
  bookmarked,
  toggleCedarSystemBookmark
}: SystemInformationCardProps) => {
  const { t } = useTranslation('accessibility');

  const { data, loading, error } = useQuery<
    GetCedarSystem,
    GetCedarSystemVariables
  >(GetCedarSystemQuery, {
    variables: { id: cedarSystemId }
  });

  const toggleBookmark = () => {
    toggleCedarSystemBookmark();
  };

  if (loading)
    return (
      <Spinner
        size="large"
        aria-valuetext={t('newRequestForm.loadingSystems')}
        aria-busy
        data-testid="cedar-system-loading"
      />
    );

  if (error)
    return (
      <Alert type="error" slim>
        {t('newRequestForm.errorSystemInfo')}
      </Alert>
    );

  return (
    <CardGroup>
      <Card>
        <CardHeader className="display-flex">
          <div>
            <h4 className="margin-y-0 line-height-sans-5">
              <UswdsReactLink to={`/systems/${cedarSystemId}`}>
                {data?.cedarSystem?.name}
              </UswdsReactLink>
            </h4>
            <div className="font-sans-xs line-height-sans-1 margin-top-1">
              {data?.cedarSystem?.acronym}
            </div>
          </div>
          <div>
            <Button
              type="button"
              unstyled
              className={classNames('margin-left-105', {
                'text-base-lighter': !bookmarked,
                'text-primary': bookmarked
              })}
              onClick={() => toggleBookmark()}
            >
              <IconBookmark size={3} />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="system-info-card__description">
            {data?.cedarSystem?.description}
          </div>
        </CardBody>
        <CardFooter>
          <UswdsReactLink to={`/systems/${cedarSystemId}`}>
            {t('requestDetails.viewSystemProfile')}
            <IconArrowForward className="margin-left-05 margin-bottom-2px text-tbottom" />
          </UswdsReactLink>
        </CardFooter>
      </Card>
    </CardGroup>
  );
};

export default SystemInformationCard;
