# Deploying the EASi Application

EASi code changes are deployed automatically through GitHub Actions. After a merge or commit to `main`, the `build` workflow will trigger; see [`.github/workflows/build.yml`](../.github/workflows/build.yml). This will run a series of checks and tests; if all pass, the application will be automatically deployed to the [dev environment](https://dev.easi.cms.gov). If this succeeds, engineers are then allowed to deploy the application to the [impl](https://impl.easi.cms.gov), and then [prod](https://easi.cms.gov) environments.

Once a deployment to dev is successful, GitHub will prompt reviewers to approve a deployment to production. Any member of the `CMSgov/oddball-easi` team can approve a production deployment. (The required reviewers for each environment can be viewed in the repo's [environments page](https://github.com/cms-enterprise/easi-app/settings/environments).) Once a reviewer approves the deployment, the workflow will run the deployment script for that environment.

## Approving a Deployment

When deploying to the impl and prod environments, it's important to test any new or modified behavior in the environment "before" it (e.g. if deploying to prod, test in impl. If deploying to impl, test in dev).

## Checking the Deployed Version

The `easi-app` backend has a health check endpoint at `/api/v1/healthcheck`, which returns (among other things) the Git hash of the deployed code. This can be used to verify that the code currently running in AWS matches the code committed in GitHub.

```bash
$ curl https://easi.cms.gov/api/v1/healthcheck

{"status":"pass","datetime":"2021-11-02 17:05:19+00:00","version":"d99f8e842ae7acc2d22b17016710ec95f34c6a15","timestamp":"1635872719"}
```

## Rollbacks

If a deployment needs to be rolled back, the current procedure is to use `git revert` on the merge commit that introduced a problem, create a PR with the reversion, and run it through the automatic deployment process.

## Details of the Deployment Process

While the GitHub Actions workflow orchestrates the deployment process, the bulk of the logic is handled by bash scripts in the `scripts` directory, particularly [`scripts/deploy_service`](/scripts/deploy_service), which deploys Docker containers to Amazon ECS (Elastic Container Service) by invoking a Lambda function, which calls the ECS API. This Lambda's source is [available on GitHub](https://github.com/trussworks/terraform-aws-lambda-ecs-manager/blob/master/functions/manager.py).

The Go backend is deployed as an ECS service; the React frontend is built as static content, then copied to an AWS S3 bucket by [`scripts/release_static`](/scripts/release_static).
