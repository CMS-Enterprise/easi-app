import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CellProps, Column, useTable } from 'react-table';
import { Button, ButtonGroup, Icon, Table } from '@trussworks/react-uswds';
import { FieldArray, Form, Formik, FormikProps } from 'formik';

import AutoSave from 'components/AutoSave';
import HelpText from 'components/HelpText';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import {
  defaultProposedSolution,
  solutionHasFilledFields
} from 'data/businessCase';
import {
  AlternativeAnalysisForm,
  BusinessCaseModel,
  ProposedBusinessCaseSolution
} from 'types/businessCase';
import { fetchBusinessCase, putBusinessCase } from 'types/routines';
import flattenErrors from 'utils/flattenErrors';
import {
  getAlternativeAnalysisSchema,
  SolutionSchema
} from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

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

  // Add state for table data

  const [tableData, setTableData] = useState([
    businessCase.preferredSolution,
    businessCase.alternativeA,
    businessCase.alternativeB
  ]);

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
              <span>{t(`alternativesTable.solutions.${index}.heading`)}</span>
              <br />
              <HelpText>
                {t(`alternativesTable.solutions.${index}.required`) // Boolean / True
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
              <>{row.original.title || t(`alternativesTable.notSpecified`)}</>
            );
          }

          // TODO: NJD - super hacky string replace thing, find better way of doing this
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
                {t(`alternativesTable.solutions.${index}.add`)}
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
          const solutionType = t(
            `alternativesTable.solutions.${row.index}.heading`
          );

          if (!isInProgress) {
            return <></>;
          }

          try {
            // Validate the specific solution using business case schema
            SolutionSchema(isFinal, solutionType).validateSync(row.original, {
              abortEarly: false
            });
            return <span className="text-success">Completed</span>;
          } catch (err) {
            return <span className="text-info">In Progress</span>;
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

          // TODO: NJD - super hacky string replace thing, find better way of doing this
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
                  className="margin-left-1"
                  type="button"
                  unstyled
                  // TODO: NJD - need to make this more generic if we start to support more than two alternatives (C, D, etc.)
                  onClick={async () => {
                    if (
                      // eslint-disable-next-line no-alert
                      window.confirm(t('confirmRemoveAlternativeB'))
                    ) {
                      await dispatch(
                        putBusinessCase({
                          ...businessCase,
                          alternativeB: defaultProposedSolution
                        })
                      );

                      // Update table data state
                      setTableData([
                        businessCase.preferredSolution,
                        businessCase.alternativeA,
                        defaultProposedSolution
                      ]);

                      // Force a re-fetch of the business case data

                      await dispatch(
                        fetchBusinessCase(businessCase.systemIntakeId)
                      );

                      // TODO: NJD - this doesn't force a full state refresh. Can call window.location.reload() to fix but feels like bad UX
                      history.replace(history.location);
                    }
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
    [businessCase, dispatch, dispatchSave, history, isFinal, t]
  );

  const table = useTable({
    columns,
    data: tableData,
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
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<AlternativeAnalysisForm>) => {
        const { errors, setErrors, values, validateForm } = formikProps;
        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('alternatives')}
            description={
              <>
                <p>{t('alternativesDescription.text.0')}</p>
                <p className="margin-bottom-0">
                  {t('alternativesDescription.text.1')}
                </p>
                <ul className="padding-left-205 margin-top-0">
                  <li>{t('alternativesDescription.list.0')}</li>
                  <li>{t('alternativesDescription.list.1')}</li>
                  <li>{t('alternativesDescription.list.2')}</li>
                  <li>{t('alternativesDescription.list.3')}</li>
                  <li>{t('alternativesDescription.list.4')}</li>
                </ul>
                <p>{t('alternativesDescription.text.2')}</p>
              </>
            }
            errors={flatErrors}
            data-testid="alternative-analysis"
            fieldsMandatory={isFinal}
          >
            <Form className="tablet:grid-col-9 margin-bottom-6">
              <FieldArray name="AlternativeAnalysis">
                {() => (
                  <div>
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
                                    className="text-ttop"
                                    style={{ width: '60%' }} // TODO: NJD - better way to do this?
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
                )}
              </FieldArray>
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
              {t('Save & Exit')}
            </IconButton>

            <PageNumber currentPage={3} totalPages={5} />

            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 3}
            />
          </BusinessCaseStepWrapper>
        );
      }}
    </Formik>
  );
};

export default AlternativeAnalysis;
