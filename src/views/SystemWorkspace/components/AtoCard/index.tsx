import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import { ATO_LEARN_MORE, CFACTS } from 'constants/externalUrls';
import { GetSystemProfile_cedarAuthorityToOperate as CedarAuthorityToOperate } from 'queries/types/GetSystemProfile';
import { GetSystemWorkspace_cedarSystemDetails_roles as CedarRole } from 'queries/types/GetSystemWorkspace';
import {
  getPersonFullName,
  showAtoExpirationDate
} from 'views/SystemProfile/helpers';

type Props = {
  status: string;
  dateAuthorizationMemoExpires?: CedarAuthorityToOperate['dateAuthorizationMemoExpires'];
  isso?: CedarRole;
  className?: string;
};

function AtoCard({
  status,
  dateAuthorizationMemoExpires,
  isso,
  className
}: Props) {
  const { t } = useTranslation('systemWorkspace');

  return (
    <Grid
      tablet={{ col: 12 }}
      desktop={{ col: 6 }}
      className="display-flex flex-align-stretch"
    >
      <Card
        className={classnames(
          className,
          'radius-sm width-full workspaces__card'
        )}
      >
        <CardHeader className="text-bold padding-0 line-height-serif-2 margin-bottom-1 text-body-lg">
          {t('spaces.ato.header')}
        </CardHeader>

        <CardBody className="padding-0 flex-1 workspaces__fill-card-space">
          <p className="text-base margin-o">{t('spaces.ato.description')}</p>
          <div>
            {status}{' '}
            <span>{showAtoExpirationDate(dateAuthorizationMemoExpires)}</span>
          </div>
          <p>
            <strong>{t('spaces.ato.isso')}</strong>
            {isso ? (
              <>
                <br />
                {getPersonFullName(isso)}
              </>
            ) : (
              t('spaces.ato.noIsso')
            )}
          </p>
        </CardBody>

        <Divider className="margin-y-2" />

        <CardFooter className="padding-0 margin-bottom-05">
          <UswdsReactLink
            variant="unstyled"
            className={classnames('usa-button', {
              'usa-button--disabled': !isso?.assigneeEmail
            })}
            to=""
          >
            {t('spaces.ato.contact')}
          </UswdsReactLink>
          <UswdsReactLink
            variant="unstyled"
            className="usa-button usa-button--outline"
            to={CFACTS}
          >
            {t('spaces.ato.cfacts')}
          </UswdsReactLink>
          <UswdsReactLink variant="unstyled" to={ATO_LEARN_MORE}>
            {t('spaces.ato.learn')}
          </UswdsReactLink>
        </CardFooter>
      </Card>
    </Grid>
  );
}

export default AtoCard;
