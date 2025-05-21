import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CellProps, Column, useTable } from 'react-table';
import {
  Button,
  ButtonGroup,
  Icon,
  ModalFooter,
  ModalHeading,
  Table
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { Form, Formik, FormikProps } from 'formik';
import { camelCase } from 'lodash';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import HelpText from 'components/HelpText';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import RequiredAsterisk from 'components/RequiredAsterisk';
import TaskStatusTag from 'components/TaskStatusTag';
import {
  defaultProposedSolution,
  solutionHasFilledFields
} from 'data/businessCase';
import {
  AlternativeAnalysisForm,
  BusinessCaseModel,
  ProposedBusinessCaseSolution,
  SolutionLabelType
} from 'types/businessCase';
import { putBusinessCase } from 'types/routines';
import {
  BusinessCaseSchema,
  getAlternativeAnalysisSchema
} from 'validations/businessCaseSchema';

type AltnerativeAnalysisProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
  isFinal: boolean;
};

const AlternativeAnalysis = ({
  businessCase,
  formikRef,
  dispatchSave,
  isFinal
}: AltnerativeAnalysisProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation('businessCase');

  const [isRemoveModalOpen, setRemoveModalOpen] = useState<boolean>(false);

  const columns = useMemo<Column<ProposedBusinessCaseSolution>[]>(
    () => [
      {
        // Type column - shows type of solution (Preferred or Alternative),
        // whether it is required or recommended, and description
        Header: t<string>('alternativesTable.type'),
        Cell: ({ row }: CellProps<ProposedBusinessCaseSolution, string>) => {
          const { index } = row;

          return (
            <>
              <span>
                <b>{t(`alternativesTable.solutions.${index}.heading`)}</b>

                {t(`alternativesTable.solutions.${index}.required`) && (
                  <RequiredAsterisk />
                )}
              </span>
              <br />
              <HelpText>
                {t(`alternativesTable.solutions.${index}.required`) // Boolean
                  ? 'Required'
                  : 'Recommended'}
              </HelpText>
              <br />
              <>{t(`alternativesTable.solutions.${index}.helpText`)}</>
            </>
          );
        }
      },
      {
        // Title column - shows either name of solution or button to start adding solution
        Header: t<string>('alternativesTable.title'),
        accessor: 'title',
        Cell: ({ row }: CellProps<ProposedBusinessCaseSolution, string>) => {
          const { index } = row;

          // Check to see if form has been started and display title
          if (solutionHasFilledFields(row.original)) {
            return (
              <>
                {row.original.title || (
                  <i>{t(`alternativesTable.notSpecified`)}</i>
                )}
              </>
            );
          }

          // TODO: super hacky string replace thing, find better way of doing this
          const newUrl = t(`alternativesTable.solutions.${index}.heading`)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/alternative-/g, 'alternative-solution-');

          // If not started, show button to add form
          return (
            <>
              <Button
                type="button"
                unstyled
                onClick={() => {
                  dispatchSave();
                  history.push(newUrl);
                }}
              >
                <b>{t(`alternativesTable.solutions.${index}.add`)}</b>
                <Icon.ArrowForward className="margin-left-1" />
              </Button>
            </>
          );
        }
      },
      {
        // Status column - shows Complete, In progress, or blank
        Header: t<string>('alternativesTable.status'),
        Cell: ({ row }: CellProps<ProposedBusinessCaseSolution, string>) => {
          const isInProgress = solutionHasFilledFields(row.original);

          const solutionType = camelCase(
            t(`alternativesTable.solutions.${row.index}.heading`)
          ) as SolutionLabelType;

          if (!isInProgress) {
            return <></>;
          }

          try {
            // Validate the specific solution using business case schema. We pass in true for isFinal
            // to show correct in progress or complete even when business case is in draft
            BusinessCaseSchema(isFinal)[solutionType].validateSync(
              row.original,
              { abortEarly: false }
            );

            return <TaskStatusTag status="COMPLETED" />;
          } catch (err) {
            return (
              <span>
                <TaskStatusTag status="IN_PROGRESS" />
              </span>
            );
          }
        }
      },
      {
        // Actions column - shows Edit, Edit and Remove (in case of optional solutions), or blank
        Header: t<string>('alternativesTable.actions'),
        Cell: ({ row }: CellProps<ProposedBusinessCaseSolution, string>) => {
          const { index } = row;

          // Display blank if form hasn't been started yet
          if (!solutionHasFilledFields(row.original)) {
            return <></>;
          }

          // TODO: super hacky string replace thing, find better way of doing this
          const newUrl = t(`alternativesTable.solutions.${index}.heading`)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/alternative-/g, 'alternative-solution-');

          return (
            <div className="display-flex">
              <Button
                type="button"
                unstyled
                onClick={() => {
                  dispatchSave();
                  history.push(newUrl);
                }}
              >
                {t('general:edit')}
              </Button>
              {index > 1 && (
                <Button
                  className="margin-left-1 text-error"
                  type="button"
                  unstyled
                  onClick={() => {
                    setRemoveModalOpen(true);
                  }}
                >
                  {t('general:remove')}
                </Button>
              )}
            </div>
          );
        }
      }
    ],
    [dispatchSave, history, t]
  );

  const table = useTable({
    columns,
    data: [
      businessCase.preferredSolution,
      businessCase.alternativeA,
      businessCase.alternativeB
    ],
    autoResetPage: true
  });

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    table;

  const initialValues: AlternativeAnalysisForm = {
    preferredSolution: businessCase.preferredSolution,
    alternativeA: businessCase.alternativeA,
    alternativeB: businessCase.alternativeB
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={getAlternativeAnalysisSchema(
        isFinal,
        solutionHasFilledFields(businessCase.alternativeB)
      )}
      validateOnBlur
      validateOnChange
      validateOnMount
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<AlternativeAnalysisForm>) => {
        const { setErrors, setFieldValue, values, validateForm } = formikProps;

        // TODO: this custom validation hook was done because formik isValid was failing to detect removal of
        //   alternative B w/o hard refresh. May be worth looking at to get rid of this function

        // Validation function to check if the form is valid, used to diable/enable the Next button
        const validateSolution = () => {
          try {
            getAlternativeAnalysisSchema(
              isFinal,
              solutionHasFilledFields(businessCase.alternativeB)
            ).validateSync(
              {
                preferredSolution: values.preferredSolution,
                alternativeA: values.alternativeA,
                alternativeB: values.alternativeB
              },
              { abortEarly: false }
            );

            return true;
          } catch (err) {
            return false;
          }
        };

        const isFormValid = validateSolution();

        return (
          <MainContent
            className="grid-container"
            data-testid="alternative-analysis"
          >
            <PageHeading className="margin-top-4 margin-bottom-2">
              {t('alternatives')}
            </PageHeading>
            <div className="font-body-lg text-light">
              <p className="margin-top-0">
                {t('alternativesDescription.text.0')}
              </p>
              <p className="margin-bottom-0">
                {t('alternativesDescription.text.1')}
              </p>
              <ul className="margin-top-1">
                <li>{t('alternativesDescription.list.0')}</li>
                <li>{t('alternativesDescription.list.1')}</li>
                <li>{t('alternativesDescription.list.2')}</li>
                <li>{t('alternativesDescription.list.3')}</li>
                <li>{t('alternativesDescription.list.4')}</li>
              </ul>
              <p>{t('alternativesDescription.text.2')}</p>
              {/* Required fields help text */}
              <HelpText className="margin-top-1 text-base">
                <Trans
                  i18nKey="businessCase:requiredFields"
                  components={{ red: <span className="text-red" /> }}
                />
              </HelpText>
            </div>

            <Form className="margin-bottom-6">
              <div>
                {/* Required fields help alert */}
                {!isFinal && (
                  <Alert
                    type="info"
                    className="margin-top-2"
                    data-testid="draft-business-case-fields-alert"
                    slim
                  >
                    {t('alternativesDescription.draftAlternativesAlert')}
                  </Alert>
                )}
                <Table
                  bordered={false}
                  fullWidth
                  style={{ tableLayout: 'auto' }}
                  {...getTableProps()}
                >
                  <thead>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <th
                            {...column.getHeaderProps()}
                            scope="col"
                            className="border-bottom-2px"
                          >
                            {column.render('Header')}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => {
                            return (
                              <td
                                className="text-middle"
                                style={{ width: '30%' }} // TODO: better way to do this?
                                {...cell.getCellProps()}
                              >
                                {cell.render('Cell')}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Form>

            <ButtonGroup>
              <Button
                type="button"
                outline
                onClick={() => {
                  dispatchSave();
                  setErrors({});
                  const newUrl = 'request-description';
                  history.push(newUrl);
                }}
              >
                {t('Back')}
              </Button>
              <Button
                type="button"
                disabled={!isFormValid}
                className={classnames('usa-button')}
                onClick={() => {
                  validateForm().then(err => {
                    if (Object.keys(err).length === 0) {
                      dispatchSave();
                      const newUrl = 'review';
                      history.push(newUrl);
                    } else {
                      window.scrollTo(0, 0);
                    }
                  });
                }}
              >
                {t('Next')}
              </Button>

              {/* Display solution help text when form is invalid (button is greyed out) */}
              {!isFormValid && (
                <HelpText className="margin-left-1">
                  {t('alternativesTable.completeSolutionsHelpText')}
                </HelpText>
              )}
            </ButtonGroup>

            <IconButton
              icon={<Icon.ArrowBack />}
              type="button"
              unstyled
              onClick={() => {
                dispatchSave();
                history.push(
                  `/governance-task-list/${businessCase.systemIntakeId}`
                );
              }}
              className="margin-bottom-3 margin-top-205"
            >
              {t('saveAndExit')}
            </IconButton>

            <PageNumber currentPage={3} totalPages={4} />

            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 3}
            />

            {/* Remove alternative modal */}
            <Modal
              isOpen={isRemoveModalOpen}
              closeModal={() => {
                setRemoveModalOpen(false);
              }}
            >
              <ModalHeading>
                {t('alternativesTable.removeModal.title')}
              </ModalHeading>
              <p>{t('alternativesTable.removeModal.content')}</p>
              <ModalFooter>
                {' '}
                <ButtonGroup>
                  <Button
                    type="button"
                    secondary
                    className="margin-right-2"
                    onClick={() => {
                      // Reset alternative B in form
                      setFieldValue('alternativeB', defaultProposedSolution);

                      // Set alternative B back to default state
                      const updatedBusinessCase = {
                        ...businessCase,
                        alternativeB: defaultProposedSolution
                      };

                      dispatch(putBusinessCase(updatedBusinessCase));

                      setRemoveModalOpen(false);
                      history.replace(history.location);
                    }}
                  >
                    {t('alternativesTable.removeModal.confirm')}
                  </Button>
                  <Button
                    type="button"
                    unstyled
                    onClick={() => {
                      setRemoveModalOpen(false);
                    }}
                  >
                    {t('alternativesTable.removeModal.cancel')}
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </Modal>
          </MainContent>
        );
      }}
    </Formik>
  );
};

export default AlternativeAnalysis;
