import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  IconLaunch,
  Link
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import AtoStatusTag from 'components/shared/AtoStatusTag';
import Divider from 'components/shared/Divider';
import { ATO_LEARN_MORE, CFACTS } from 'constants/externalUrls';
import { GetSystemProfile_cedarAuthorityToOperate as CedarAuthorityToOperate } from 'queries/types/GetSystemProfile';
import { GetSystemWorkspace_cedarSystemDetails_roles as CedarRole } from 'queries/types/GetSystemWorkspace';
import { AtoStatus } from 'types/systemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';
import { getPersonFullName } from 'views/SystemProfile/helpers';

type Props = {
  status: AtoStatus;
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
          <div className="display-flex">
            <AtoStatusTag
              status={status}
              className="display-flex flex-align-center margin-right-1"
            />
            {dateAuthorizationMemoExpires && (
              <span className="display-flex flex-align-center text-base">
                {status === 'Expired' ? 'Expired' : 'Expires'}{' '}
                {formatDateUtc(dateAuthorizationMemoExpires, 'MM/dd/yyyy')}
              </span>
            )}
          </div>
          <p>
            <strong>{t('spaces.ato.isso')}</strong>
            <br />
            {showVal(isso, {
              format: v => getPersonFullName(v),
              defaultVal: t('spaces.ato.noIsso')
            })}
          </p>
        </CardBody>

        <Divider className="margin-y-2" />

        <CardFooter className="padding-0 margin-bottom-05 display-flex">
          <Link
            className={classnames('usa-button', {
              'usa-button--disabled': !isso?.assigneeEmail
            })}
            href={`mailto:${isso?.assigneeEmail}`}
          >
            {t('spaces.ato.contact')}
          </Link>
          <Link className="usa-button usa-button--outline" href={CFACTS}>
            {t('spaces.ato.cfacts')}
          </Link>
          <Link
            variant="unstyled"
            href={ATO_LEARN_MORE}
            className="margin-left-1 display-flex flex-align-center text-primary"
          >
            {t('spaces.ato.learn')}
            <IconLaunch className="margin-left-1" />
          </Link>
        </CardFooter>
      </Card>
    </Grid>
  );
}

export default AtoCard;
