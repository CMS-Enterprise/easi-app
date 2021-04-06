# Architectural Decision Log

This log lists the architectural decisions for the CMS EASi application.

<!-- adrlog -->

- [ADR-0000](0000-open-source-application-code.md) - Open Source CMS EASi Application Code
- [ADR-0001](0001-separate-infra-repo.md) - Keep Infrastructure Code in a Separate Repo
- [ADR-0002](0002-use-terraform.md) - Define and manage infrastructure with Terraform
- [ADR-0003](0003-use-golang-for-server.md) - Use Go As Server Language
- [ADR-0004](0004-using-typescript.md) - Using Typescript
- [ADR-0005](0005-frontend-toolchain-choice.md) - *Use Create React App for frontend bootstrapping*
- [ADR-0006](0006-frontend-server-repo.md) - Keep Server and Frontend in Same Repository
- [ADR-0007](0007-go-for-scripting.md) - Use Go as CLI/Scripting Language
- [ADR-0008](0008-ssm-for-configsecrets.md) - Use AWS SSM Parameter Store for Config/Secrets management
- [ADR-0009](0009-logging-platform.md) - Use AWS logging tools
- [ADR-0010](0010-build-and-deploy-go-backend.md) - Build and deploy EASi backend to AWS Fargate
- [ADR-0011](0011-build-and-deploy-react.md) - Build frontend static files and deploy to AWS s3
- [ADR-0012](0012-backend-testing-suite.md) - Use Testify for Go Testing
- [ADR-0013](0013-backend-testing-structure.md) - Use Separate Integration Package for Go Integration Tests
- [ADR-0014](0014-use-mux-for-routing.md) - Use gorilla/mux for Routing
- [ADR-0015](0015-api-schema.md) - Use schema for API and frontend collaboration
- [ADR-0016](0016-migration-tool.md) - Use Flyway for Database Migration
- [ADR-0017](0017-go-orm.md) - *Use [sqlx](https://github.com/jmoiron/sqlx) for Go Database Access*
- [ADR-0018](0018-integration-tests-third-party-apis.md) - Mock third-party APIs in CI/CD integration tests
- [ADR-0019](0019-use-1password-for-sharing-secrets.md) - Use 1Password for sharing secrets
- [ADR-0020](0020-do-not-implement-state-machine.md) - Do not implement state machine to handle transitions in Services
- [ADR-0021](0021-audit-logging.md) - Audit Logging
- [ADR-0022](0022-generate-pdfs-with-prince.md) - Generate PDFs with Prince
- [ADR-0023](0023_508_systems_list_as_view_of_system_intakes.md) - 508 Systems List as View of `system_intakes`
- [ADR-0024](0024-soft-deleting.md) - Use `deleted_at` column for handling soft-delete of data
- [ADR-0025](0025-provide-testing-environments.md) - *Provide a Testing Environment for Non-Engineers*
- [ADR-0026](0026-cedar-data-definition.md) - CEDAR Data Model Definition
- [ADR-0027](0027-cicd-system.md) - Use GitHub Actions for CI/CD

<!-- adrlogstop -->
