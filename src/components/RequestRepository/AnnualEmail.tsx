import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Fieldset,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';

import Modal from 'components/Modal';

const AnnualEmail = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
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
          <h4>{t('home:adminHome.GRT.requesterUpdateEmail.card.heading')}</h4>
        </CardHeader>
        <CardBody>
          <p>{t('home:adminHome.GRT.requesterUpdateEmail.card.content')}</p>
        </CardBody>
        <CardFooter>
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="margin-right-1"
          >
            {t('home:adminHome.GRT.requesterUpdateEmail.card.button')}
          </Button>
        </CardFooter>
      </Card>

      {/* Request Update Email Modal */}
      <Modal isOpen={modalOpen} closeModal={() => setModalOpen(false)}>
        <ModalHeading>
          {t('home:adminHome.GRT.requesterUpdateEmail.modal.heading')}
        </ModalHeading>
        <p>{t('home:adminHome.GRT.requesterUpdateEmail.modal.content')}</p>
        <Fieldset>
          {(
            t('home:adminHome.GRT.requesterUpdateEmail.modal.list', {
              returnObjects: true
            }) as string[]
          ).map(item => {
            return <Checkbox id={item} name={item} value={item} label={item} />;
          })}
        </Fieldset>

        <ModalFooter>
          <div className="display-flex flex-gap-3">
            <Button
              type="button"
              // TODO: update to mailto link
              onClick={() => setModalOpen(false)}
            >
              {t(
                'home:adminHome.GRT.requesterUpdateEmail.modal.openEmailButton'
              )}
            </Button>
            <Button
              type="button"
              // TODO: copy emails to clipboard
              onClick={() => setModalOpen(false)}
              unstyled
            >
              {t(
                'home:adminHome.GRT.requesterUpdateEmail.modal.copyEmailButton'
              )}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AnnualEmail;
