import React, { useEffect } from 'react';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';

import Header from 'components/Header';
import SystemProfileHealthCard from 'components/SystemProfileHealthCard';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return (
    <div>
      <Header />
      <div className="grid-container">
        <div className="desktop:grid-col-10">
          <h1>Sandbox</h1>
          <h1>System Profile</h1>
          <hr />
          <p>Overview your system&apos;s health</p>
          <SystemProfileHealthCard
            heading="Authority to Operate (ATO)"
            body={
              <GridContainer>
                <Grid row>
                  <Grid desktop={{ col: 9 }}>
                    <p>
                      The implementation of a Federal Government information
                      system requires a formal Government Authorization to
                      Operate (ATO) for infrastructure systems and/or all
                      application systems developed, hosted and/or maintained on
                      behalf of CMS
                    </p>
                    <a href="/sandbox">Learn more about ATO</a>
                  </Grid>
                  <Grid desktop={{ col: 3 }} style={{ textAlign: 'center' }}>
                    <i
                      style={{ color: 'green' }}
                      className="fa fa-check-circle fa-5x"
                    />
                    <br />
                    Good to go
                  </Grid>
                </Grid>
              </GridContainer>
            }
            footer={<Button type="button">View ATO Information</Button>}
          />
          <SystemProfileHealthCard
            heading="Section 508"
            body={
              <GridContainer>
                <Grid row>
                  <Grid desktop={{ col: 9 }}>
                    <p>
                      Section 508 of the Rehabilitation Act (29 U.S.C. § 794d),
                      as amended by the Workforce Investment Act of 1998 (P.L.
                      105-220) requires federal agencies to develop, procure,
                      maintain and use information and communications technology
                      (ICT) that is accessible to people with disabilities -
                      regardless of whether or not they work for the federal
                      government.
                    </p>
                    <a href="/sandbox">Learn more about Section 508</a>
                  </Grid>
                  <Grid desktop={{ col: 3 }} style={{ textAlign: 'center' }}>
                    <i
                      style={{ color: '#ff9321' }}
                      className="fa fa-exclamation-circle fa-5x"
                    />
                    <br />
                    80% Coverage
                  </Grid>
                </Grid>
              </GridContainer>
            }
            footer={
              <Button type="button">View 508 Compliance Information</Button>
            }
          />
          <SystemProfileHealthCard
            heading="Technical Review Board (TRB)"
            body={
              <GridContainer>
                <Grid row>
                  <Grid desktop={{ col: 9 }}>
                    <p>
                      The TRB provides oversight to ensure IT investments are
                      consistent with CMS’s IT strategy.
                    </p>
                    <a href="/sandbox">Learn more about the TRB</a>
                  </Grid>
                  <Grid desktop={{ col: 3 }} style={{ textAlign: 'center' }}>
                    <i
                      style={{ color: 'red' }}
                      className="fa fa-times-circle fa-5x"
                    />
                    <br />
                    Need to Schedule
                  </Grid>
                </Grid>
              </GridContainer>
            }
            footer={<Button type="button">View TRB Information</Button>}
          />
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
