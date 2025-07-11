import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import {
  SystemIntakeRequestType,
  useCreateSystemIntakeMutation,
  useUpdateSystemIntakeRequestTypeMutation
} from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import linkCedarSystemIdQueryString, {
  useLinkCedarSystemIdQueryParam
} from 'utils/linkCedarSystemIdQueryString';

const RequestTypeForm = () => {
  const { systemId } = useParams<{
    systemId?: string;
  }>();

  // Set isNew from checking loc state false explicitly
  // This is done in such a way as a stop gap to fix the problem where
  // changing Intake Request Types, from the overview page, will create new Intake Requests
  const { state } = useLocation<{ isNew?: boolean }>();
  const isNew = state?.isNew !== false;

  const { t } = useTranslation('intake');
  const { oktaAuth } = useOktaAuth();
  const history = useHistory();
  const [create] = useCreateSystemIntakeMutation();

  const [edit] = useUpdateSystemIntakeRequestTypeMutation();

  const linkCedarSystemId = useLinkCedarSystemIdQueryParam();

  const handleCreateIntake = (requestType: SystemIntakeRequestType) => {
    oktaAuth.getUser().then((user: any) => {
      const input = {
        requestType,
        requester: {
          name: user.name
        }
      };

      const nextPage = (id: string) => {
        const linkqs = linkCedarSystemIdQueryString(linkCedarSystemId);
        const navigationLink = `/system/link/${id}?${linkqs}`;

        switch (requestType) {
          case 'NEW':
            history.push(`/governance-overview/${id}?${linkqs}`, { isNew });
            break;
          case 'MAJOR_CHANGES':
            history.push(navigationLink, { isNew });
            break;
          case 'RECOMPETE':
            history.push(navigationLink, { isNew });
            break;
          default:
            // console.warn(`Unknown request type: ${requestType}`);
            break;
        }
      };

      if (!systemId) {
        create({ variables: { input } }).then(response => {
          if (!response.errors && response.data?.createSystemIntake) {
            const { id } = response.data?.createSystemIntake;
            nextPage(id);
          }
        });
      } else {
        // Edit is actually only available when backtracking from the "new system or service" option
        edit({
          variables: {
            id: systemId,
            requestType: requestType as SystemIntakeRequestType
          }
        }).then(response => {
          if (!response.errors) {
            const id = systemId;
            nextPage(id);
          }
        });
      }
    });
  };

  const requestTypes = [
    SystemIntakeRequestType.NEW,
    SystemIntakeRequestType.RECOMPETE,
    SystemIntakeRequestType.MAJOR_CHANGES
  ];

  return (
    <MainContent
      className="grid-container margin-bottom-15"
      data-testid="request-type-form"
    >
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{t('navigation.itGovernance')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('navigation.startRequest')}</Breadcrumb>
      </BreadcrumbBar>

      <PageHeading className="margin-bottom-1">
        {isNew
          ? t('requestTypeForm.heading')
          : t('navigation.changeRequestType')}
      </PageHeading>
      <p className="margin-top-0 margin-bottom-2 font-body-lg">
        {t('requestTypeForm.subheading')}
      </p>
      <IconButton
        icon={<Icon.ArrowBack className="margin-right-05" />}
        type="button"
        unstyled
        onClick={() => {
          history.goBack();
        }}
      >
        {isNew
          ? t('technicalAssistance:requestType.goBack')
          : t('technicalAssistance:requestType.goBackWithoutChange')}
      </IconButton>

      <CardGroup className="margin-top-4 margin-bottom-8">
        {requestTypes.map(type => {
          const card = t(`requestTypeForm.cards.${type}`, {
            returnObjects: true
          }) as {
            heading: string;
            description: string;
            collapseLink: string;
            collapseLinkList: string[];
          };

          return (
            <Card
              key={type}
              containerProps={{
                className: 'radius-0 border-gray-10 shadow-3'
              }}
              gridLayout={{
                tablet: {
                  col: 6
                }
              }}
            >
              <CardHeader>
                <h3>{card.heading}</h3>
              </CardHeader>
              <CardBody>
                <p>{card.description}</p>
                <CollapsableLink
                  id={`when-should-i-choose-this-option-${type.toLowerCase()}`}
                  label={card.collapseLink}
                >
                  <ul className="margin-bottom-0 margin-top-1 padding-left-205 line-height-body-5">
                    {card.collapseLinkList.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CollapsableLink>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  className="margin-right-1"
                  data-testid={`start-button--${type.toLowerCase()}`}
                  onClick={() => handleCreateIntake(type)}
                >
                  {t('requestTypeForm.start')}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </CardGroup>
    </MainContent>
  );
};

export default RequestTypeForm;
